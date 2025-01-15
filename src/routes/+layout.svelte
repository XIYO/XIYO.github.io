<script>
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';
	import { invalidate, onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { onSetLanguageTag } from '$lib/paraglide/runtime.js';

	// components
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/Header.svelte';

	// styles
	import '$lib/stylesheet/app.css';
	import '$lib/stylesheet/view-transition.css';
	import 'rehype-callouts/theme/github';
	import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css';
	import 'pretendard-jp/dist/web/variable/pretendardvariable-jp-dynamic-subset.css';
	import '@kfonts/neodgm-code/index.css';

	const { children } = $props();

	onSetLanguageTag(() => {
		invalidate('language:current');
	});

	onNavigate((navigation) => {
		// 모션 감소 설정 감지
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

		// 만약 startViewTransition이 없거나 모션 감소가 설정되어 있으면 트랜지션을 실행하지 않음
		if (
			prefersReducedMotion ||
			!document.startViewTransition ||
			navigation.to.url.pathname === navigation.from.url.pathname
		) {
			return;
		}

		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});

			transition.updateCallbackDone.then(() => {});

			transition.ready.then(() => {});

			transition.finished.then(() => {});
		});
	});
</script>

<svelte:head>
	<title>{page.data.title}</title>
	<meta name="description" content={page.data.description} />
	<link rel="canonical" href={page.url.origin + page.url.pathname} />
	{#if page.data.og.title}
		<meta property="og:title" content={page.data.og.title} />
	{/if}
	{#if page.data.og.description}
		<meta property="og:description" content={page.data.og.description} />
	{/if}
	{#if page.data.og.type}
		<meta property="og:type" content={page.data.og.type} />
	{/if}
	{#if page.data.og.url}
		<meta property="og:url" content={page.data.og.url} />
	{/if}
	{#if page.data.og.imageUrl}
		<meta property="og:image" content={page.data.og.imageUrl} />
	{/if}
	{#if page.data.og.author}
		<meta property="article:author" content={page.data.og.author} />
	{/if}
	{#if page.data.og.publishedTime}
		<meta property="article:published_time" content={page.data.og.publishedTime} />
	{/if}
	{#if page.data.og.modifiedTime}
		<meta property="article:modified_time" content={page.data.og.modifiedTime} />
	{/if}
	{#if page.data.og.section}
		<meta property="article:section" content={page.data.og.section} />
	{/if}
    {#if page.data.og.tags}
        {#each page.data.og.tags as tag}
            <meta property="article:tag" content={tag}/>
        {/each}
    {/if}
    <!--{#if page.data.og.keywords}-->
    <!--	<meta name="keywords" content={page.data.og.keywords} />-->
    <!--{/if}-->
</svelte:head>

<ParaglideJS {i18n}>
	<div id="container-content">
		<Header title={page.data.title} />
		<main class="margin-block">
			{@render children()}
		</main>
		<Footer gitLog={page.data.gitLog} />
	</div>
	<Nav />
</ParaglideJS>

<style>
	#container-content {
		margin: var(--default-margin);
	}

	/**
	 * 내비게이션의 기본 위치 정의
	 **/
	:global(#border-outer-nav) {
		margin-inline-start: calc(100% - (var(--nav-min-inline-size) + var(--default-margin)));
	}

	/* 최초의 컨테이너라서 컨테이너 쿼리로 지정할 수 없어 미디어 쿼리로 사이즈를 조절한다 */
	/*!* 소형 모니터 이상 *!*/
	@media (1024px <= width) {
		#container-content {
			margin-inline-end: calc(var(--nav-min-inline-size) + calc(var(--default-margin) * 2));
		}
	}

	/* 소형 모니터 미만 */
	@media (width < 1024px) {
		:root:has(:global(#border-outer-nav:not(:popover-open))) :global(#border-outer-nav) {
			/* 화면밖으로 나갈때 사진의 영역 + 마진 까지 계산 */
			transform: translateX(calc(100% + var(--default-margin)));
		}
	}

	/* 태블릿 이상 해상도 */
	@media (768px <= width) {
	}

	/* 태블릿 미만 해상도 */
	@media (width < 768px) {
	}

	/* 모바일 이상 해상도 */
	@media (425px <= width) {
	}

	/* 모바일 미만 해상도 */
	@media (width < 425px) {
	}

	@media (prefers-reduced-motion: no-preference) {
		#container-content {
			transition: margin 0.5s;
		}
	}
</style>
