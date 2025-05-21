import { createClient, type EdgeConfigClient } from '@vercel/edge-config';
import { VERCEL_EDGE_CONFIG, VERCEL_EDGE_CONFIG_ID, VERCEL_TEAM_ID, VERCEL_API_URL, VERCEL_OIDC_TOKEN } from '$env/static/private';
import { tryCatch } from '$lib/utils/rubico';

export const edgeConfigClient = createClient(VERCEL_EDGE_CONFIG);

const edgeConfigApiEndpoint = `${VERCEL_API_URL}/edge-config/${VERCEL_EDGE_CONFIG_ID}/items?teamId=${VERCEL_TEAM_ID}`;

export const getEdgeConfig = tryCatch(
	async (key: string, client: EdgeConfigClient = edgeConfigClient) => {
		const config = await client.get(key);
		return config ?? {};
	},
	(error: never) => {
		return {};
	}
);

export const getAllEdgeConfigs = tryCatch(
	async (key?: string[], client: EdgeConfigClient = edgeConfigClient ) => {
		const configItems = await client.getAll(key);
		return configItems ?? {};
	},
	(error: never) => {
		return {};
	}
);

export const updateEdgeConfig = tryCatch(
	async (items: EdgeConfigUpdateItem[]) => {
		const response = await fetch(edgeConfigApiEndpoint, {
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${VERCEL_OIDC_TOKEN}`,
			},
			method: 'PATCH',
			body: JSON.stringify({ items })
		});
		return response.json();
	},
	(error: never) => {
		return {};
	}
);

type EdgeConfigUpdateItem = {
	operation: string;
	key: string;
	value: string;
}

interface EdgeConfigUpdateBody {
	items: EdgeConfigUpdateItem[];
}