<script>
	import Border from '$lib/ui/Border.svelte';
	import BorderHeader from '$lib/ui/BorderHeader.svelte';
	import { i18n } from '$lib/i18n.js';

	const { category } = $props();
</script>

{#if category.childCategories.length}
	<Border id="category" viewTransitionName="category" negative>
		<BorderHeader title="categories" />

		<ul class="padding">
			{#each category.childCategories as childCategory}
				<li>
					<a href={childCategory.absolutePath}
						>{childCategory.name} ({childCategory.allPosts.length})</a
					>
				</li>
			{/each}
		</ul>
	</Border>
{/if}

<Border id="article" viewTransitionName="article" negative>
	<BorderHeader title="posts" />

	<ul class="padding">
		{#each category.allPosts as post}
			<li>
				<article>
					<a href={post.absolutePath}>{post.data.title}</a>
				</article>
			</li>
		{/each}
	</ul>
</Border>

<style>
	:global(#border-outer-category, #border-outer-article) {
		margin-block: var(--default-margin);
	}

	ul {
		/* reset */
		list-style: none;
		margin-block: unset;

		li:not(:last-child) {
			margin-block-end: 0.5rem;
		}
	}
</style>
