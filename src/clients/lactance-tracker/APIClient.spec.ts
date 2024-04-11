import { afterAll, beforeAll, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { faker } from '@faker-js/faker';
import { APIClient } from './APIClient';
import { JWTNotSuppliedError } from './errors/JWTNotSuppliedError';
import { UnauthorizedError } from './errors/UnauthorizedError';

describe('APIClient', () => {
	const globalFetch = global.fetch;
	const baseUrl = faker.internet.url();
	const jwt = faker.string.alphanumeric(10);

	beforeAll(() => {
		global.fetch = vi.fn();
	});

	afterAll(() => {
		global.fetch = globalFetch;
	});

	beforeEach(() => {
		(fetch as Mock).mockClear();
	});

	it('should return an instance of APIClient', () => {
		const client = APIClient.create(baseUrl, jwt);

		expect(client).to.be.instanceOf(APIClient);
	});

	it('should return an instance of APIClient with the correct baseUrl', () => {
		const client = APIClient.create(baseUrl, jwt);

		expect(client).to.have.property('baseUrl', baseUrl);
	});

	it('should return base url when calling getBaseUrl', () => {
		const client = APIClient.create(baseUrl, jwt);

		expect(client.getBaseUrl()).to.equal(baseUrl);
	});

	it('should use singleton pattern to return the same instance', () => {
		const client1 = APIClient.create(baseUrl, jwt);
		const client2 = APIClient.create(baseUrl, jwt);

		expect(client1).to.equal(client2);
	});

	it('should have a jwt property if a token is supplied in creation', () => {
		const client = APIClient.create(baseUrl, 'token');

		expect(client).to.have.property('jwt', 'token');
	});

	it('should return jwt when calling getJwt', () => {
		const client = APIClient.create(baseUrl, 'token');

		expect(client.getJwt()).to.equal('token');
	});

	it('should set jwt when calling setJwt', () => {
		const client = APIClient.create(baseUrl, 'token');

		client.setJwt('new-token');

		expect(client.getJwt()).to.equal('new-token');
	});

	it('should include jwt in the request headers', async () => {
		const client = APIClient.create(baseUrl, 'token');

		(fetch as Mock).mockResolvedValueOnce({
			json: async () => 'GET base-url/path'
		});

		await client.request('/path', { method: 'GET' });

		expect(fetch as Mock).to.have.been.toHaveBeenCalledOnce();
		const request = (fetch as Mock).mock.calls[0][0] as Request;

		expect(request.headers.get('Authorization')).to.equal('Bearer token');
	});

	it('should not include authorization header if anonymous flag is set', async () => {
		const client = APIClient.create(baseUrl, 'token');

		(fetch as Mock).mockResolvedValueOnce({
			json: async () => 'GET base-url/path'
		});

		await client.request('/path', { method: 'GET' }, true);

		expect(fetch as Mock).to.have.been.toHaveBeenCalledOnce();
		const request = (fetch as Mock).mock.calls[0][0] as Request;

		expect(request.headers.get('Authorization')).to.be.null;
	});

	it('should throw JWTNotSet if no jwt is supplied and request is not anonymous', async () => {
		const client = APIClient.create(faker.internet.url());

		await expect(client.request('/path', { method: 'GET' })).rejects.toThrowError(
			JWTNotSuppliedError
		);
	});

	it('should include content type in the request headers even if not supplied', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			json: async () => 'GET base-url/path'
		});

		await client.request('/path', {
			method: 'GET'
		});

		expect(fetch as Mock).to.have.been.toHaveBeenCalledOnce();
		const request = (fetch as Mock).mock.calls[0][0] as Request;

		expect(request.headers.get('Content-Type')).to.equal('application/json');
	});

	it('should perform a GET request using the base url', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			json: async () => 'GET base-url/path'
		});

		await client.request('/path', { method: 'GET' });

		expect(fetch as Mock).to.have.been.toHaveBeenCalledOnce();
		const request = (fetch as Mock).mock.calls[0][0] as Request;

		expect(request.url).to.equal(`${baseUrl}/path`);
		expect(request.method).to.equal('GET');
	});

	it('should perform a POST request using the base url', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			json: async () => 'POST base-url/path'
		});

		await client.request('/path', { method: 'POST' });

		expect(fetch as Mock).to.have.been.toHaveBeenCalledOnce();
		const request = (fetch as Mock).mock.calls[0][0] as Request;

		expect(request.url).to.equal(`${baseUrl}/path`);
		expect(request.method).to.equal('POST');
	});

	it('should perform a PUT request using the base url', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			json: async () => 'PUT base-url/path'
		});

		await client.request('/path', { method: 'PUT' });

		expect(fetch as Mock).to.have.been.toHaveBeenCalledOnce();
		const request = (fetch as Mock).mock.calls[0][0] as Request;

		expect(request.url).to.equal(`${baseUrl}/path`);
		expect(request.method).to.equal('PUT');
	});

	it('should perform a DELETE request using the base url', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			json: async () => 'DELETE base-url/path'
		});

		await client.request('/path', { method: 'DELETE' });

		expect(fetch as Mock).to.have.been.toHaveBeenCalledOnce();
		const request = (fetch as Mock).mock.calls[0][0] as Request;

		expect(request.url).to.equal(`${baseUrl}/path`);
		expect(request.method).to.equal('DELETE');
	});

	it('should pass headers to the request', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			json: async () => 'GET base-url/path'
		});

		await client.request('/path', {
			method: 'GET',
			headers: {
				'Custom-Header': 'value'
			}
		});

		expect(fetch as Mock).to.have.been.toHaveBeenCalledOnce();
		const request = (fetch as Mock).mock.calls[0][0] as Request;

		expect(request.headers.get('Custom-Header')).to.equal('value');
	});

	it('should pass body to the request', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			json: async () => 'POST base-url/path'
		});

		await client.request('/path', {
			method: 'POST',
			body: {
				key: 'value'
			}
		});

		expect(fetch as Mock).to.have.been.toHaveBeenCalledOnce();
		const request = (fetch as Mock).mock.calls[0][0] as Request;

		expect(await request.json()).to.deep.equal({ key: 'value' });
	});

	it('should throw UnauthorizedError when server returns 401 error code', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			status: 401
		});

		await expect(client.request('/path', { method: 'GET' })).rejects.toThrowError(
			UnauthorizedError
		);
	});

	it('should return the status code when calling request', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			status: 200,
			json: async () => 'response body'
		});

		const response = await client.request('/path', { method: 'GET' });

		expect(response.status).to.equal(200);
	});

	it('should return the response body when calling request', async () => {
		const client = APIClient.create(baseUrl, jwt);

		(fetch as Mock).mockResolvedValueOnce({
			status: 200,
			json: async () => 'response body'
		});

		const response = await client.request('/path', { method: 'GET' });

		expect(response.data).to.equal('response body');
	});
});
