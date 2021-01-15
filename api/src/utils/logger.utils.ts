/* eslint-disable no-console */
import 'log-timestamp'

function logger(moduleName: string, message: string) {
	console.log(`[${moduleName}]: ${message}`);
}

export default logger;
