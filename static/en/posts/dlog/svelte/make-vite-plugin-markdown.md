# Creating a Markdown Parser Plugin

While building this blog, I realized I needed a Markdown parser.

Initially, I used `marked`, but to avoid reinventing the wheel and to take advantage of a broader ecosystem, I decided to switch to `unified`.

## Loading Markdown Files

One of the most challenging aspects of parsing Markdown was that while Vite can import files like `_.jpg` and `_.css`, it doesn't natively support importing `*.md` files.

Since I wasn't familiar with the inner workings, I initially resorted to loading the raw code and then parsing it.

```js
import myPost from './my-post.md?raw';

const html = unified().use(somePlugin).process(myPost);

// or

const markdowns = import.meta.glob('./posts/*.md', {
  query: '?raw',
  eager: true,
  import: 'default'
});

let htmls = [];
Object.entries(markdowns).forEach(([path, md]) => {
  const html = unified().use(somePlugin).process(md);

  htmls.push(html);
});
```

However, this approach led to messy code, and encapsulation became necessary.

## Creating the Plugin

While searching for a tool to parse `*.md` files in Vite, I came across `vite-plugin-md`. After spending three hours debugging errors, I discovered that this plugin is exclusively for "Vue." 😂 It was a bit frustrating... (was it a bait?)

So, I decided to create my own plugin. The code was already written, and I just needed to convert it into a plugin format.

`my-vite-plugin-markdown.js` plugin:

```js
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkMermaid from 'remark-mermaidjs';
import rehypeShiki from '@shikijs/rehype-shiki';
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
        // Only process .md files
        // Extract Git log information and add it to the frontmatter
        const gitHistory = getGitHistory(id);

        let frontmatter = {};
        // Convert Markdown to HTML and extract the title here.
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

                // Remove /static from the src attribute of img tags
                if (node.tagName === 'img' && node.properties && node.properties.src) {
                  node.properties.src = node.properties.src.replace(/^\/static/, '');
                }
              });
            };
          })
          .use(rehypeStringify);

        const result = await processor.process(code);

        // Add Git information to the existing frontmatter
        frontmatter = {
          ...frontmatter,
          ...result.data.frontmatter,
          firstCommitDate: gitHistory[gitHistory.length - 1].date, // Oldest commit
          lastCommitDate: gitHistory[0].date // Most recent commit
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

Applying the plugin in `vite.config.js`:

```js
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import markdown from './src/lib/plugin/my-vite-plugin-markdown.js';

export default defineConfig({
  plugins: [enhancedImages(), sveltekit(), markdown()]
});
```

Using the plugin in `+page.server.js`:

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

(Though the code could use some cleanup), one interesting feature is extracting the creation time of the Markdown file from Git history and adding it to the frontmatter.

I originally started this blog with Jekyll, but the idea of inserting frontmatter into Markdown felt like it was cluttering the document, so I chose this method.

Additionally, to ensure it works well in a no-js environment, which is one of the standards for the blog, I pre-parse `mermaid` syntax on the server to make it usable in a wider range of environments.

## Conclusion

Next, I plan to create and apply an `asciinema` parser.
