import * as m from '$lib/paraglide/messages.js';

export function load({ data, depends }) {
	depends('language:current');

	return {
		title: m.title(),
		description: m.description(),
		...data
	};
}
