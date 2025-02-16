<script>
	import Card from '$lib/ui/card/Card.svelte';
	import CardHeader from '$lib/ui/card/CardHeader.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const { category } = $props();
</script>

<div id="posts-post-container">
	<Card id="category" viewTransitionName="category" negative>
		<CardHeader title="categories" />

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
	</Card>

	<Card id="article" viewTransitionName="posts" negative>
		<CardHeader title="posts" />

		<ul class="padding">
			{#each category.allPosts as post}
				<li>
					<article>
						<a href={post.absolutePath}>{post.data.title}</a>
					</article>
				</li>
			{/each}
		</ul>
	</Card>
</div>

<style>
	#posts-post-container {
		display: grid;
		gap: var(--default-margin);

		@media (768px <= width) {
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
