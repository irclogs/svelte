<script>
  import Footer from './Footer.svelte';
  import GithubBadge from './GithubBadge.svelte';
  import HomePage from './HomePage.svelte';
  import ChannelPage from './ChannelPage.svelte';
  import { hashRouter } from './router.js';
  const router = hashRouter();
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

<div>

{#if $router == ""}
<HomePage/>
{:else if $router == 404 }
<HomePage error="not found"/>
{:else}
<ChannelPage name={$router}/>
{/if}
</div>
<Footer/>
<GithubBadge/>
