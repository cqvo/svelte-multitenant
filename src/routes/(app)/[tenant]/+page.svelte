<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<h1>tenant</h1>

{data.tenantId}

{data.tenantConfig.msg}