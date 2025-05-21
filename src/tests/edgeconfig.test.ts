import { beforeAll, describe, it, expect } from 'vitest';
import { createClient, type EdgeConfigClient } from '@vercel/edge-config';
import { VERCEL_EDGE_CONFIG } from '$env/static/private';
import { getAllEdgeConfigs, getEdgeConfig, updateEdgeConfig } from '$lib/server/edge-config';

describe('Vercel Edge Config Integration Test', () => {
	let edgeConfigClient: EdgeConfigClient;
	const testTenant: string = 'tenant1';
	const testHostname: string = 'tenant1.domain.com';

	beforeAll(() => {
		edgeConfigClient = createClient(VERCEL_EDGE_CONFIG);
	});

	it('should be able to get one with ID', async () => {
		const result = await getEdgeConfig(testTenant);
		console.log({result});
		expect(result).toBeDefined();
	});

	it('should be able to get all', async () => {
		const result = await getAllEdgeConfigs();
		console.log({result});
		expect(result).toBeDefined();
	});

	it('should be able to getAll with keys', async () => {
		const keys = ['greeting'];
		const result = await getAllEdgeConfigs(keys);
		console.log({result});
		expect(result).toBeDefined();
	});

	it('should be able to create new config', async () => {
		const items = [
			{operation: 'create', key: 'test1', value: 'test1'},
		];
		const response = await updateEdgeConfig(items);
		expect(response).toBeDefined();
		expect(response.error).toBeUndefined();
	});

	// it('should be able to create multiple new config', async () => {
	// 	const items = [
	// 		{operation: 'create', key: 'test2', value: 'test2'},
	// 		{operation: 'create', key: 'test3', value: 'test3'},
	// 	];
	// 	const response = await updateEdgeConfig(items);
	// 	expect(response).toBeDefined();
	// });

})