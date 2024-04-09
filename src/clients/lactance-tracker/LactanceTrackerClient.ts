import { PUBLIC_API_URL } from '$env/static/public';
import { AuthenticationError } from './errors/AuthenticationError';

export class LactanceTrackerClient {
	private readonly baseUrl: string = PUBLIC_API_URL;

	constructor(private jwt?: string) {}

	public getJWT(): string | undefined {
		return this.jwt;
	}

	async authenticate(username: string, password: string): Promise<LactanceTrackerClient> {
		const response = await fetch(`${this.baseUrl}/auth/login`, {
			method: 'POST',
			body: JSON.stringify({ username, password }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			throw new AuthenticationError(username);
		}

		const { token } = await response.json();

		this.jwt = token;

		return this;
	}
}
