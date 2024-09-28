import Category from '$lib/post/Category.js';
import Post from '$lib/post/Post.js';
import * as m from '$lib/paraglide/messages.js';

/** @type {import('./$types').PageServerLoad} */
export async function load({ url }) {
	const categoryPromise = Category.getCategory(url.pathname)?.toSerialize();
	const postPromise = Post.getPosts(url.pathname)?.toSerialize();

	const [category, post] = await Promise.all([categoryPromise, postPromise]);

	// post 가 있으면 반드시 post.data 가 있기 때문에 null 체크를 하지 않아도 된다.
	const title = post ? post.data.title : category ? category.name : m.title();
	const description = post ? post.data.description : m.description();

	const og = post
		? {
				title: post.data.title,
				description: post.data.description,
				keywords: post.data.keywords,
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
