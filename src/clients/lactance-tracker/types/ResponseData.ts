export type ResponseData<T> = {
	status: number;
	data: T;
};

export type Pagination<T> = {
	page: number;
	total: number;
	items: T[];
};

export type ResponseWithId = {
	id: string;
};