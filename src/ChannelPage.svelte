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
<div class="pagination-button">
  <button on:click={ ()=>OnClickBack(page) }>back</button>
</div>

<Table rows={ page.rows } channel={ params.channel } {slugify} />

<div class="feed">…waiting for updates…</div>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}

<style>
  div.pagination-button {
    width: 100%;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  div.feed {
    width: 100%;
    margin-top: 10px;
    text-align: center;
    font-size: 0.6rem;
    opacity: 0.5;
  }
</style>
