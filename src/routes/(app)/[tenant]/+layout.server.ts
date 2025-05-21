import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ params, locals }) => {
	return {
		tenantId: params.tenant,
		tenantConfig: locals.tenant,
	};
};