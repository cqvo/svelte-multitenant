import { afterAll, beforeAll, beforeEach, describe, it, expect } from 'vitest';
import { awsKmsClient, createKMSConfig } from '$lib/server/utils/key-manager';
import { KMSClient, DescribeKeyCommand } from '@aws-sdk/client-kms';
import { env } from '$env/dynamic/private';

describe('Key Manager Unit Tests', () => {
	let env;

	beforeEach(() => {
		env = {
			AWS_REGION: 'us-east-1',
			AWS_ACCESS_KEY_ID: 'test-key',
			AWS_SECRET_ACCESS_KEY: 'test-secret',
			OTHER_VAR: 'asdf',
		};
	});

	it('createKMSConfig should return nothing with undefined env', () => {
		const undefinedEnv = undefined;
		const result = createKMSConfig(undefinedEnv);
		expect(result).toBeUndefined();
	});

	it('createKMSConfig should return nothing with no argument', () => {
		const result = createKMSConfig();
		expect(result).toBeUndefined();
	});

	it('createKMSConfig should return nothing with no valid env keys', () => {
		delete env.AWS_SECRET_ACCESS_KEY;
		delete env.AWS_ACCESS_KEY_ID;
		delete env.AWS_REGION;
		const result = createKMSConfig(env);
		expect(result).toBeUndefined();
	});

	it('createKMSConfig should return just region if no access key', () => {
		delete env.AWS_ACCESS_KEY_ID;
		const result = createKMSConfig(env);
		expect(result).toBeDefined();
		expect(result.region).toEqual(env.AWS_REGION);
		expect(result.credentials).toBeUndefined();
	});

	it('createKMSConfig should return just region if no access secret', () => {
		const testEnv = {...env};
		delete testEnv.AWS_SECRET_ACCESS_KEY;
		const result = createKMSConfig(testEnv);
		expect(result).toBeDefined();
		expect(result.region).toEqual(env.AWS_REGION);
		expect(result.credentials).toBeUndefined();
	});

	it('createKMSConfig should return region and credentials if key and secret exist', () => {
		const result = createKMSConfig(env);
		expect(result).toBeDefined();
		expect(result.credentials).toBeDefined();
		expect(result.region).toEqual(env.AWS_REGION);
		expect(result.credentials.accessKeyId).toEqual(env.AWS_ACCESS_KEY_ID);
		expect(result.credentials.secretAccessKey).toEqual(env.AWS_SECRET_ACCESS_KEY);
	});

	it('awsKeyClient fn should work', () => {
		const result = awsKmsClient;
		expect(result).toBeDefined();
	});
});

describe('AWS KMS Integration Tests', () => {
	const testKey = '71ba4ca7-9522-42b6-997b-35fb5bd86ec3';
	let keyId: string;

	beforeAll(async () => {
		keyId = env.AWS_KMS_KEY_ID;
	})

	it('should find the key ID from .env', () => {
		expect(keyId).toBeDefined();
		expect(keyId).toEqual(testKey);
	});

	it('should get a defined client from utils', async () => {
		expect(awsKmsClient).toBeDefined();
	});

	it('should get key using client directly', async () => {
		const command = new DescribeKeyCommand({ KeyId: keyId });
		const response = await awsKmsClient.send(command);
		console.log(response);
		expect(response).toBeDefined();
	});
});
