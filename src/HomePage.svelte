<script>
  import PageLoader from './spinners/PageLoader.svelte';
  import { getChannelList } from './couch';
  document.title = "irclog";
</script>

<style>
  header {
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    color: #444444;
  }
  ul {
    list-style-type: square;
    padding-left: 2em;
    margin: 1em 0px;
  }
  p { width: 50%; }
</style>

<header>
<h1>IRC logs with realtime updates</h1>
</header>

<p>
This web page is a viewer of irclogs collected by my
<a href="https://github.com/gdamjan/erlang-irc-bot">erlang irc bot</a>.
The bot stores the logs in a CouchDB where this web-app (or couchapp) is
also stored. You can also <a href="https://docs.couchdb.org/en/stable/replication/">replicate</a>
the database at https://irc.softver.org.mk/api freely.
</p>

{#await getChannelList()}
    <PageLoader/>
{:then channelList}
    <p>The following channels are currently logged:</p>
    <ul>
        {#each channelList as channel}
            <li><a href="#/{channel.name}" title="total messages: {channel.total_messages}">{channel.name}</a></li>
        {/each}
    </ul>
    <p>If you want your irc channel on freenode logged, contact 'damjan' on #lugola.</p>
{:catch error}
    <p>Something went wrong: {error.message}</p>
{/await}
