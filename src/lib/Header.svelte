<script>
	import Border from '$lib/ui/Border.svelte';
	import NavButton from '$lib/components/NavButton.svelte';

	const { title } = $props();
</script>

<Border id="header" viewTransitionName="header" tag="header">
	<h1>{title}</h1>

	<NavButton popovertargetaction="toggle" />
</Border>

<style>
	:global(#border-outer-header) {
		margin-block: var(--default-margin);
	}

	:global(#border-content-header) {
		display: flex;
		justify-content: space-between;

		h1 {
			/* reset */
			margin-block: 0;

			flex-grow: 1;

			/* reset */
			margin-block: 0;

			/* 마진에 패딩값을 주는 이유,
			 * 스크롤바가 보더 레이어스에 겹쳐 잘리기 때문
			 */
			margin-inline: var(--default-padding);
			padding-block: calc(var(--default-padding) / 2);

			align-content: center;
			text-transform: uppercase;

			overflow-x: auto;
			text-wrap: nowrap;
		}
	}
</style>
