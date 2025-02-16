<script>
	const { children } = $props();
</script>

<div class="highlight-background">
	{@render children()}
</div>

<style>
	div {
		/* reset */
		margin-block: 0;

		padding: var(--default-padding);
	}
</style>
