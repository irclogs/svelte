<script lang="ts">

  // @ts-nocheck
  import { replace} from 'svelte-spa-router';
  import Header from './Header.svelte';
  import Table from './ChannelView.svelte';
  import PageLoader from './spinners/PageLoader.svelte';
  import { getPageAt, getPrevPage, getNextPage } from './couch';
  import type { ViewResponse } from './couch';
  import { slugify, deslugify } from './slugs';

  export let params: {channel: string, permalink: string };
  document.title = `irc logs for #${params.channel}`;


  function oportunisticParsePemalink(permalink:string): number|null {
    // try hashids
    try {
      let t = deslugify(permalink);
      if (t !== []) return t[0] as number;
    } catch { console.log('throw for', permalink) }

    // next try Date
    let d = Date.parse(permalink);
    if (d !== NaN) return d;

    console.log('not parsed', permalink);
    return null;
  }

  let response: Promise<ViewResponse>;

  $: {
    console.log(params.permalink);
    let timestamp = oportunisticParsePemalink(params.permalink);
    if (timestamp) {
      console.log(timestamp);
      console.log(new Date(timestamp));
      response = getPageAt(params.channel, 5, timestamp/1000);
    }
    else {
      // invalid permalink, redirect to 404
      replace('/404');
    }
  }

  function OnClickBack(page: ViewResponse): void {
    response = getPrevPage(page, 20)
        .then(nextPage => {
          let allrows = nextPage.rows.concat(page.rows);
          return {...nextPage, rows:allrows};
        });
  }
  function OnClickForward(page: ViewResponse): void {
    response = getNextPage(page, 20)
        .then(prevPage => {
          let allrows = page.rows.concat(prevPage.rows);
          return {...prevPage, rows:allrows};
        });
  }
</script>

<Header>irc logs for #{params.channel}</Header>

{#await response}
  <PageLoader/>
{:then page}
<div class="pagination-button back">
  <button on:click={ ()=>OnClickBack(page) }>back</button>
</div>

<Table rows={ page.rows } channel={ params.channel } {slugify} />

<div class="pagination-button forward">
  <button on:click={ ()=>OnClickForward(page) }>forward</button>
</div>

{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}

<style>
  div.pagination-button {
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  div.pagination-button.forward {
    margin-top: 1.2rem;
  }
</style>
