import { getAllGitLog, getGitLogSync } from '$lib/plugin/gitLog.js';
import * as m from '$lib/paraglide/messages.js';

export const prerender = true;

export function load() {
	const gitLog = getAllGitLog();

	return {
		title: m.title(),
		description: m.description(),
		og: {},
		gitLog: [gitLog[0], gitLog.at(-1)]
	};
}
