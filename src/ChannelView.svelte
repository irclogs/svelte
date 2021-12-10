<script lang="ts">
    import { derived } from 'svelte/store';
    import { colorize } from './libs/colorize';
    import type { Message } from './libs/couch-api';
    import { autoscroll_init } from './libs/autoscroll';

    interface DisplayMessage extends Message {
        date: string, time: string, slug: string
    }

    export let channel: string;
    export let rows: SvelteStore<Message[]>;
    export let slugify: (_:number) => string;
    export let autoscroll = false;

    if (autoscroll) {
      autoscroll_init();
    }

    function addDateAndTime(msg: Message): DisplayMessage {
        let t = new Date(msg.timestamp * 1000);
        let slug = slugify(Math.trunc(msg.timestamp));
        // poor mans strftime
        let time = `${t.getHours().toString().padStart(2, '0')}:${t.getMinutes().toString().padStart(2, '0') }:${t.getSeconds().toString().padStart(2, '0')}`;
        let date = `${t.getFullYear()}-${(t.getMonth() + 1).toString().padStart(2, '0')}-${t.getDate().toString().padStart(2, '0')}`;
        return {...msg, slug, time, date};
    };

    function groupByDate(acc: Map<string,DisplayMessage[]>, msg: DisplayMessage) {
        acc.get(msg.date)?.push(msg) ?? acc.set(msg.date, [msg]);
        return acc;
    };

    let grouppedRows = derived(rows,
        $rows => $rows
          .map(row => addDateAndTime(row))
          .reduce(groupByDate, new Map())
    )
</script>

<table>
  {#each [...$grouppedRows.keys()] as group}
    <tbody>
      <tr>
        <th colspan="2" class="group">
          <a class="permalink" href="#/{channel}/{group}" id={group}>{group}</a>
        </th>
      </tr>
      {#each $grouppedRows.get(group) ?? [] as doc}
        <tr>
          <td>
            <span class="nick" style={colorize(doc.sender)}>{doc.sender}</span> &nbsp;{doc.message}
          </td>
          <td class="timestamp">
            <a class="permalink" href="#/{channel}/{doc.slug}" id={doc.slug}>{doc.time}</a>
          </td>
        </tr>
      {/each}
    </tbody>
  {/each}
</table>

<style>
    table { min-width: 100%; }
    span.nick {
      font-size: 70%;
      padding: 1px 2px;
      color: black;
    }
    td.timestamp a {
      font-size: 80%;
      font-family: monospace;
      text-decoration: none;
    }
    td.timestamp {
      text-align: right;
      vertical-align: top;
    }
    table tbody tr th.group {
      border-top: 1px dashed #a0a0a0;
      text-align: right;
    }
    a.permalink {
      color: rgb(128, 128, 128);
      text-decoration: none;
    }
</style>
