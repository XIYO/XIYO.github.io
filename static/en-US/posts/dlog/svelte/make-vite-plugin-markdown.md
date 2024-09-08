# Creating a Markdown Parser Plugin

While building this blog, I needed a Markdown parser.

Initially, I used `marked`, but to avoid reinventing the wheel, I decided to use `unified`, which has a broader ecosystem.

## Loading Markdown Files

One of the most challenging aspects of Markdown parsing was that Vite can import "*.jpg" and "*.css" files, but it couldn't import "*.md" files.

Since I didn't know how it worked initially, I started by loading the `raw` code and parsing it.

```js
import myPost from './my-post.md?raw';

const html = unified().use(somePlugin).process(myPost);

// or

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

As I continued with this approach, the code became messy, and encapsulation became necessary.

## Creating the Plugin

So, I searched for a tool that could parse "*.md" files in Vite and found `vite-plugin-md`. However, after three hours of battling errors, I discovered that this plugin was "Vue"-specific. 😂 I was a bit taken aback and confused... (Was it a trap...?)

Thus, I decided to create my own. The code was already written, and I just needed to convert it to the plugin format.

`my-vite-plugin-markdown.js` plugin

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
				// Process only if it's a .md file
				// Extract Git log information to add to frontmatter
				const gitHistory = getGitHistory(id);

				let frontmatter = {};
				// Convert Markdown to HTML. Extract title here.
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

								// Remove /static from the src attribute of image tags
								if (node.tagName === 'img' && node.properties && node.properties.src) {
									node.properties.src = node.properties.src.replace(/^\/static/, '');
								}
							});
						};
					})
					.use(rehypeStringify);

				const result = await processor.process(code);

				// Add Git information to existing frontmatter
				frontmatter = {
					...frontmatter,
					...result.data.frontmatter,
					firstCommitDate: gitHistory[gitHistory.length - 1].date, // oldest commit
					lastCommitDate: gitHistory[0].date // most recent commit
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

// Function to extract Git log information
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

Applying the plugin in `vite.config.js`

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import markdown from './src/lib/plugin/my-vite-plugin-markdown.js';

export default defineConfig({
	plugins: [enhancedImages(), sveltekit(), markdown()]
});
```

Using it in `+page.server.js`

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

(Although the code needs a bit of tidying up) one interesting feature is that it extracts the writing time of the Markdown from the Git history and creates it as frontmatter.

I initially started this blog with Jekyll, and I felt that inserting frontmatter into Markdown somewhat dirtied the document, so I chose this method.

Additionally, to ensure that it runs well in a no-JS environment, one of the blog's criteria, I pre-parse the `mermaid` syntax on the server to make it usable in a wider range of environments.

## Conclusion

Next, I plan to create and apply an `asciinema` parser.

