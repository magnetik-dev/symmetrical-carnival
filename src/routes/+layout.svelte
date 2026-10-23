<script>
    import "bulma/css/bulma.css";
    import "../app.css";
    import Navbar from "$lib/components/Navbar.svelte";
    let { data, children } = $props();
</script>

<svelte:head>
  <meta name="robots" content="noindex,nofollow" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500&display=swap"
  />
</svelte:head>

<Navbar user={data.user} profile={data.profile} />

{@render children()}
