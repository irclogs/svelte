<script lang="ts">
  import Header from './Header.svelte';
  import Table from './ChannelView.svelte';
  import PageLoader from './spinners/PageLoader.svelte';
  import Button from './PaginationButton.svelte';
  import { getLatest } from './couch';
  import { slugify } from './slugs';

  export let params: {channel: string};
  document.title = `irc logs for #${params.channel}`;
</script>

<Header><a href='#/'>irc logs</a> for #{params.channel}</Header>

{#await getLatest(params.channel, 100) }
  <PageLoader/>

{:then page}

<Button onClick={ () => page.prev(50) }>back</Button>
<Table rows={ page } channel={ params.channel } {slugify} />

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
  }
</style>
