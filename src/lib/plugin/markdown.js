import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFigureCaption from 'remark-figure-caption';
import remarkRehype from 'remark-rehype';
import rehypeCallouts from 'rehype-callouts';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import sizeOf from 'image-size';
import { join } from 'node:path';
import { transformerNotationDiff, transformerNotationFocus } from '@shikijs/transformers';
import { createCssVariablesTheme } from 'shiki/core';

export default async function markdownAsync({ markdown }) {
	return (
		unified()
			// remark
			.use(remarkParse, { allowDangerousHtml: true })
			.use(remarkFigureCaption)
			.use(ExtractTitleAndPathRemove)

			// rehype
			.use(remarkRehype, { allowDangerousHtml: true })
			.use(rehypeCallouts)
			.use(rehypeShiki, rehypeShikiOptions)

			// stringify
			.use(rehypeStringify, { allowDangerousHtml: true })
			.process(markdown)
	);
}

// 사용자 정의 메타 문자열 값을 처리하는 함수
const metaValues = [
	{
		name: 'data-title',
		regex: /data-title="(?<value>[^"]*)"/
	}
];

const parseMetaString = (meta) => {
	const map = {};

	for (const value of metaValues) {
		const result = value.regex.exec(meta);

		if (result) {
			map[`${value.name}`] = result.groups.value;
		}
	}

	return map;
};

// 변수형 테마 생성
const theme = createCssVariablesTheme({
	name: 'css-variables',
	// variablePrefix: '--shiki-',
	variableDefaults: {},
	fontStyle: true
});

/**
 * @type {import('@shikijs/rehype').RehypeShikiOptions}
 */
const rehypeShikiOptions = {
	theme,
	// themes: {
	// 	light: 'solarized-light',
	// 	dark: 'poimandres'
	// },
	transformers: [transformerNotationDiff(), transformerNotationFocus()],
	parseMetaString
};

function ExtractTitleAndPathRemove() {
	return (tree, file) => {
		visit(tree, (node, index, parent) => {
			if (node.type === 'heading' && node.depth === 1) {
				file.data.title = node.children[0].value || '';

				if (
					parent.children[index + 1].type === 'paragraph' &&
					parent.children[index + 1].children[0].type === 'text'
				) {
					file.data.description = parent.children[index + 1].children[0].value;
				}

				parent.children.splice(index, 1);
			}

			if (node.type === 'image' && node.url.startsWith('/static')) {
				// 이미지 태그에 width 속성을 추가합니다.
				const imagePath = join(process.cwd(), node.url);

				let width = 768;
				let height;

				try {
					({ width, height } = sizeOf(imagePath));
				} catch (err) {
					console.error(`Error reading image size for ${imagePath}:`, err);
				}

				// 최대 공약수를 사용하여 비율을 정수로 만듭니다.
				const gcdValue = gcd(width, height);
				const aspectWidth = width / gcdValue;
				const aspectHeight = height / gcdValue;

				node.data = node.data || {};
				node.data.hProperties = {
					...node.data.hProperties,
					width,
					height: 'auto',
					style: `aspect-ratio: ${aspectWidth} / ${aspectHeight};`
				};

				// 최종 빌드에서 보이지 않아야할 경로를 제거합니다.
				node.url = node.url.replace('/static', '');
			}
		});
	};
}

// 최대 공약수(GCD)를 구하는 함수
function gcd(a, b) {
	if (!b) return a;
	return gcd(b, a % b);
}

// 최소 공배수(LCM)를 구하는 함수
function lcm(a, b) {
	return (a * b) / gcd(a, b);
}
