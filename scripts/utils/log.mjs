import chalk from 'chalk';

export const log = {
	info: (message, ...args) => console.log(chalk.blue(`[INFO] ${message}`, ...args)),
	error: (message, ...args) => console.log(chalk.red(`[ERROR] ${message}`, ...args)),
	success: (message, ...args) => console.log(chalk.green(`[SUCCESS] ${message}`, ...args)),
	warn: (message, ...args) => console.log(chalk.yellow(`[WARN] ${message}`, ...args)),
};
