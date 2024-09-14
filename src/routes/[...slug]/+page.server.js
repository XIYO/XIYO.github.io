import Category from '$lib/post/Category.js';
import Post from '$lib/post/Post.js';
import * as m from '$lib/paraglide/messages.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const categoryPromise = Category.getCategory(url.pathname)?.toSerialize();
	const postPromise = Post.getPosts(url.pathname)?.toSerialize();

	const [category, post] = await Promise.all([categoryPromise, postPromise]);

	const title = post ? post.data.title : category ? category.name : m.title();
	const description = post ? post.data.description : m.description();

	const og = post
		? {
				title: post.data.title,
				description: post.data.description,
				type: post ? 'article' : 'website',
				url: url.href,
				author: Array.from(new Set(post.gitLog.map((entry) => entry.author))).join(', '),
				publishedTime: post.gitLog.at(0).datetime,
				modifiedTime: post.gitLog.at(-1).datetime
			}
		: {};

	return {
		title,
		description,
		category,
		post,
		og
	};
}
