<script>
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { i18n } from '$lib/i18n';

	import '$lib/stylesheet/app.css';
	import '$lib/stylesheet/view-transition.css';
	import Nav from '$lib/components/Nav.svelte';
	import { onNavigate } from '$app/navigation';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/Header.svelte';
	import { page } from '$app/stores';
	import 'rehype-callouts/theme/github';

	const { children } = $props();

	onNavigate((navigation) => {
		if (
			!document.startViewTransition ||
			navigation.to.url.pathname === navigation.from.url.pathname
		)
			return;

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
	<title>{$page.data.title}</title>
	<meta name="description" content={$page.data.description} />
	<link rel="canonical" href={$page.url.origin + $page.url.pathname} />
	{#if $page.data.og.title}
		<meta property="og:title" content={$page.data.og.title} />
	{/if}
	{#if $page.data.og.description}
		<meta property="og:description" content={$page.data.og.description} />
	{/if}
	{#if $page.data.og.type}
		<meta property="og:type" content={$page.data.og.type} />
	{/if}
	{#if $page.data.og.url}
		<meta property="og:url" content={$page.data.og.url} />
	{/if}
	{#if $page.data.og.imageUrl}
		<meta property="og:image" content={$page.data.og.imageUrl} />
	{/if}
	{#if $page.data.og.author}
		<meta property="article:author" content={$page.data.og.author} />
	{/if}
	{#if $page.data.og.publishedTime}
		<meta property="article:published_time" content={$page.data.og.publishedTime} />
	{/if}
	{#if $page.data.og.modifiedTime}
		<meta property="article:modified_time" content={$page.data.og.modifiedTime} />
	{/if}
	{#if $page.data.og.section}
		<meta property="article:section" content={$page.data.og.section} />
	{/if}
	{#if $page.data.og.tags}
		<meta property="article:tag" content={$page.data.og.tags} />
	{/if}
</svelte:head>

<ParaglideJS {i18n}>
	<div id="container-content">
		<Header title={$page.data.title} />
		<main class="margin-block">
			{@render children()}
		</main>
		<Footer gitLog={$page.data.gitLog} />
	</div>
  <Nav />
</ParaglideJS>

<style>
	#container-content {
		margin: var(--default-margin);
		container: inline-size container-cotent;
	}

	main {
		container: main / inline-size;
	}

	/**
	 * 내비게이션의 기본 위치 정의
	 * 스벨트는 id 까지 캡슐화가 안 돼서 이런식으로 정의
	 * 캡슐롸 방법이 아직은 없고, 트릭은 존재하는 듯...
	 * TODO 트릭 자세히 확인해보기
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
		:root:has(#border-outer-nav:not(:popover-open)) :global(#border-outer-nav) {
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
