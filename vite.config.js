import { paraglide } from '@inlang/paraglide-sveltekit/vite'
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import vitePluginXiyo from './src/lib/plugin/vitePluginXiyo.js';

export default defineConfig({
	plugins: [paraglide({ project: './project.inlang', outdir: './src/lib/paraglide' }),
		enhancedImages(),
		sveltekit(),
		vitePluginXiyo()
	]
});
