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
  :global(html) {
    font-family: sans-serif;
    font-size: 16pt;
    line-height: 1.25;
    height: 100%;
  }
  :global(body) {
    margin: 0;
    position: relative;
    min-height: 100%;
  }
  div { padding: 20px; padding-bottom: 4em; }
</style>

<Router {routes} />
<Footer/>
<GithubBadge/>
