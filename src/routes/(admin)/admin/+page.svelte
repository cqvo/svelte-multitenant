<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
	let { projects } = $derived(data);
</script>

<h1>admin</h1>

{JSON.stringify(projects)}