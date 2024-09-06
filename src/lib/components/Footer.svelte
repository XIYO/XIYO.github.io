<script>
	import { languageTag } from '$lib/paraglide/runtime.js';

	const { gitLog } = $props();

	const locale = new Intl.Locale(languageTag());

	const firstCommitDate = new Date(gitLog.at(0).datetime);

	const dateFormatOptions = { year: '2-digit', month: '2-digit', day: '2-digit' };
	const dateTimeFormat = new Intl.DateTimeFormat(locale.baseName, dateFormatOptions);

	const firstCommitDateString = dateTimeFormat.format(firstCommitDate);
</script>

<footer>
	<div>
		Made By
		<a id="made-by" href="https://svelte.dev" target="_blank">Svelte Rune</a>, Designed By
		<span id="design-by" tabindex="-1" >
			{#each 'chimi' as letter, i}
				<span style:--delay={i}>{letter}</span>
			{/each}
		</span>
	</div>
	<div id="git-log">
		<span><span class="heading">last commit :</span> {firstCommitDateString}</span>
		<span><span class="heading">comment :</span> {gitLog.at(0).comment}</span>
	</div>
</footer>

<style>
    footer {
        font-size: 0.75rem;
        text-align: center;
        margin-block: var(--default-margin);

        view-transition-name: footer;
        view-transition-class: after-view-transition;

        user-select: none;
    }

    #made-by::after {
        content: '';
        display: inline-block;
        margin-inline-start: 0.25rem;
        width: 1rem;
        height: 1rem;
        background-image: url('/svelte-logo.svg');
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        vertical-align: middle;
    }

    #design-by {
        text-align: center;
        align-content: center;

        &::after {
            content: '🎈';
            display: inline-block;
            margin-inline-start: 0.25rem;
        }

        &:not(:focus) {
					cursor: pointer;
        }

        &:focus::after {
            content: '💥';
        }
    }

    #git-log {
        text-align: end;

        & > * {
            display: block;
        }

        .heading {
            text-transform: uppercase;
            font-weight: bold;
        }
    }

    @media (prefers-reduced-motion: no-preference) {
        #design-by {
						span {
                display: inline-block;
                animation: float 3s infinite linear;
                animation-delay: calc(var(--delay) * 0.25s);
            }

            &:focus {
                animation-play-state: paused;
            }
        }
    }

    @keyframes float {
        25% {
            transform: translateY(25%);
        }

        75% {
            transform: translateY(-25%);
        }
    }
</style>
