<script>
	/**
	 * @type {{ popovertargetaction?: 'toggle' | 'hide' | 'show' | null | undefined }}
	 */
	const { popovertargetaction } = $props();
</script>

<button aria-label="Toggle navigation" popovertarget="border-outer-nav" {popovertargetaction}>
	<span style="display: none">menu {popovertargetaction}</span>
</button>

<style>
	button {
		/* reset */
		border: unset;
		background-color: unset;

		&::after {
			content: '⛱️';
			display: inline-block;
			font-size: 1.5rem;
		}

		@media (prefers-reduced-motion: no-preference) {
			transition: opacity var(--default-animation-duration);
		}

		/* 데스크톱 소형 디스플레이 초과 해상도 */
		@media (1024px < width) {
			pointer-events: none;
			opacity: 0;
		}

		/* 데스크톱 소형 디스플레이 */
		@media (width <= 1024px) {
			cursor: pointer;
		}
	}

	:global(nav) button::after {
		content: '🏖️';
	}
</style>
