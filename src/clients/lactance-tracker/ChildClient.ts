import type { APIClient } from './APIClient';
import { ChildDoesNotExistError } from './errors/child/ChildDoesNotExistError';
import type { ApiChild, Child } from './types/Child';
import type { Pagination, ResponseWithId } from './types/ResponseData';

enum RequestPaths {
	CHILDREN = '/api/v1/parents/:parentId/children',
  CHILD = '/api/v1/parents/:parentId/children/:childId'
}

export class ChildClient {
	constructor(
    private readonly apiClient: APIClient,
    private readonly parentId: string
  ) {}

	async getChildren(): Promise<Child[]> {
		const response = await this.apiClient.request<Pagination<ApiChild>>(
			RequestPaths.CHILDREN.replace(':parentId', this.parentId),
			{
				method: 'GET'
			}
		);

		const childData = response.data.items;

		return childData.map((child) => ({
			id: child.id,
			name: child.name
		}));
	}

  async getChildById(childId: string): Promise<Child> {
    const response = await this.apiClient.request<ApiChild>(
      RequestPaths.CHILD.replace(':parentId', this.parentId).replace(':childId', childId),
      {
        method: 'GET'
      }
    );

    if (response.status === 404) {
      throw new ChildDoesNotExistError(childId);
    }

    const childData = response.data;

    return {
      id: childData.id,
      name: childData.name
    };
  }

  async createChild(name: string): Promise<Child> {
    const response = await this.apiClient.request<ResponseWithId>(
      RequestPaths.CHILDREN.replace(':parentId', this.parentId),
      {
        method: 'POST',
        body: {
          name
        }
      }
    );

    const childData = response.data;

    return {
      id: childData.id,
      name: name
    };
  }

  async deleteChild(childId: string): Promise<void> {
    const response = await this.apiClient.request(
      RequestPaths.CHILD.replace(':parentId', this.parentId).replace(':childId', childId),
      {
        method: 'DELETE'
      }
    );

    if (response.status === 404) {
      throw new ChildDoesNotExistError(childId);
    }
  }
}
