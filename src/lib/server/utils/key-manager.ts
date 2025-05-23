import { KMSClient, type KMSClientConfig } from '@aws-sdk/client-kms';
import { and, switchCase, get, tryCatch, pipe } from '$lib/utils/rubico';
import { env } from '$env/dynamic/private';

const hasFullCredentials = (env: Record<string, string>) =>
	env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_REGION;

const hasRegionOnly = (env: Record<string, string>) =>
	env.AWS_REGION && (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY);

const createConfigWithCredentials = (env: Record<string, string>) => ({
	region: env.AWS_REGION,
	credentials: {
		accessKeyId: env.AWS_ACCESS_KEY_ID,
		secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
	}
});

const createConfigWithRegion = (env: Record<string, string>) => ({
	region: env.AWS_REGION
});

export const createKMSConfig = switchCase([
	hasFullCredentials, createConfigWithCredentials,
	hasRegionOnly, createConfigWithRegion,
	() => true, () => { throw new Error('Invalid AWS configuration') }
]);

export const awsKmsClient = tryCatch(
	pipe([
		createKMSConfig,
		(config: KMSClientConfig) => {
			if (!config) {
				throw new Error('Failed to create KMS configuration');
			}
			return new KMSClient(config);
		}
	]),
	(error: Error) => {
		throw new Error(`Failed to initialize KMS client: ${error.message}`);
	}
)(env);