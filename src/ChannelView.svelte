<script lang="ts">
  import { colorize } from "./libs/colorize";
  import { autoscroll_init } from "./libs/autoscroll";
  import { groupRows, MessageView } from "./libs/couch";

  export let channel: string;
  export let rows: SvelteStore<MessageView[]>;
  export let autoscroll = false;

  let grouppedRows = groupRows(rows);

  if (autoscroll) {
    autoscroll_init();
  }

  function embed(node: HTMLSpanElement, nodes: Node[]) {
    node.replaceChildren(...nodes);
  }
</script>

<table>
  {#each [...$grouppedRows.keys()] as group}
    <tbody>
      <tr>
        <th colspan="2" class="group">
          <a class="permalink" href="#/{channel}/{group}" id={group}>{group}</a>
        </th>
      </tr>
      {#each $grouppedRows.get(group) ?? [] as doc (doc._id)}
        <tr>
          <td>
            <span class="nick" style={colorize(doc.sender)}>{doc.sender}</span>
            <span use:embed={doc.html} />
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
  table {
    min-width: 100%;
  }
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
