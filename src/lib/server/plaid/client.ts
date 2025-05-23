import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';
import { env } from '$env/dynamic/private';

const plaidClientPool = new Map<string, PlaidApi>();

export function getPlaidClient(tenantId: string, config: {
	clientId: string;
	secret: string;
	environment?: keyof typeof PlaidEnvironments;
	version?: string;
}) {
	// Return existing client if available
	if (plaidClientPool.has(tenantId)) {
		return plaidClientPool.get(tenantId)!;
	}

	// Default environment and version if not provided
	const plaidEnv = config.environment || env.PLAID_ENV || 'sandbox';
	const plaidVersion = config.version || '2020-09-14';

	// Create a new configuration for the tenant
	const configuration = new Configuration({
		basePath: PlaidEnvironments[plaidEnv],
		baseOptions: {
			headers: {
				'PLAID-CLIENT-ID': config.clientId,
				'PLAID-SECRET': config.secret,
				'Plaid-Version': plaidVersion,
			},
		},
	});

	// Create a new Plaid API client for the tenant
	const client = new PlaidApi(configuration);

	// Store the client for future use
	plaidClientPool.set(tenantId, client);

	return client;
}

// Optional: Fallback client using environment variables
export function getFallbackPlaidClient() {
	return new PlaidApi(new Configuration({
		basePath: PlaidEnvironments[env.PLAID_ENV || 'sandbox'],
		baseOptions: {
			headers: {
				'PLAID-CLIENT-ID': env.PLAID_CLIENT_ID,
				'PLAID-SECRET': env.PLAID_SECRET,
				'Plaid-Version': '2020-09-14',
			},
		},
	}));
}