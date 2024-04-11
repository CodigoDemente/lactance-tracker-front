export class BadRquestError extends Error {
	constructor(code: string, message: string) {
		super(`Bad request: ${code} - ${message}`);
	}
}
