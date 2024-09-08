<script>
	/** @type {{
	 * children: import('svelte').Snippet,
	 * viewTransitionName: string,
	 * borderOuterViewTransitionClass?: string,
	 * borderInnerViewTransitionClass?: string,
	 * borderContentViewTransitionClass?: string,
	 * negative?: boolean,
	 * id?: string,
	 * tag?: string,
	 * rest?: any
	 * }}
	 **/
	const {
		viewTransitionName,
		borderOuterViewTransitionClass = 'border-outer',
		borderInnerViewTransitionClass = 'border-inner',
		borderContentViewTransitionClass = 'border-content',
		negative = false,
		id,
		tag = 'div',
		children,
		...rest
	} = $props();
</script>

<svelte:element
	this={tag}
	id={id ? `border-outer-${id}` : undefined}
	class="border-outer"
	style:view-transition-name={`border-outer-${viewTransitionName}`}
	style:view-transition-class={borderOuterViewTransitionClass}
	{...rest}
>
	<div
		id={id ? `border-inner-${id}` : undefined}
		class="border-inner"
		class:negative
		style:view-transition-name={`border-inner-${viewTransitionName}`}
		style:view-transition-class={borderInnerViewTransitionClass}
	>
		<div
			id={id ? `border-content-${id}` : undefined}
			class="border-content"
			style:view-transition-name={`border-content-${viewTransitionName}`}
			style:view-transition-class={borderContentViewTransitionClass}
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
