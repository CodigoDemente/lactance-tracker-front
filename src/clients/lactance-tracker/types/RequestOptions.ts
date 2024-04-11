export type RequestOptions = {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	headers?: Record<string, string>;
	body?: Record<string, unknown>;
};
