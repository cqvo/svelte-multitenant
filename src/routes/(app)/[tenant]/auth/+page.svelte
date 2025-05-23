<script lang="ts">
	import type { PageProps } from './$types';
	let { data }: PageProps = $props();
</script>

<form method="POST" action="?/{data.user ? 'signOut' : 'signIn'}">
	<button type="submit">Sign {data.user ? 'out' : 'in'}</button>
</form>