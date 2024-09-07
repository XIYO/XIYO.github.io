const { defineConfig } = require('@lobehub/i18n-cli');

module.exports = defineConfig({
	entry: 'markdown/ko-KR',
	entryLocale: 'ko-KR',
	output: 'markdown',
	outputLocales: [
		'zh-TW',
		'en-US',
		'ja-JP',
	],
	// temperature: 0,
	// modelName: 'gpt-4o',
	// splitToken: 2048,
	experimental: {
		jsonMode: true,
	},
	markdown: {
		entry: ['static/**/*'],
		entryLocale: 'ko-KR',
		entryExtension: '.md',
		exclude: ['**/*.en-US.md', '**/*.ja-JP.md'],
		// exclude: ['markdown/en-US', 'markdown/zh-CN', 'markdown/ja-JP'],
		outputLocales: [
			'en-US',
			'ja-JP',
		],
	}
});
