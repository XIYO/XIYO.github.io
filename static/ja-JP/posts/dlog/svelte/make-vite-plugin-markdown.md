# マークダウンパーサープラグインの作成

このブログを作成する際に、マークダウンパーサーが必要でした。

最初は `marked` を使用していましたが、無駄に車輪を再発明しないために、エコシステムがもう少し広い `unified` を使用することにしました。

## マークダウンファイルのロード

マークダウンのパースで最も難しかったことの一つは、vite が "*.jpg" や "*.css" をインポートできるのに対し、"*.md" をインポートできないことでした。

動作原理がわからなかったため、最初は `raw` コードを読み込んでパースしていました。

```js
import myPost from './my-post.md?raw';

const html = unified().use(somePlugin).process(myPost);

// または

const markdowns = import.meta.glob('./posts/*.md', {
	query: '?raw',
	eager: true,
	import: 'default'
});

htmls = [];
Object.entries(markdowns).forEach(([path, md]) => {
	const html = unified().use(somePlugin).process(md);

	htmls.push(html);
});
```

このようにしているうちにコードが煩雑になり、カプセル化が必要になりました。

## プラグインの作成

そこで、"*.md" を vite でパースしてくれるツールがないか検索したところ、`vite-plugin-md` が見つかりました。しかし、3時間エラーと戦った結果、このプラグインは "vue" 専用であることがわかりました。😂 ちょっと驚いて困惑しました...（釣りだったのか...？）

それで、直接作ることにしました。すでにコードは書かれており、プラグイン形式に変換するだけで済みました。

`my-vite-plugin-markdown.js` プラグイン

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkMermaid from 'remark-mermaidjs';
import rehypeShiki from '@shikijs/rehype';
import remarkFrontmatter from 'remark-frontmatter';
import remarkParseFrontmatter from 'remark-parse-frontmatter';
import callouts from 'remark-callouts';
import { execSync } from 'child_process';
import { visit } from 'unist-util-visit';

export default function () {
	return {
		name: 'my-vite-plugin-markdown',
		enforce: 'pre',

		async transform(code, id) {
			if (id.endsWith('.md')) {
				// .md ファイルの場合のみ処理
				// Git ログ情報を抽出してフロントマターに追加
				const gitHistory = getGitHistory(id);

				let frontmatter = {};
				// マークダウンを HTML に変換します。title はここで抽出します。
				let processor = unified()
					.use(remarkParse)
					.use(remarkFrontmatter)
					.use(remarkParseFrontmatter)
					.use(remarkGfm)
					.use(callouts)
					.use(remarkMermaid, {
						mermaidConfig: {
							theme: 'dark'
						}
					})
					.use(remarkRehype)
					.use(rehypeShiki, {
						theme: 'vitesse-dark'
					})
					.use(() => {
						return (tree) => {
							visit(tree, 'element', (node, index, parent) => {
								if (node.tagName === 'h1' && node.children && node.children.length > 0) {
									frontmatter.title = node.children[0].value || '';
									parent.children.splice(index, 1, ...node.children);
								}

								// 画像タグの src 属性から /static を削除
								if (node.tagName === 'img' && node.properties && node.properties.src) {
									node.properties.src = node.properties.src.replace(/^\/static/, '');
								}
							});
						};
					})
					.use(rehypeStringify);

				const result = await processor.process(code);

				// 既存のフロントマターに Git 情報を追加
				frontmatter = {
					...frontmatter,
					...result.data.frontmatter,
					firstCommitDate: gitHistory[gitHistory.length - 1].date, // 最も古いコミット
					lastCommitDate: gitHistory[0].date // 最も最近のコミット
				};

				const markdown = {
					frontmatter,
					content: result.value
				};

				return {
					code: `export default ${JSON.stringify(markdown)};`,
					map: null
				};
			}
		}
	};
}

// Git ログ情報を抽出する関数
function getGitHistory(filePath) {
	try {
		const output = execSync(
			`git log --follow --pretty=format:"%ad, %s" --date=format:"%Y-%m-%dT%H:%M%z" "${filePath}"`
		)
			.toString()
			.trim();

		return output.split('\n').map((line) => {
			const [date, subject] = line.split(', ');
			return { date, subject };
		});
	} catch (error) {
		console.error(`Error fetching git history for ${filePath}:`, error);
		return { firstCommitDate: null, lastCommitDate: null, history: [] };
	}
}
```

`vite.config.js` でプラグインを適用

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import markdown from './src/lib/plugin/my-vite-plugin-markdown.js';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit(), markdown()]
});
```

`+page.server.js` で使用

```js
import Category from '$lib/post/Category.js';
import Post from '$lib/post/Post.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const post = Post.getPosts(url.pathname)?.toSerialize();
	const category = Category.getCategory(url.pathname)?.toSerialize();

	return {
		title: post?.frontmatter.title || category?.name || undefined,
		post: post,
		category: category
	};
}
```

（少し整理が必要なコードですが）面白い機能の一つは、マークダウンの作成時間を Git ヒストリーから抽出してフロントマターにする機能です。

最初はブログをジキルで始めましたが、マークダウンにフロントマターを挿入するのは少し文書を汚す気がしたので、この方法を選びました。

また、ブログの基準の一つである no-js 環境でもうまく動作するように、`mermaid` 構文もサーバーで事前にパースして提供することで、より多様な環境で使用できるようにしました。

## おわりに

これから `asciinema` パーサーを作成して適用する予定です。

