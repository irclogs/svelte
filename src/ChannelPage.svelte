<script lang="ts">

  import Header from './Header.svelte';
  import Table from './ChannelView.svelte';
  import PageLoader from './spinners/PageLoader.svelte';
  import { getLast, getPrevPage } from './couch';
  import type { ViewResponse } from './couch';
  import { slugify } from './slugs';

  export let params: {channel: string};
  document.title = `irc logs for #${params.channel}`;

  let response = getLast(params.channel, 100);

  function OnClickBack(page: ViewResponse) {
    response = getPrevPage(page)
        .then(prevPage => {
          let allrows = prevPage.rows.concat(page.rows);
          return {...prevPage, rows:allrows};
        });
  }
</script>

<Header>irc logs for #{params.channel}</Header>

{#await response}
  <PageLoader/>
{:then page}
<div style="text-align: center;">
  <button on:click={ ()=>OnClickBack(page) }>back</button>
</div>

<Table rows={ page.rows } channel={ params.channel } {slugify} />

<div class="feed">…waiting for updates…</div>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}

<style>
  div.feed { text-align: center; font-size: 60%; opacity: 0.5; }
</style>
