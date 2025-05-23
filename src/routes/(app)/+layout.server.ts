// routes/+layout.server.ts
import type { LayoutServerLoad } from './$types';
import { getDbClient } from '$lib/server/db';
import { getPlaidClient } from '$lib/server/plaid';

export const load: LayoutServerLoad = async ({ locals }) => {
	// Get tenant config from locals (set by your hook)
	const tenant = locals.tenant;

	if (!tenant || !tenant.connectionString) {
		// Handle case where tenant config is missing or invalid
		return {
			tenant: tenant || null,
			db: null
		};
	}

	// Get or create the DB client singleton for this tenant
	const tenantId = tenant.id || tenant.name; // Use appropriate tenant identifier
	const db = getDbClient(tenantId, tenant.connectionString);

	// Return the database client along with any other data
	// that should be available to all routes
	return {
		tenant,
		db
	};
};