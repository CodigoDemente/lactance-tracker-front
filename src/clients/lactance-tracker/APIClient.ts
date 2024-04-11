import { JWTNotSuppliedError } from './errors/JWTNotSuppliedError';
import type { RequestOptions } from './types/RequestOptions';

let singleton: APIClient | null = null;

export class APIClient {
	private constructor(
		private readonly baseUrl: string,
		private readonly jwt?: string
	) {}

	public getBaseUrl(): string {
		return this.baseUrl;
	}

	public getJwt(): string | undefined {
		return this.jwt;
	}

	public async request(path: string, options: RequestOptions, anonymous = false): Promise<unknown> {
		const request = new Request(`${this.baseUrl}${path}`, {
			body: options.body ? JSON.stringify(options.body) : undefined,
			method: options.method,
			headers: {
				'Content-Type': 'application/json',
				...options.headers
			}
		});

		if (!anonymous && !this.jwt) {
			throw new JWTNotSuppliedError();
		} else if (!anonymous) {
			request.headers.set('Authorization', `Bearer ${this.jwt}`);
		}

		const response = await fetch(request);

		return response.json();
	}

	public static create(baseUrl: string, jwt?: string): APIClient {
		if (!singleton || singleton.baseUrl !== baseUrl || singleton.jwt !== jwt) {
			singleton = new APIClient(baseUrl, jwt);
		}

		return singleton;
	}
}
