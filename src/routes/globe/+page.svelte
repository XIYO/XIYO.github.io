<script>
	import Border from '$lib/ui/Border.svelte';
	import jjakak from '$lib/assets/jjakak.jpeg?enhanced';
	import * as m from '$lib/paraglide/messages.js';
</script>

<Border viewTransitionName="post" negative id="article">
	<div class="gloves padding">
		<a class="glove content" href="https://jjakak.xiyo.dev" target="_blank">
			<enhanced:img src={jjakak} alt={m.jjakakImgAlt()} />
			<h2>JJaKaK</h2>
			<p>{m.jjakakDescription()}</p>
		</a>
	</div>
</Border>

<style>
	.gloves {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		column-gap: var(--default-margin);
		row-gap: calc(var(--default-margin) * 2);

		& > .glove {
			text-decoration: none;
			text-align: center;

			img {
				object-fit: cover;
				aspect-ratio: 1;
				inline-size: 100%;
				block-size: auto;
			}
		}
	}
</style>
