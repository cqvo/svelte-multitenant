import { beforeAll, describe, it, expect } from 'vitest';

describe('Vitest', () => {
	let beforeAllResult: boolean;

	beforeAll(async () => {
		beforeAllResult = true;
	})

	it('should be able to use beforeAll', async () => {
		const result = beforeAllResult;
		expect(result).toBeDefined();
		expect(result).toBeTruthy();
	})
})