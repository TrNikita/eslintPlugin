'use strict';

const path = require('path');

module.exports = {
	meta: {
		type: null,
		docs: {
			description: 'feature sliced relative path checker',
			category: 'Fill me in',
			recommended: false,
			url: null,
		},
		fixable: 'code',
		schema: [
			{
				type: 'object',
				properties: {
					alias: {
						type: 'string',
					},
				},
			},
		],
	},

	create(context) {
		const alias = context.options[0]?.alias || '';

		return {
			ImportDeclaration(node) {
				try {
				// example app/entities/Article
				const value = node.source.value;
				const importTo = alias ? value.replace(`${alias}/`, '') : value;

				const fromFilename = context.getFilename();

				if (shouldBeRelative(fromFilename, importTo)) {
					context.report({
						node,
						message:
							'В рамках одного слайса все пути должны быть относительными',
						fix: (fixer) => {
							// entities/Article/Article.tsx
							const normalizedPath = getNormalizedCurrentFilePath(fromFilename)
								.split('/')
								.slice(0, -1)
								.join('/')

							let relativePath = path.relative(normalizedPath, `/${importTo}`)

							if (!relativePath.startsWith('.')) {
								relativePath = './' + relativePath
							}

							return fixer.replaceText(node.source, `'${relativePath}'`)
						},
					});
				}
				} catch (e) {
					console.log('e', e);
				}
			},
		};
	},
};

const layers = {
	'entities': 'entities',
	'features': 'features',
	'shared': 'shared',
	'pages': 'pages',
	'widgets': 'widgets',
};

function getNormalizedCurrentFilePath(currentFilePath) {
	const normalizedPath = path
		.toNamespacedPath(currentFilePath)
		.replace(/\\/g, '/')
	// project.split('\\').length > 1 ? project.split('\\') : project.split('/')
	return normalizedPath?.split('src')[1]
}

function isPathRelative(path) {
	return path === '.' || path.startsWith('./') || path.startsWith('../');
}

function shouldBeRelative(from, to) {
	if (isPathRelative(to)) {
		return false;
	}

	// example entities/Article
	const toArray = to.split('/');
	const toLayer = toArray[0]; // entities
	const toSlice = toArray[1]; // Article

	if (!toLayer || !toSlice || !layers[toLayer]) {
		return false;
	}

	//const normalizedPath = path.toNamespacedPath(currentFile)
	const project = getNormalizedCurrentFilePath(from)
	const projectArray = project?.split('/')

	const projectLayer = projectArray[1]
	const projectSlice = projectArray[2]

	if (!projectLayer || !projectSlice || !layers[projectLayer]) {
		return false
	}

	return projectLayer === toLayer && projectSlice === toSlice
}
