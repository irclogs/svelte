<script lang="ts">
  import Header from "./Header.svelte";
  import Table from "./ChannelView.svelte";
  import PageLoader from "./spinners/PageLoader.svelte";
  import Button from "./PaginationButton.svelte";
  import { getLatest } from "./libs/couch.svelte";
  import { config } from "./libs/config";

  type Props = { channel: string };
  let { channel }: Props = $props();
</script>

<svelte:head><title>irc logs for #{channel}</title></svelte:head>

<Header><a href="#/">irc logs</a> for #{channel}</Header>

{#await getLatest(channel, config.indexPageSize)}
  <PageLoader />
{:then livePage}
  <Button onclick={() => livePage.prev(config.pageSize)}>back</Button>
  <Table rows={livePage.rows} {channel} />

  <div class="feed">…waiting for updates…</div>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}

<style>
  div.feed {
    width: 100%;
    margin-top: 10px;
    text-align: center;
    font-size: 0.6rem;
    opacity: 0.5;
    animation: pulse 30s infinite;
  }
  @keyframes pulse {
    0%,
    90%,
    100% {
      /* opacity: 0.5; */
      text-shadow: #0068ad 0 0 0;
    }
    95% {
      /* opacity: 0.6; */
      text-shadow: #0068ad 0 0 2px;
    }
  }
</style>
