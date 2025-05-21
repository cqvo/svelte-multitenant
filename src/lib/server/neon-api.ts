import {
	type Api,
	createApiClient,
	type ListProjectsParams,
	type GeneralError, type ProjectCreateRequest, type RequestParams
} from '@neondatabase/api-client';
import { NEON_API_KEY } from '$env/static/private';
import { tryCatch } from '$lib/utils/rubico';

export type NeonApiClient = Api<unknown>;

export const neonApiClient: NeonApiClient = createApiClient({
	apiKey: NEON_API_KEY!,
});

export const getNeonProjects = tryCatch(
	async (query: ListProjectsParams = {}, client: NeonApiClient = neonApiClient ) => {
		const { data } = await client.listProjects(query);
		console.log(data.projects);
		return data ?? {};
	},
	(error: GeneralError) => {
		const { code, message } = error;
		console.error({ code, message });
		return { projects: [] };
	}
);

export const createNeonProject = tryCatch(
	async (payload: ProjectCreateRequest, client: NeonApiClient = neonApiClient ) => {
		const { data } = await client.createProject(payload);
		return data ?? {};
	},
	(error: GeneralError) => {
		const { code, message } = error;
		console.error({ code, message });
		return {};
	}
);

export const deleteNeonProject = tryCatch(
	async (projectId: string, params?: RequestParams, client: NeonApiClient = neonApiClient) => {
		const { data } = await client.deleteProject(projectId, params);
		return data ?? {};
	},
	(error: GeneralError) => {
		const { code, message } = error;
		console.error({ code, message });
		return {};
	}
);