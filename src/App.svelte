<script>
  import Router from 'svelte-spa-router';

  import HomePage from './HomePage.svelte';
  import ChannelPage from './ChannelPage.svelte';
  import ChannelPageAt from './ChannelPageAt.svelte';
  import Footer from './Footer.svelte';
  import GithubBadge from './GithubBadge.svelte';
  import NotFound from './NotFound.svelte';

  const routes = {
    '/': HomePage,
    '/404': NotFound,
    '/:channel': ChannelPage,
    '/:channel/:permalink': ChannelPageAt,
    '*': NotFound,
  }
</script>

<style>
  :global(body) {
    font-family: sans-serif;
    font-size: 16pt;
    line-height: 1.25;
    margin: 0;
    display: flex;
    flex-flow: column;
    height: 100vh;
    justify-content: space-between;
  }
  main {
    padding: 0 4px;
    flex: 1;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-flow: column;
  }
</style>

<main>
  <Router {routes} />
</main>
<Footer/>
<GithubBadge/>
