<script lang="ts">
  import { replace as redirect_to } from 'svelte-spa-router';

  import { slugify, oportunisticParsePemalink } from './slugs';
  import Header from './Header.svelte';
  import Table from './ChannelView.svelte';
  import PageLoader from './spinners/PageLoader.svelte';
  import Button from './PaginationButton.svelte';
  import { getPage } from './couch';

  export let params: {channel: string, permalink: string };

  async function load(channel: string, permalink: string, n: number) {
    let timestamp = oportunisticParsePemalink(permalink);
    if (!timestamp) {
      redirect_to('/404');
      throw Error('invalid permalink, will redirect to 404');
    }
    return await getPage(channel, timestamp, n);
  }
</script>

<svelte:head><title>irc logs for #{params.channel}</title></svelte:head>

<Header><a href='#/'>irc logs</a> for <a href="#/{params.channel}">#{params.channel}</a></Header>

{#await load(params.channel, params.permalink, 10)}
  <PageLoader/>
{:then page}

<Button onClick={ () => page.prev(5) }>back</Button>
<Table rows={ page } channel={ params.channel } {slugify} />
<Button onClick={ () => page.next(5) }>forward</Button>

{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}
