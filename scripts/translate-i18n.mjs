import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import path from 'path';
import { execute } from './utils/execute.mjs';
import { log } from './utils/log.mjs';

function mergeObjects(src, dest) {
	// Ensure both src and dest are objects
	if (typeof src !== 'object' || src === null) return dest;
	if (typeof dest !== 'object' || dest === null) return src;

	// Iterate over keys in dest
	for (const key in dest) {
		if (dest.hasOwnProperty(key)) {
			// If the key is also in src and both values are objects, merge them recursively
			if (
				src.hasOwnProperty(key) &&
				typeof src[key] === 'object' &&
				!Array.isArray(src[key]) &&
				typeof dest[key] === 'object' &&
				!Array.isArray(dest[key])
			) {
				mergeObjects(src[key], dest[key]);
			} else {
				// Otherwise, set src[key] to dest[key] if src[key] is undefined
				if (!src.hasOwnProperty(key)) {
					src[key] = dest[key];
				}
			}
		}
	}

	return src;
}

const localesFolder = path.join(process.cwd(), 'src/locales');
const langFolders = readdirSync(localesFolder);

const langs = langFolders
	.filter((folder) => {
		const absolutePath = path.join(localesFolder, folder);
		return statSync(absolutePath).isDirectory();
	})
	.map((folder) => folder);

log.info('Supported Languages: ' + JSON.stringify(langs));

if (!langs.includes('en')) {
	log.error('"en" folder is missing in locales, it is the required language');
	process.exit(1);
}

const enFolder = path.join(localesFolder, 'en');
const otherLangFolders = langFolders.filter((folder) => folder !== 'en');

let originNsContents = {};

for (const nsFile of readdirSync(enFolder)) {
	const nsFilePath = path.join(enFolder, nsFile);
	const stat = statSync(nsFilePath);

	if (!stat.isFile() || !nsFile.endsWith('.json')) {
		continue;
	}

	const nsContent = readFileSync(nsFilePath, 'utf-8');

	// nsContent is a JSON string
	try {
		originNsContents[nsFile] = JSON.parse(nsContent);
	} catch (e) {
		log.error(`Error parsing JSON in ${nsFilePath}: ` + e.message);
	}
}

for (const otherLang of otherLangFolders) {
	const otherLangFolder = path.join(localesFolder, otherLang);
	const currentNamespaces = Object.keys(originNsContents);

	for (const nsFileName of currentNamespaces) {
		const nsFilePath = path.join(otherLangFolder, nsFileName);

		if (!existsSync(nsFilePath)) {
			writeFileSync(nsFilePath, JSON.stringify({}, null, 2));
		}

		// Load current content
		let nsContent = {};
		if (statSync(nsFilePath).isFile()) {
			try {
				nsContent = JSON.parse(readFileSync(nsFilePath, 'utf-8'));
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
			} catch (e) {
				nsContent = {};
			}
		}

		const currentNsContent = originNsContents[nsFileName];
		const mergedNsContent = mergeObjects(nsContent, currentNsContent);

		writeFileSync(nsFilePath, JSON.stringify(mergedNsContent, null, 2));
	}
}

// Beautify json files with prettier
execute(['yarn prettier --write src/locales/**/*.json']).then(() => {
	log.success('Translations updated successfully');
	process.exit(0);
});
