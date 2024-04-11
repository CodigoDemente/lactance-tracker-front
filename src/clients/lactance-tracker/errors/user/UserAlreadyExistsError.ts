export class UserAlreadyExistsError extends Error {
	constructor(username: string, email: string) {
		super(`User with username ${username} and email ${email} already exists`);
	}
}
