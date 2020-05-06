<script>
  import PageLoader from './spinners/PageLoader.svelte';
  import {colorize} from './colorize.js' ;
  import {getLast100} from './couch.js';

  export let params = {}
  document.title = `irc logs for #${params.channel}`;

  const addDateAndTime = doc => {
      let t = new Date(doc.timestamp * 1000);
      // poor mans strftime
      let time = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0') }:${t.getSeconds().toString().padStart(2, '0')}`;
      let date = `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')}`;
      let datetime = `${date}T${time}`;
      return {...doc, time, date, datetime};
  };
  const groupByDate = (acc, doc) => {
      if (! acc.has(doc.date)) { acc.set(doc.date, []) };
      acc.get(doc.date).push(doc);
      return acc;
  };
  let response = getLast100(params.channel)
    .then(result =>
        result.rows
            .reverse()
            .map(row => addDateAndTime(row.doc))
            .reduce(groupByDate, new Map())
    );
</script>

<style>
  header {
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    color: #444444;
  }
  span {font-size: 70%; padding: 1px 2px; color: black;}
  td.timestamp a {font-size: 80%; font-family: monospace; text-decoration: none;}
  table tbody tr th {
    color: #a0a0a0;
    border-top: 1px dashed #a0a0a0;
  }
  a {
    color: rgb(128, 128, 128);
    text-decoration: none;
  }
</style>

<header>
<h1>irc logs for #{params.channel}</h1>
</header>

{#await response}
  <PageLoader/>
{:then data}
<div style="text-align: center;"><button>back</button></div>
<table>
{#each [...data.keys()] as group}
<tbody>
  <tr>
    <th colspan="2" align="right">
      <a href="#/{params.channel}/{group}" id={group}>{group}</a>
    </th>
  </tr>
  {#each data.get(group) as doc}
  <tr>
    <td><span style={colorize(doc.sender)}>{doc.sender}</span>
    &nbsp;{doc.message}</td>
    <td class="timestamp">
    <a href="#/lugola/{doc.datetime}" id="{doc.datetime}">{doc.time}</a>
    </td>
  </tr>
  {/each}
</tbody>
{/each}
</table>
<div style="text-align: center; font-size: 60%; opacity: 0.5;">…waiting for updates…</div>
{:catch error}
	<p>Something went wrong: {error.message}</p>
{/await}
