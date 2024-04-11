export class UnauthorizedError extends Error {
	constructor() {
		super(`Failed to authenticate request.`);
	}
}
