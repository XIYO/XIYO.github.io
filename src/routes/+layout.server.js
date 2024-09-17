import { getAllGitLog } from '$lib/plugin/gitLog.js';

export const prerender = true;

export function load() {
	const gitLog = getAllGitLog();

	return {
		og: {},
		gitLog: [gitLog[0], gitLog.at(-1)]
	};
}
