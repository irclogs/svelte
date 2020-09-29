<script lang="ts">

  // @ts-nocheck @ts-ignore-next-line: no typing for svelte-spa-router
  import { replace as redirect_to } from 'svelte-spa-router';

  import { slugify, oportunisticParsePemalink } from './slugs';
  import Header from './Header.svelte';
  import Table from './ChannelView.svelte';
  import PageLoader from './spinners/PageLoader.svelte';
  import Button from './PaginationButton.svelte';
  import { getPage } from './couch';
  import type { Page } from './couch';

  export let params: {channel: string, permalink: string };
  document.title = `irc logs for #${params.channel}`;

  let response: Promise<Page>;
  $: {
    let timestamp = oportunisticParsePemalink(params.permalink);
    if (timestamp) {
      response = getPage(params.channel, timestamp, 5);
    } else {
      // invalid permalink, redirect to 404
      redirect_to('/404');
    }
  }
</script>

<Header><a href='#/'>irc logs</a> for <a href="#/{params.channel}">#{params.channel}</a></Header>

{#await response}
  <PageLoader/>
{:then page}

<Button onClick={ () => page.prev(5) }>back</Button>
<Table rows={ page } channel={ params.channel } {slugify} />
<Button onClick={ () => page.next(5) }>forward</Button>

{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}
