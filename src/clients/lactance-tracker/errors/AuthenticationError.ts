export class AuthenticationError extends Error {
	constructor(username: string) {
		super(`Failed to authenticate user ${username}`);
	}
}
