import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionPool = new Map<string, ReturnType<typeof drizzle>>();

export function getDbClient(tenantId: string, connectionString: string) {
	if (connectionPool.has(tenantId)) {
		return connectionPool.get(tenantId)!;
	}

	const client = postgres(connectionString);
	const db = drizzle(client, { schema });

	connectionPool.set(tenantId, db);

	return db;
}