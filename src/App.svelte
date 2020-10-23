<script lang="ts">
  import Router from 'svelte-spa-router';

  import HomePage from './HomePage.svelte';
  import ChannelFeed from './ChannelFeed.svelte';
  import ChannelPageAt from './ChannelPageAt.svelte';
  import Footer from './Footer.svelte';
  import GithubBadge from './GithubBadge.svelte';
  import NotFound from './NotFound.svelte';

  const routes = {
    '/': HomePage,
    '/404': NotFound,
    '/:channel': ChannelFeed,
    '/:channel/:permalink': ChannelPageAt,
    '*': NotFound,
  }
</script>

<style>
  @media screen and (min-device-width: 1600px) {
    :global(html) {
      font-size: 16pt;
      line-height: 1.25;
    }
  }
  :global(body) {
    font-family: sans-serif;
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
