<script>
  import { onMount } from 'svelte';
  const url = new URL('https://irc.softver.org.mk/ddoc/_view/channel');
  const params = new URLSearchParams({update_seq:true, reduce:true, group_level:1});

  const headers = {'accept': 'application/json'};
  let channels = [];
  onMount(async () => {
    const res = await fetch(url + '?' + params, {mode: "cors", headers:headers});
    channels = (await res.json()).rows;
    $: document.title = "irclog";
  })
</script>

<style>
  ul { list-style-type: square; padding-left: 2em; margin: 1em 0px; }
</style>

<h1>IRC logs with realtime updates</h1>

<ul>
	{#each channels as channel}
    <li>{channel.key[0]}</li>
	{:else}
		<p>loading...</p>
	{/each}
</ul>
