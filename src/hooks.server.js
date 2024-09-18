// file initialized by the Paraglide-SvelteKit CLI - Feel free to edit it
import { sequence } from '@sveltejs/kit/hooks';
import { i18n } from '$lib/i18n';
import * as amp from '@sveltejs/amp';
import { PurgeCSS } from 'purgecss'; // purgecss 패키지에서 PurgeCSS 가져오기

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
					content: [
						{
							raw: markup,
							extension: 'html'
						}
					],
					css: [
						{
							raw: css
						}
					],
					keyframes: true, // 필요시 설정 추가
					fontFace: true, // 필요시 설정 추가
					variables: true, // 필요시 설정 추가
					safelist: ['safe-class'] // 삭제되지 않도록 유지할 CSS 클래스
				});

				const optimizedCSS = purgeCSSResults[0].css;

				return markup.replace('</style>', `${optimizedCSS}</style>`);
			}
		}
	});
}
