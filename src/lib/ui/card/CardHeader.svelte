<script>
	const { children } = $props();
</script>

<h2 class="highlight-background">
	{@render children()}
</h2>

<style>
	h2 {
		/* reset */
		margin-block: 0;

		padding: var(--default-padding);

		align-content: center;
		text-transform: uppercase;

		overflow-x: scroll; /* 의도적 미리 계산, 레이아웃 쉬프트 방지 */
		text-wrap: nowrap;

		&::-webkit-scrollbar-thumb {
			background-color: var(--color-default-black);
		}

		&::-webkit-scrollbar-thumb:hover {
			background-color: #494949;
		}
	}
</style>
