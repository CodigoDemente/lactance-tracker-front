import { afterAll, beforeAll, describe, expect, it, vi, type Mock } from 'vitest';
import { APIClient } from './APIClient';
import { faker } from '@faker-js/faker';
import { ChildClient } from './ChildClient';
import { ChildDoesNotExistError } from './errors/child/ChildDoesNotExistError';

describe('ChildClient', () => {
	const globalFetch = global.fetch;
	let childClient: ChildClient;
	let apiClient: APIClient;
	const parentId = faker.string.uuid();

	beforeAll(() => {
		global.fetch = vi.fn();

		apiClient = APIClient.create(faker.internet.url());

		apiClient.setJwt(faker.string.uuid());

		childClient = new ChildClient(apiClient, parentId);
	});

	afterAll(() => {
		global.fetch = globalFetch;
	});

	it('should create a new child client', () => {
		expect(childClient).toBeInstanceOf(ChildClient);
	});

	describe('getChildren', () => {
		it('should call the API client with the correct path', async () => {
			const spy = vi.spyOn(apiClient, 'request');

			(fetch as Mock).mockResolvedValueOnce({ json: async () => ({ items: [] }) });

			await childClient.getChildren();

			expect(spy).toHaveBeenCalledWith(`/api/v1/parents/${parentId}/children`, { method: 'GET' });
		});

		it('should return the response in the correct format', async () => {
			const response = {
				page: 1,
				total: 1,
				items: [
					{
						id: faker.string.uuid(),
						name: faker.person.firstName(),
						parentId: parentId
					}
				]
			};

			(fetch as Mock).mockResolvedValueOnce({ json: async () => response });

			const result = await childClient.getChildren();

			expect(result).toEqual(
				expect.arrayContaining([
					{
						id: response.items[0].id,
						name: response.items[0].name
					}
				])
			);
		});
	});

	describe('getChildById', () => {
		it('should call the API client with the correct path', async () => {
			const childId = faker.string.uuid();

			const spy = vi.spyOn(apiClient, 'request');

			(fetch as Mock).mockResolvedValueOnce({ json: async () => ({ id: childId, name: faker.person.firstName() }) });

			await childClient.getChildById(childId);

			expect(spy).toHaveBeenCalledWith(`/api/v1/parents/${parentId}/children/${childId}`, { method: 'GET' });
		});

		it('should return the response in the correct format', async () => {
			const childId = faker.string.uuid();

			const response = {
				id: childId,
				name: faker.person.firstName()
			};

			(fetch as Mock).mockResolvedValueOnce({ json: async () => response });

			const result = await childClient.getChildById(childId);

			expect(result).toEqual({
				id: response.id,
				name: response.name
			});
		});

		it('should throw ChildDoesNotExistError if the child does not exist', async () => {
			const childId = faker.string.uuid();

			(fetch as Mock).mockResolvedValue({ 
				status: 404,
				json: async () => ({ message: 'Child does not exist' })
			 });

			await expect(childClient.getChildById(childId)).rejects.toThrowError(ChildDoesNotExistError);
		});
	});

	describe('createChild', () => {
		it('should call the API client with the correct path', async () => {
			const name = faker.person.firstName();

			const spy = vi.spyOn(apiClient, 'request');

			(fetch as Mock).mockResolvedValueOnce({ json: async () => ({ id: faker.string.uuid() }) });

			await childClient.createChild(name);

			expect(spy).toHaveBeenCalledWith(`/api/v1/parents/${parentId}/children`, { method: 'POST', body: { name } });
		});

		it('should return the response in the correct format', async () => {
			const name = faker.person.firstName();


			const response = {
				id: faker.string.uuid(),
			};

			(fetch as Mock).mockResolvedValueOnce({ json: async () => response });

			const result = await childClient.createChild(name);

			expect(result).toEqual({
				id: response.id,
				name
			});
		});
	});

	describe('deleteChild', () => {
		it('should call the API client with the correct path', async () => {
			const childId = faker.string.uuid();

			const spy = vi.spyOn(apiClient, 'request');

			(fetch as Mock).mockResolvedValueOnce({ json: async () => ({}) });

			await childClient.deleteChild(childId);

			expect(spy).toHaveBeenCalledWith(`/api/v1/parents/${parentId}/children/${childId}`, { method: 'DELETE' });
		});

		it('should throw ChildDoesNotExistError if the child does not exist', async () => {		
			const childId = faker.string.uuid();

			(fetch as Mock).mockResolvedValue({ 
				status: 404,
				json: async () => ({ message: 'Child does not exist' })
			 });

			await expect(childClient.deleteChild(childId)).rejects.toThrowError(ChildDoesNotExistError);
		});
	});
});
