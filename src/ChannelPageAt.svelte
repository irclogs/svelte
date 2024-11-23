<script lang="ts">
  import Button from "./components/PaginationButton.svelte";
  import Header from "./components/Header.svelte";
  import PageLoader from "./components/PageLoader.svelte";
  import Table from "./ChannelView.svelte";
  import { getPage } from "./libs/couch.svelte";
  import { oportunisticParsePemalink } from "./libs/slugs";
  import { Router } from "./libs/router.svelte";
  import { config } from "./libs/config";

  type Props = { channel: string; permalink: string };
  let { channel, permalink }: Props = $props();

  async function load(channel: string, permalink: string, n: number) {
    let timestamp = oportunisticParsePemalink(permalink);
    if (!timestamp) {
      Router.go("/404");
      throw Error("invalid permalink, will redirect to 404");
    }
    return await getPage(channel, timestamp, n);
  }
</script>

<svelte:head><title>irc logs for #{channel}</title></svelte:head>

<Header>
  <a href="#/">irc logs</a> for <a href="#/{channel}">#{channel}</a>
</Header>

{#await load(channel, permalink, 10)}
  <PageLoader />
{:then page}
  <Button onclick={() => page.prev(config.pageSize)}>back</Button>
  <Table rows={page.rows} {channel} />
  <Button onclick={() => page.next(config.pageSize)}>forward</Button>
{:catch error}
  <p>Something went wrong: {error.message}</p>
{/await}
