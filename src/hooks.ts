import type { Reroute } from "@sveltejs/kit";
import { PUBLIC_VITE_VERCEL_PROJECT_PRODUCTION_URL } from '$env/static/public';

export const reroute: Reroute = ({ url }) => {
	const apex = PUBLIC_VITE_VERCEL_PROJECT_PRODUCTION_URL;
	const requestedHostname = url.hostname;

	const isSubdomain = requestedHostname !== apex;
	console.log({apex, requestedHostname, isSubdomain});

	if (isSubdomain) {
		const tenant = requestedHostname.split('.')[0];
		return `/${tenant}${url.pathname}`;
	}

	return url.pathname;
}