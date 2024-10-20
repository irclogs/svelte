<script lang="ts">
  import IndexPage from "./IndexPage.svelte";
  import ChannelHome from "./ChannelHome.svelte";
  import ChannelPageAt from "./ChannelPageAt.svelte";
  import Footer from "./Footer.svelte";
  import GithubBadge from "./GithubBadge.svelte";
  import NotFound from "./NotFound.svelte";

  import { Router } from "./libs/router.svelte";
</script>

<main>
  {#if Router.hash == "/"}
    <IndexPage />
  {:else if Router.hash == "/404"}
    <NotFound />
  {:else if Router.hash.match(/^\/[^/]+$/)}
    <ChannelHome channel={Router.hash.slice(1)} />
  {:else if Router.hash.match(/^\/[^/]+\/[^/]+$/)}
    {@const [_, channel, permalink] = Router.hash.split("/")}
    <ChannelPageAt {channel} {permalink} />
  {:else}
    <NotFound />
  {/if}
</main>

<Footer />
<GithubBadge />

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
    /*
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-flow: column;
    */
  }
</style>
