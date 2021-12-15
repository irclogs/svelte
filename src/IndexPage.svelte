<script lang="ts">
  import Header from "./Header.svelte";
  import PageLoader from "./spinners/PageLoader.svelte";
  import { fetchChannelList } from "./libs/couch-api";
</script>

<svelte:head><title>irclog</title></svelte:head>

<Header>IRC logs with realtime updates</Header>
<div style="display: flex">
  <div style="flex: 1 50%">
    {#await fetchChannelList()}
      <PageLoader />
    {:then channelList}
      <p>The following channels are currently logged:</p>
      <ul>
        {#each channelList as channel}
          <li><a href="#/{channel.name}" title="total messages: {channel.total_messages}">{channel.name}</a></li>
        {/each}
      </ul>
    {:catch error}
      <p>Something went wrong: {error.message}</p>
    {/await}
  </div>

  <div style="flex: 1 50%">
    <p>
      This web page is a viewer of irclogs collected by my
      <a href="https://github.com/gdamjan/erlang-irc-bot">erlang irc bot</a>. The bot stores the logs in a CouchDB where
      this web-app (or couchapp) is also stored. You can also
      <a href="https://docs.couchdb.org/en/stable/replication/">replicate</a>
      the database at https://db.softver.org.mk/irclog freely.
    </p>
    <p>If you want your irc channel on LiberaChat logged, contact 'damjan' on #spodeli.</p>
  </div>
</div>

<style>
  ul {
    list-style-type: square;
    padding-left: 2em;
    margin: 1em 0px;
  }
  p {
    margin: 1em;
  }
</style>
