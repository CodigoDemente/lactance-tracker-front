import { vi } from 'vitest';

export const jwtDecode = vi.fn().mockReturnValue({
	sub: '123',
	username: 'test',
	email: 'test@test.com'
});
