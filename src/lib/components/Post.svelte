<script>
	import Card from '$lib/ui/card/Card.svelte';
	import { languageTag } from '$lib/paraglide/runtime.js';

	const { post } = $props();

	const locale = new Intl.Locale(languageTag());

	const firstCommitDate = new Date(post.gitLog.at(-1).datetime);
	const lastCommitDate = new Date(post.gitLog.at(0).datetime);

	const dateFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
	const dateTimeFormat = new Intl.DateTimeFormat(locale.baseName, dateFormatOptions);

	const firstCommitDateString = dateTimeFormat.format(firstCommitDate);
	const lastCommitDateString = dateTimeFormat.format(lastCommitDate);
</script>

<Card viewTransitionName="post" negative>
	<div id="post-content" class="content padding">
		{@html post.value}
	</div>

	<div id="post-footer" class="highlight-background">
		<div>
			<div>first commit : {firstCommitDateString}</div>
			{#if firstCommitDateString !== lastCommitDateString}
				<div>last commit : {lastCommitDateString}</div>
			{/if}
		</div>
	</div>
</Card>

<style>
	:global(#border-outer-post) {
		margin-block: var(--default-margin);
	}

	#post-footer {
		padding: calc(var(--default-padding) / 2) var(--default-padding);
		font-size: 0.75rem;

		& > div {
			overflow-x: auto;

			&::-webkit-scrollbar-thumb {
				background-color: var(--color-default-black);
			}

			&::-webkit-scrollbar-thumb:hover {
				background-color: #494949;
			}
		}

		/* typography */
		text-align: end;
		font-variant-numeric: tabular-nums;
		text-transform: uppercase;
		text-wrap: nowrap;
	}
</style>
