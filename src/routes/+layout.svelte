<script>
    import "bulma/css/bulma.css";
    import Navbar from "$lib/components/Navbar.svelte";
    let { data, children } = $props();
</script>

<svelte:head>
  <meta name="robots" content="noindex,nofollow" />
</svelte:head>

<Navbar user={data.user} />

{@render children()}

