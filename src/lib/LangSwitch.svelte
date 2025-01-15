<script>
	import { availableLanguageTags } from '$lib/paraglide/runtime.js';
	import { i18n } from '$lib/i18n.js';
	import { page } from '$app/state';
</script>

{#snippet switcher({href, lang})}
	<li>
		<a {href} hreflang={lang}>
			{lang}
		</a>
	</li>
{/snippet}

<ul>
	{#each availableLanguageTags as lang}
		{@render switcher({href: i18n.route(page.url.pathname), lang})}
	{/each}
</ul>

<style>
	ul {
		/* reset */
		padding-inline-start: unset;
		list-style-type: none;

		display: grid;
		gap: var(--default-margin);
		text-align: end;
	}
</style>
