// file initialized by the Paraglide-SvelteKit CLI - Feel free to edit it
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';
import * as amp from '@sveltejs/amp';
import { PurgeCSS } from 'purgecss';

// add your own hooks as part of the sequence here
export const handle = sequence(i18n.handle(), ampHandle);

/** @type {import('@sveltejs/kit').Handle} */
async function ampHandle({ event, resolve }) {
	let buffer = '';

	return await resolve(event, {
		transformPageChunk: async ({ html, done }) => {
			buffer += html;

			if (done) {
				let css = '';
				const markup = amp
					.transform(buffer)
					.replace('⚡', 'amp') // purgecss can't handle this character
					.replace(/<style amp-custom([^>]*?)>([^]+?)<\/style>/, (match, attributes, contents) => {
						css = contents;
						return `<style amp-custom${attributes}></style>`;
					});

				// Use PurgeCSS to remove unused CSS
				const purgeCSSResults = await new PurgeCSS().purge({
					content: [{ raw: markup, extension: 'html' }],
					css: [{ raw: css }],
					keyframes: true, // 사용하지 앟는 키프레임 제거
					fontFace: true, // 사용하지 않는 폰트페이스 제거
					variables: true, // 사용하지 않는 변수 제거
					safelist: {
						variables: [/^--shiki/]
					}
				});

				const optimizedCSS = purgeCSSResults[0].css;

				return markup.replace('</style>', `${optimizedCSS}</style>`);
			}
		}
	});
}
