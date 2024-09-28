<script>
	import Border from '$lib/ui/Border.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import terminalBrowsing from '$lib/assets/terminal_browsing.png?enhanced';
</script>

<Border viewTransitionName="post" negative>
	<div class="padding content">
		<p>{@html m.welcome()}</p>

		<figure>
		  <enhanced:img src={terminalBrowsing} alt={m.terminalBrowsing()} data-title={m.terminal()}/>
			<figcaption>
				터미널 브라우저에서 실행한 화면
			</figcaption>
		</figure>
	</div>
</Border>
