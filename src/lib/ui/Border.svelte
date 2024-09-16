<script>
	/** @type {{
	 * children: import('svelte').Snippet,
	 * viewTransitionName?: string,
	 * negative?: boolean,
	 * id?: string,
	 * tag?: string,
	 * rest?: any
	 * }}
	 **/
	const { viewTransitionName, negative, id, tag = 'div', children, ...rest } = $props();

	const SEPARATOR = '-';
	const PREFIX = 'border';
	const BORDER_OUTER = [PREFIX, 'outer'].join(SEPARATOR);
	const BORDER_INNER = [PREFIX, 'inner'].join(SEPARATOR);
	const BORDER_CONTENT = [PREFIX, 'content'].join(SEPARATOR);
</script>

<svelte:element
	this={tag}
	id={id ? [BORDER_OUTER, id].join(SEPARATOR) : undefined}
	class:border-outer={true}
	style:view-transition-name={viewTransitionName ? [BORDER_OUTER, viewTransitionName].join(SEPARATOR) : undefined}
	style:view-transition-class={BORDER_OUTER}
	{...rest}
>
	<div
		id={id ? [BORDER_INNER, id].join(SEPARATOR) : undefined}
		class:border-inner={true}
		class:negative
		style:view-transition-name={viewTransitionName ? [BORDER_INNER, viewTransitionName].join(SEPARATOR) : undefined}
		style:view-transition-class={BORDER_INNER}
	>
		<div
			id={id ? [BORDER_CONTENT, id].join(SEPARATOR) : undefined}
			class:border-content={true}
			style:view-transition-name={viewTransitionName ? [BORDER_CONTENT, viewTransitionName].join(SEPARATOR) : undefined}
			style:view-transition-class={BORDER_CONTENT}
		>
			{@render children()}
		</div>
	</div>
</svelte:element>

<style>
	.border-outer {
		background-color: var(--color-default-black);
		border-radius: var(--outer-border-radius);

		padding: var(--default-border-width);
		box-sizing: border-box;

		&:has(:not(.negative)) {
			color: var(--color-default-white);
		}
	}

	.border-inner {
		border-radius: var(--inner-border-radius);
	}

	.border-content {
		border-radius: var(--inner-border-radius);
		overflow: clip;

		/* 마진 콜리전을 방지하는 효과 */
		display: flow-root;
	}

	:global(.negative) {
		color: var(--color-default-black);
		background-color: var(--color-default-white);
	}
</style>
