import { jwtDecode } from 'jwt-decode';
import type { APIClient } from './APIClient';
import { BadRquestError } from './errors/BadRequestError';
import { UserAlreadyExistsError } from './errors/user/UserAlreadyExistsError';
import type { UserProfile } from './types/User';

enum RequestPaths {
	LOGIN = '/users/login',
	USERNAME = '/users/username',
	EMAIL = '/users/email',
	PROFILE = '/profile',
	CREATE_USER = '/users'
}

enum ErrorCodes {
	USER_ALREADY_EXISTS = 'user-already-exists'
}

export class UserClient {
	constructor(private readonly apiClient: APIClient) {}

	public async authenticate(
		username: string,
		password: string
	): Promise<{
		userId: string;
		username: string;
		email: string;
	}> {
		const response = await this.apiClient.request(
			RequestPaths.LOGIN,
			{
				method: 'POST',
				body: {
					username,
					password
				}
			},
			true
		);

		const { token } = response.data;

		this.apiClient.setJwt(token as string);

		const jwtUser = jwtDecode<{
			sub: string;
			username: string;
			email: string;
		}>(token as string);

		return {
			userId: jwtUser.sub,
			username: jwtUser.username,
			email: jwtUser.email
		};
	}

	public async usernameExists(username: string): Promise<boolean> {
		const response = await this.apiClient.request(
			`${RequestPaths.USERNAME}/${username}`,
			{
				method: 'GET'
			},
			true
		);

		return response.status === 200;
	}

	public async emailExists(email: string): Promise<boolean> {
		const response = await this.apiClient.request(
			`${RequestPaths.EMAIL}/${email}`,
			{
				method: 'GET'
			},
			true
		);

		return response.status === 200;
	}

	public async getProfile(): Promise<UserProfile> {
		const profile = await this.apiClient.request(RequestPaths.PROFILE, {
			method: 'GET'
		});

		return {
			id: profile.data.id as string,
			username: profile.data.username as string,
			email: profile.data.email as string
		};
	}

	public async createUser(username: string, email: string, password: string): Promise<void> {
		const response = await this.apiClient.request(
			RequestPaths.CREATE_USER,
			{
				method: 'POST',
				body: {
					username,
					email,
					password
				}
			},
			true
		);

		if (response.status === 400) {
			switch (response.data.code) {
				case ErrorCodes.USER_ALREADY_EXISTS:
					throw new UserAlreadyExistsError(username, email);
				default:
					throw new BadRquestError(response.data.code as string, response.data.message as string);
			}
		}
	}
}
