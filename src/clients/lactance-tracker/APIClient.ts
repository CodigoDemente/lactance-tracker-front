import { UnauthorizedError } from './errors/UnauthorizedError';
import { JWTNotSuppliedError } from './errors/JWTNotSuppliedError';
import type { RequestOptions } from './types/RequestOptions';
import type { ResponseData } from './types/ResponseData';

let singleton: APIClient | null = null;

export class APIClient {
	private constructor(
		private readonly baseUrl: string,
		private jwt?: string
	) {}

	public getBaseUrl(): string {
		return this.baseUrl;
	}

	public getJwt(): string | undefined {
		return this.jwt;
	}

	public setJwt(jwt: string): void {
		this.jwt = jwt;
	}

	public async request<T = Record<string, unknown>>(
		path: string,
		options: RequestOptions,
		anonymous = false
	): Promise<ResponseData<T>> {
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

		this.handleError(response);

		return {
			status: response.status,
			data: await response.json()
		};
	}

	private handleError(response: Response): void {
		if (response.status === 401) {
			throw new UnauthorizedError();
		}
	}

	public static create(baseUrl: string, jwt?: string): APIClient {
		if (!singleton || singleton.baseUrl !== baseUrl || singleton.jwt !== jwt) {
			singleton = new APIClient(baseUrl, jwt);
		}

		return singleton;
	}
}
