# Shikiと共にMarkdownコードハイライティング

## インストールと基本的な使い方

Shikiは、さまざまなテーマとプログラミング言語に対してコードハイライティングを提供するツールです。特に、MarkdownファイルをHTMLに変換する際に、コードブロックに対するハイライティングを簡単に適用できます。この記事では、Shikiを使用してコードハイライティングを適用する方法を説明します。

### インストール

まず、プロジェクトにShiki関連のパッケージをインストールします。以下のコマンドを使用して`@shikijs/rehype`をインストールできます。

```bash
npm i -D @shikijs/rehype
```

### 使い方

Shikiを使用するには、`unified`と共に`remark`および`rehype`シリーズのプラグインを使用してMarkdownファイルを処理し、HTMLに変換します。以下は基本的な使用例です。

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeShiki from '@shikijs/rehype';

const file = await unified()
	.use(remarkParse) // Markdownをパース
	.use(remarkRehype) // HTMLに変換
	.use(rehypeShiki, {
		// 単一テーマ
		// theme: 'vitesse-light' // 単一テーマを使用

		// 複数テーマ
		themes: {
			light: 'vitesse-light', // ライトテーマ
			dark: 'vitesse-dark' // ダークテーマ
		}
	})
	.use(rehypeStringify) // HTML文字列に変換
	.process(await fs.readFile('./input.md')); // Markdownファイルを読み込み処理
```

このコードは`input.md`というファイルを読み込み、そのファイルのコードブロックにShikiを使用してライト/ダークテーマを適用した後、HTMLに変換します。

### Shikiインスタンスの管理

基本的に`@shikijs/rehype`のデフォルトエクスポートは、`getSingletonHighlighter`で共有されるShikiインスタンスを使用します。これは複数のプロセスでインスタンスが持続することを意味します。しかし、Shikiハイライターのライフサイクルを完全に制御したい場合は、`@shikijs/rehype/core`の細分化されたバンドル（Fine-grained Bundle）を使用できます。

## 細分化されたバンドルの使い方

Shikiの全体バンドルの代わりに、必要な部分だけをインポートして使用したい場合は、`rehypeShikiFromHighlighter`を使用できます。以下は細分化されたバンドルを使用する例です。

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';

import { createHighlighterCore } from 'shiki/core';

const highlighter = await createHighlighterCore({
	themes: [
		import('shiki/themes/vitesse-light.mjs') // ライトテーマ
	],
	langs: [
		import('shiki/langs/javascript.mjs') // JavaScript言語ハイライティング
	],
	loadWasm: import('shiki/wasm') // WASMファイルをロード
});

const raw = await fs.readFile('./input.md');
const file = await unified()
	.use(remarkParse)
	.use(remarkRehype)
	.use(rehypeShikiFromHighlighter, highlighter, {
		themes: {
			light: 'vitesse-light',
			dark: 'vitesse-dark'
		}
	})
	.use(rehypeStringify)
	.processSync(raw); // 同期的に処理可能
```

この例では、必要なテーマとプログラミング言語だけを選択的にインポートして使用できます。これにより、バンドルサイズを削減し、より良いパフォーマンスを提供できます。

## 結論

ShikiはMarkdownファイルのコードブロックをハイライティングする強力なツールです。さまざまなテーマとプログラミング言語をサポートしており、サーバーでレンダリングするため、クライアントのパフォーマンスに負担をかけません。上記で説明した方法を通じてShikiを設定し、プロジェクトに適したテーマを適用してみてください。必要に応じて細分化されたバンドルを使用したり、行ハイライティングなどの追加機能を活用することもできます。
