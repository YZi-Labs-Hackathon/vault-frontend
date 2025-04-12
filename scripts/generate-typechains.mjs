import { execute } from './utils/execute.mjs';
import { log } from './utils/log.mjs';

const GENERATED_TYPECHAINS_DIR = 'src/app-typechains';

log.info('Generating typechains (Ethers V5)...');
execute([
	`yarn typechain --target=ethers-v5 --out-dir='${GENERATED_TYPECHAINS_DIR}' 'abi/*.json'`,
]);

log.success('Typechains generated!');
