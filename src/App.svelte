<script>
  import Router from 'svelte-spa-router';

  import HomePage from './HomePage.svelte';
  import ChannelPage from './ChannelPage.svelte';
  import Footer from './Footer.svelte';
  import GithubBadge from './GithubBadge.svelte';
  import NotFound from './NotFound.svelte';

  const routes = {
    '/': HomePage,
    '/:channel/:permalink?': ChannelPage,
    '*': NotFound,
  }
</script>

<style>
  :global(body) {
    font-family: sans-serif;
    font-size: 16pt;
    line-height: 1.25;
    margin: 0;
  }
  main { padding: 0 4px 3rem; }
</style>

<main>
  <Router {routes} />
</main>
<Footer/>
<GithubBadge/>
