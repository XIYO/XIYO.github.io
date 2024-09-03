import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFigureCaption from 'remark-figure-caption';
import remarkRehype from 'remark-rehype';
import rehypeCallouts from 'rehype-callouts';
import rehypeShiki from '@shikijs/rehype';
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';

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

/**
 * @type {import('@shikijs/rehype').RehypeShikiOptions}
 */
const rehypeShikiOptions = {
	themes: {
		light: 'solarized-light',
		dark: 'poimandres'
	},
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
				node.url = node.url.replace('/static', '');
			}
		});
	};
}
