import Post from '$lib/post/Post.js';
import { availableLanguageTags } from '$lib/paraglide/runtime.js';
import { i18n } from '$lib/i18n.js';

export default class Category {
	static #categories = new Map();
	static #root;
	/** @type {string} */
	#absolutePath;
	/** @type {Map<string, Category>} */
	#childCategories = new Map();
	/** @type {Map<string, Post>} */
	#posts = new Map();
	#serialized;

	static {
		this.#root = new Category(''); // 정적 필드 초기화

		// 기존의 Category[symbol]()에서 하던 초기화 작업
		const markdowns = import.meta.glob('/static/**/*.md');

		Object.entries(markdowns).forEach(([path, markdownAsync]) => {
			let absolutePath = path
				.replace(/^\/static/, '') // 스태틱 경로 제거
				.replace(/\.md$/, ''); // 확장자 제거

			this.#initCategories({ absolutePath, markdownAsync });
		});
	}

	/**
	 * 카테고리 생성자
	 * @param {string} absolutePath 접근 가능한 절대 경로
	 */
	constructor(absolutePath) {
		const key = Symbol.for(absolutePath);
		Category.#categories.set(key, this);

		const split = absolutePath.split('/');
		if (availableLanguageTags.includes(split[1])) {
			// 언어 코드가 포함되어 있으면 제거
			split.splice(1, 1); // 1번 인덱스의 요소를 제거
		}

		this.#absolutePath = split.join('/');
	}

	get name() {
		return this.#absolutePath.split('/').at(-1);
	}

	get absolutePath() {
		return this.#absolutePath;
	}

	get allChildCategories() {
		let allChildCategories = [];

		for (const childCategory of this.#childCategories.values()) {
			allChildCategories.push(childCategory);
			allChildCategories.push(...childCategory.allChildCategories);
		}

		return allChildCategories;
	}

	/**
	 * 자식 카테고리 목록 반환
	 * @returns {Category[]}
	 */
	get childCategories() {
		return Array.from(this.#childCategories.values());
	}

	/**
	 * 자신의 포스트 목록 반환
	 * @returns {Post[]}
	 */
	get posts() {
		return Array.from(this.#posts.values());
	}

	/**
	 * 자신과 하위 카테고리의 포스트 반환
	 * @returns {Post[]} 포스트 목록
	 */
	get allPosts() {
		const posts = Array.from(this.#posts.values());

		for (const childCategory of this.#childCategories.values()) {
			posts.push(...childCategory.allPosts);
		}

		return posts;
	}

	/**
	 * 최상위 경로를 찾을 때는 공백 문자열을 인자로 넘겨주세요.
	 * @param {string} absolutePath
	 * @returns {Category | undefined}
	 */
	static getCategory(absolutePath) {
		const key = Symbol.for(absolutePath);
		let category = this.#categories.get(key);

		if (!category) {
			const alternativePath = i18n.route(absolutePath);
			const alternativeKey = Symbol.for(alternativePath);
			category = this.#categories.get(alternativeKey);
		}

		return category;
	}

	static #initCategories(
		{ absolutePath, markdownAsync },
		{ category = this.#root, index = 0 } = {}
	) {
		const splitPath = absolutePath.split('/');
		const absolutePaths = splitPath;
		const categoryAbsolutePath = splitPath.slice(0, index + 1).join('/');

		if (absolutePaths.length > index + 1) {
			const key = Symbol.for(categoryAbsolutePath);
			if (!this.#categories.has(key)) category.addChildCategory(new Category(categoryAbsolutePath));
			const targetCategory = this.#categories.get(key);

			this.#initCategories(
				{ absolutePath, markdownAsync },
				{ category: targetCategory, index: index + 1 }
			);
		} else {
			const post = new Post({ absolutePath, markdownAsync });
			category.addPost(post);
		}
	}

	/**
	 * 카테고리 추가
	 * @param {Category} category
	 */
	addChildCategory(category) {
		this.#childCategories.set(category.#absolutePath, category);
	}

	/**
	 * 포스트 추가
	 * @param {Post} post 추가할 포스트
	 */
	addPost(post) {
		this.#posts.set(post.absolutePath, post);
	}

	async toSerialize() {
		if (this.#serialized) {
			return this.#serialized;
		}

		const postsPromise = Promise.all(this.allPosts.map((post) => post.toSerialize()));
		const childCategoriesPromise = Promise.all(
			this.childCategories.map((category) => category.toSerialize())
		);

		const [posts, childCategories] = await Promise.all([postsPromise, childCategoriesPromise]);

		posts.sort((a, b) => {
			return new Date(b.gitLog.at(-1).datetime) < new Date(a.gitLog.at(-1).datetime);
		});

		return (this.#serialized = {
			name: this.name,
			absolutePath: this.#absolutePath,
			childCategories: childCategories,
			allPosts: posts
		});
	}
}
