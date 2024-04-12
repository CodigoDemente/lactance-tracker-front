import { afterAll, beforeAll, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { APIClient } from './APIClient';
import { faker } from '@faker-js/faker';
import { UserClient } from './UserClient';
import { UnauthorizedError } from './errors/UnauthorizedError';
import { JWTNotSuppliedError } from './errors/JWTNotSuppliedError';
import { UserAlreadyExistsError } from './errors/user/UserAlreadyExistsError';
import { BadRquestError } from './errors/BadRequestError';

describe('UserClient', () => {
	const globalFetch = global.fetch;
	let userClient: UserClient;
	let apiClient: APIClient;

	beforeAll(() => {
		global.fetch = vi.fn();

		vi.mock('jwt-decode');

		apiClient = APIClient.create(faker.internet.url());

		userClient = new UserClient(apiClient);
	});

	afterAll(() => {
		global.fetch = globalFetch;
	});

	it('should return an instance of UserClient', () => {
		expect(userClient).toBeInstanceOf(UserClient);
	});

	describe('authenticate', () => {
		it('should authenticate user', async () => {
			const token = faker.string.alphanumeric(10);

			const user = faker.internet.userName();
			const password = faker.internet.password();

			(fetch as Mock).mockResolvedValueOnce({
				json: async () => ({
					token
				})
			});

			await userClient.authenticate(user, password);

			expect(userClient['apiClient'].getJwt()).toBe(token);
		});

		it('should throw UnauthorizedError when server returns an error', async () => {
			const user = faker.internet.userName();
			const password = faker.internet.password();

			(fetch as Mock).mockResolvedValueOnce({
				status: 401,
				json: async () => ({
					error: 'Invalid username or password'
				})
			});

			await expect(userClient.authenticate(user, password)).rejects.toThrow(UnauthorizedError);
		});

		it('should return the user data decoded from the token when authenticating', async () => {
			// Fake token
			const token =
				'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InBlcGUiLCJzdWIiOiJmYTBiODhiMi0wZTMwLTQ3ZTktODc0OC01ZDVjYzQ2NzQ4ZmIiLCJlbWFpbCI6InBlcGVAcGVwZS5wZSIsImlhdCI6MTcxMjkwNjc1NiwiZXhwIjoxNzIwNjgyNzU2fQ.JnetmuBOQG0GxVjkNMTQgrgWs1dH_YMFSwy7H3PueVQ';

			const user = faker.internet.userName();
			const password = faker.internet.password();

			(fetch as Mock).mockResolvedValueOnce({
				json: async () => ({
					token
				})
			});

			const result = await userClient.authenticate(user, password);

			expect(result).toEqual(
				expect.objectContaining({
					userId: expect.any(String),
					username: expect.any(String),
					email: expect.any(String)
				})
			);
		});
	});

	describe('usernameExists', () => {
		it('should return true if username requests return 200', async () => {
			const username = faker.internet.userName();

			(fetch as Mock).mockResolvedValueOnce({
				status: 200,
				json: async () => ({})
			});

			const result = await userClient.usernameExists(username);

			expect(result).toBe(true);
		});

		it('should return false if username requests return 404', async () => {
			const username = faker.internet.userName();

			(fetch as Mock).mockResolvedValueOnce({
				status: 404,
				json: async () => ({})
			});

			const result = await userClient.usernameExists(username);

			expect(result).toBe(false);
		});
	});

	describe('emailExists', () => {
		it('should return true if email requests return 200', async () => {
			const email = faker.internet.email();

			(fetch as Mock).mockResolvedValueOnce({
				status: 200,
				json: async () => ({})
			});

			const result = await userClient.emailExists(email);

			expect(result).toBe(true);
		});

		it('should return false if email requests return 404', async () => {
			const email = faker.internet.email();

			(fetch as Mock).mockResolvedValueOnce({
				status: 404,
				json: async () => ({})
			});

			const result = await userClient.emailExists(email);

			expect(result).toBe(false);
		});
	});

	describe('getProfile', () => {
		beforeAll(async () => {
			(fetch as Mock).mockResolvedValueOnce({
				status: 200,
				json: async () => ({
					token: faker.string.alphanumeric(10)
				})
			});

			await userClient.authenticate(faker.internet.userName(), faker.internet.password());
		});

		it('should return the user profile', async () => {
			const userId = faker.string.uuid();
			const username = faker.internet.userName();
			const email = faker.internet.email();

			(fetch as Mock).mockResolvedValueOnce({
				status: 200,
				json: async () => ({
					id: userId,
					username,
					email
				})
			});

			const profile = await userClient.getProfile();

			expect(profile).toMatchObject({
				id: userId,
				username,
				email
			});
		});

		it('should throw JWTNotSuppliedError if getting profile without authenticating', async () => {
			const client = new UserClient(APIClient.create(faker.internet.url()));

			await expect(client.getProfile()).rejects.toThrowError(JWTNotSuppliedError);
		});
	});

	describe('createUser', () => {
		beforeAll(() => {
			vi.spyOn(apiClient, 'request');
		});

		beforeEach(() => {
			(apiClient.request as Mock).mockClear();
		});

		it('should send a request to create a new user', async () => {
			const username = faker.internet.userName();
			const email = faker.internet.email();
			const password = faker.internet.password();

			(fetch as Mock).mockResolvedValueOnce({
				status: 201,
				json: async () => ({})
			});

			await userClient.createUser(username, email, password);

			const args = (apiClient.request as Mock).mock.calls[0];

			expect(args[0]).toBe('/users');
			expect(args[1]).toMatchObject({
				method: 'POST',
				body: {
					username,
					email,
					password
				}
			});
		});

		it('should throw UserAlreadyExistsError if the server returns bad request with error code', async () => {
			const username = faker.internet.userName();
			const email = faker.internet.email();
			const password = faker.internet.password();

			(fetch as Mock).mockResolvedValueOnce({
				status: 400,
				json: async () => ({
					code: 'user-already-exists'
				})
			});

			await expect(userClient.createUser(username, email, password)).rejects.toThrowError(
				UserAlreadyExistsError
			);
		});

		it('should return a generic bad request error if the server returns bad request without error code', async () => {
			const username = faker.internet.userName();
			const email = faker.internet.email();
			const password = faker.internet.password();

			(fetch as Mock).mockResolvedValueOnce({
				status: 400,
				json: async () => ({})
			});

			await expect(userClient.createUser(username, email, password)).rejects.toThrowError(
				BadRquestError
			);
		});
	});
});
