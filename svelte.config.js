import adapter from '@sveltejs/adapter-static';
import { execSync } from 'node:child_process';
import { readFileSync } from 'fs';
import { join } from 'path';

const origin = `https://${readFileSync(join(process.cwd(), 'CNAME'), 'utf-8').trim()}`;

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// compilerOptions: {
	// 	runes: true
	// },
	kit: {
		adapter: adapter({
			// default options are shown. On some platforms
			// these options are set automatically — see below
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: true,
			strict: true
		}),
		prerender: {
			origin
		},
		version: {
			name: execSync('git rev-parse HEAD').toString().trim()
		}
	}
};

export default config;
