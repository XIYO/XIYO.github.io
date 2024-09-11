<script>
	import { availableLanguageTags } from '$lib/paraglide/runtime.js';
	import { i18n } from '$lib/i18n.js';
	import { page } from '$app/stores';
</script>

<ul>
	{#each availableLanguageTags as lang}
		<li>
			<a href={i18n.route($page.url.pathname)} hreflang={lang}>
				{lang}
			</a>
		</li>
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
