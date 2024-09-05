# Markdown Code Highlighting with Shiki

## Installation and Basic Usage

Shiki is a tool that provides code highlighting for various themes and languages. It is particularly useful for easily applying highlighting to code blocks when converting Markdown files to HTML. In this article, we will explain how to apply code highlighting using Shiki.

### Installation

First, install the Shiki-related packages in your project. You can use the following command to install `@shikijs/rehype`.

```bash
npm i -D @shikijs/rehype
```

### Usage

To use Shiki, you will process the Markdown file and convert it to HTML using plugins from the `remark` and `rehype` series along with `unified`. Here is a basic usage example.

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeShiki from '@shikijs/rehype';

const file = await unified()
	.use(remarkParse) // Parse Markdown
	.use(remarkRehype) // Convert to HTML
	.use(rehypeShiki, {
		// Single theme
		// theme: 'vitesse-light' // Use a single theme

		// Multiple themes
		themes: {
			light: 'vitesse-light', // Light theme
			dark: 'vitesse-dark' // Dark theme
		}
	})
	.use(rehypeStringify) // Convert to HTML string
	.process(await fs.readFile('./input.md')); // Read and process the Markdown file
```

This code reads a file named `input.md`, applies Shiki with light/dark themes to the code blocks in that file, and converts it to HTML.

### Managing Shiki Instances

By default, the default export of `@shikijs/rehype` uses a shared Shiki instance from `getSingletonHighlighter`. This allows the instance to persist across multiple processes. However, if you want to have complete control over the lifecycle of the Shiki highlighter, you can use the fine-grained bundle from `@shikijs/rehype/core`.

## Using the Fine-Grained Bundle

If you want to load only the necessary parts instead of the entire Shiki bundle, you can use `rehypeShikiFromHighlighter`. Here is an example of using the fine-grained bundle.

```typescript
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypeShikiFromHighlighter from '@shikijs/rehype/core';

import { createHighlighterCore } from 'shiki/core';

const highlighter = await createHighlighterCore({
	themes: [
		import('shiki/themes/vitesse-light.mjs') // Light theme
	],
	langs: [
		import('shiki/langs/javascript.mjs') // JavaScript language highlighting
	],
	loadWasm: import('shiki/wasm') // Load WASM file
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
	.processSync(raw); // Can be processed synchronously
```

In this example, you can selectively load only the necessary themes and languages. This can reduce the bundle size and provide better performance.

## Conclusion

Shiki is a powerful tool for highlighting code blocks in Markdown files. It supports various themes and languages and renders on the server, which does not burden client performance. Follow the methods described above to set up Shiki and apply the appropriate themes for your project. You can also use the fine-grained bundle as needed or take advantage of additional features like line highlighting.

