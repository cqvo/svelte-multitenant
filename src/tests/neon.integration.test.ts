import { afterAll, beforeAll, describe, it, expect } from 'vitest';

import { createApiClient, type ProjectCreateRequest } from '@neondatabase/api-client';
import { NEON_API_KEY } from '$env/static/private';
import { createNeonProject, deleteNeonProject, getNeonProjects, type NeonApiClient } from '$lib/server/neon-api';

describe('Neon Integration Test', async () => {
	let neonApiClient: NeonApiClient;
	let newProjectId: string;
	const newProject: ProjectCreateRequest = {
		project: {
			name: 'test_project_name',
			region_id: 'aws-us-east-1',
		}
	};
	
	beforeAll(() => {
		neonApiClient = createApiClient({ apiKey: NEON_API_KEY! })
	});
	
	it('should be able to list all projects', async () => {
		const { projects } = await getNeonProjects({}, neonApiClient);

		expect(projects).toBeDefined();
		expect(projects).toBeTypeOf('object');
		expect(projects.length).toBeTruthy();
	});

	it('should handle errors gracefully', async () => {
		const badClient = createApiClient({ apiKey: 'bad_key' });
		const { projects } = await getNeonProjects({}, badClient);

		expect(projects).toBeDefined();
		expect(projects).toBeTypeOf('object');
		expect(projects).toHaveLength(0);
	})

	it('should be able to create a project', async () => {
		const data = await createNeonProject(newProject, neonApiClient);
		const { project } = data;
		const connection_uris = data.connection_uris;
		newProjectId = project.id;
		expect(project).toBeDefined();
		expect(project.id).toBeDefined();
		expect(connection_uris.length).toBeGreaterThan(0);
		expect(connection_uris[0]).toBeDefined();
	});
	
	it('should be able to find the new project', async () => {
		const query = { search: newProject.project.name };
		const data = await getNeonProjects(query, neonApiClient);
		const { projects } = data;
		expect(projects).toBeDefined();
		expect(projects.length).toEqual(1);
		expect(projects[0].id).toEqual(newProjectId);
	})

	it('should be able to delete a project', async () => {
		const data = await deleteNeonProject(newProjectId, neonApiClient);
		const { project } = data;
		expect(project).toBeDefined();
		expect(project.id).toEqual(newProjectId);
	});

	afterAll(() => {
		deleteNeonProject(newProjectId, neonApiClient);
	});
})