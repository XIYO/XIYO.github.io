<script>
	import { i18n } from '$lib/i18n.js';
	import { page } from '$app/state';
</script>

<ul>
	<li aria-current={i18n.route(page.url.pathname) === '/' ? 'page' : undefined}>
		<a href="/">home</a>
	</li>
	<li aria-current={i18n.route(page.url.pathname).startsWith('/posts') ? 'page' : undefined}>
		<a href="/posts">posts</a>
	</li>
	<li aria-current={i18n.route(page.url.pathname) === '/about' ? 'page' : undefined}>
		<a href="/about">about</a>
	</li>
	<li aria-current={i18n.route(page.url.pathname) === '/globe' ? 'page' : undefined}>
		<a href="/globe">globe</a>
	</li>
</ul>

<style>
	ul {
		/* reset */
		padding-inline-start: unset;
		list-style-type: none;

		display: grid;
		gap: var(--default-margin);
	}

	li[aria-current='page'] {
		color: var(--color-primary);
	}
</style>
