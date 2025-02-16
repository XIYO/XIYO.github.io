<script>
	import Card from '$lib/ui/card/Card.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import terminalBrowsing from '$lib/assets/terminal_browsing.png?enhanced';
</script>

<Card viewTransitionName="post" negative>
	<div class="padding content">
		<p>{@html m.welcome()}</p>

		<figure>
		  <enhanced:img src={terminalBrowsing} alt={m.terminalBrowsing()} data-title={m.terminal()}/>
			<figcaption>
				터미널에서 w3m을 이용하여 접속하였습니다.
			</figcaption>
		</figure>
	</div>
</Card>
