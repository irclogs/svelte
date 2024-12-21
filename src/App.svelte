<script lang="ts">
  import IndexPage from "./IndexPage.svelte";
  import ChannelHome from "./ChannelHome.svelte";
  import ChannelPageAt from "./ChannelPageAt.svelte";
  import Footer from "./components/Footer.svelte";
  import GithubBadge from "./components/GithubBadge.svelte";
  import NotFound from "./components/NotFound.svelte";

  import { router } from "./libs/router";
</script>

<main>
  {#if router.hash == "/"}
    <IndexPage />
  {:else if router.hash == "/404"}
    <NotFound />
  {:else if router.hash.match(/^\/[^/]+$/)}
    <ChannelHome channel={router.hash.slice(1)} />
  {:else if router.hash.match(/^\/[^/]+\/[^/]+$/)}
    {@const [_, channel, permalink] = router.hash.split("/")}
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
