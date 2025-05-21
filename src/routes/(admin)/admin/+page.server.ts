import type { PageServerLoad } from './$types';
import { getNeonProjects } from '$lib/server/neon-api';

export const load: PageServerLoad = async () => {
	const { projects } = await getNeonProjects();
	return {
		projects
	}
}