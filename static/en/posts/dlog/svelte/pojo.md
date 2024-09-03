# Svelte Development Log 1, POJO

I like Markdown, and my favorite syntax within it is [mermaidjs](https://mermaid.js.org/).

However, since Mermaid is designed to work in the browser, I couldn't find a way to make it work in the "No Javascript" environment that I consider important for my blog, so I temporarily gave up.

While pondering how to parse and send it in advance, I discovered the [remark-mermaidjs](https://github.com/remcohaszing/remark-mermaidjs) plugin and applied it.

> [!note]
> This plugin uses "playwright" in the Node environment to simulate a browser environment to render Mermaid.

## Problem

![Mermaid results disappear during hydration process](/static/resources/record-2024-08-11-201239.gif)

However, a problem soon arose. As mentioned earlier, since Mermaid is a tool that operates in the browser, there was an issue where the rendering results from the server and the browser differed during the hydration phase, causing the content to disappear.

## Solution

Since the code in `+page.js` is executed once on both the server and client during the hydration process, I decided to move the Markdown parsing code to `+page.server.js` to skip the hydration process.

**Code causing POJO error:**

```js
import Category from '$lib/post/Category.js';
import Post from '$lib/post/Post.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	return {
		post: Post.getPosts(url.pathname), // POJO error, returns class instance
		category: Category.getCategory(url.pathname) // POJO error, returns class instance
	};
}
```

**Error:**

```sh
... Cannot stringify arbitrary non-POJOs ...
```

A rendering error occurred because it wasn't returning a POJO. So, I added serialization functions to each class's methods to return POJO objects.

**Code returning POJO:**

```diff
import Category from '$lib/post/Category.js';
import Post from '$lib/post/Post.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
  return {
--   post: Post.getPosts(url.pathname), // POJO error, returns class instance
++   post: Post.getPosts(url.pathname).toSerialize(), // POJO return
--   category: Category.getCategory(url.pathname)  // POJO error, returns class instance
++   category: Category.getCategory(url.pathname).toSerialize() // POJO return
  };
}
```

## Other Solutions

There are other ways to solve this using:
- JSON.stringify()
- serialize-javascript
- structuredClone()

However, in my case, serialization was not possible with other tools, so I created my own function to proceed.
