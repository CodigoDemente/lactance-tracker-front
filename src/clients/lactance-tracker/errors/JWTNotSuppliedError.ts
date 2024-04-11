export class JWTNotSuppliedError extends Error {
	constructor() {
		super('JWT not supplied, cannot perform authenticated request');
	}
}
