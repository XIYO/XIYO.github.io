<script>
	import Border from '$lib/ui/Border.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<Border viewTransitionName="article" negative>
	<div class="padding content">
		<p>{m.welcome()}</p>
	</div>
</Border>
