<script>
	import Border from '$lib/ui/Border.svelte';
	import BorderHeader from '$lib/ui/BorderHeader.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const { category } = $props();
</script>

<div id="posts-post-container">
	<Border id="category" viewTransitionName="category" negative>
		<BorderHeader title="categories" />

		{#if category.childCategories.length}
			<ul class="padding">
				{#each category.childCategories as childCategory}
					<li>
						<a href={childCategory.absolutePath}>
							{childCategory.name} ({childCategory.allPosts.length})
						</a>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="padding margin-block-reset">{m.subCategoryEmpty()}</p>
		{/if}
	</Border>

	<Border id="article" viewTransitionName="posts" negative>
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
</div>

<style>
	#posts-post-container {
		display: grid;
		gap: var(--default-margin);

		@container main ( 768px <= inline-size) {
			grid-template-columns: repeat(2, 1fr);
			& > :global(*) {
				block-size: fit-content;
			}
		}
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
