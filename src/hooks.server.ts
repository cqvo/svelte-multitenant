import { type Handle, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { PUBLIC_VITE_VERCEL_PROJECT_PRODUCTION_URL } from '$env/static/public';
import { env } from '$env/dynamic/private';
import { getEdgeConfig } from '$lib/server/edge-config';
import { handleLogto } from '@logto/sveltekit';

const edgeConfig: Handle = async ({ event, resolve }) => {
	const apex = PUBLIC_VITE_VERCEL_PROJECT_PRODUCTION_URL;
	const hostname = event.url.hostname;
	if (apex !== hostname) {
		const tenant = hostname.split('.')[0];
		const config = await getEdgeConfig(tenant);
		if (!config) {
			return error(404, {message: 'not found'});
		}
		event.locals.tenant = config;
	}
	const result = await resolve(event);
	return result;
}

const logto = handleLogto(
	{
		endpoint: env.LOGTO_ENDPOINT,
		appId: env.LOGTO_APP_ID,
		appSecret: env.LOGTO_APP_SECRET,
	},
	{
		encryptionKey: env.LOGTO_COOKIE_ENCRYPTION_KEY,
	}
)

export const handle = sequence(edgeConfig, logto);