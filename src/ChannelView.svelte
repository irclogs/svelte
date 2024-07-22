<script lang="ts">
  import { colorize } from "./libs/colorize";
  import { groupRows } from "./libs/couch.svelte";
  import type { Message } from "./libs/couch.svelte";
  import { tick } from "svelte";

  type Props = {
    channel: string;
    rows: Message[];
  };
  let { channel, rows }: Props = $props();
  let grouppedRows = $derived(groupRows(rows));

  const footer = document.querySelector("footer");

  $effect.pre(() => {
    grouppedRows;
    // autoscroll only if the footer is visible
    const footerTop = footer?.offsetTop ?? document.body.scrollHeight;
    const do_scroll = window.scrollY + window.innerHeight >= footerTop;

    const prevHeight = document.body.scrollHeight;
    //console.log("$effect.pre", do_scroll, prevHeight, window.scrollY, window.innerHeight, footer?.offsetTop);
    if (do_scroll) {
      tick().then(() => {
        let scrollDiff = document.body.scrollHeight - prevHeight;
        window.scrollBy({ behavior: "smooth", top: scrollDiff });
        //console.log("scrollDiff", scrollDiff);
      });
    }
  });

  function embed(node: HTMLSpanElement, nodes: Node[]) {
    node.replaceChildren(...nodes);
  }
</script>

<table>
  {#each [...grouppedRows.keys()] as group}
    <tbody>
      <tr>
        <th colspan="2" class="group">
          <a class="permalink" href="#/{channel}/{group}" id={group}>{group}</a>
        </th>
      </tr>
      {#each grouppedRows.get(group) ?? [] as msg (msg._id)}
        <tr>
          <td>
            <span class="nick" style:background-color={colorize(msg.sender)}>{msg.sender}</span>
            <span class="message-text" use:embed={msg.html}></span>
          </td>
          <td class="timestamp">
            <a class="permalink" href="#/{channel}/{msg.slug}" id={msg.slug}>{msg.time}</a>
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
  :global(.message-text a) {
    white-space: nowrap;
    max-width: calc(65vw);
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    vertical-align: middle;
    font-size: smaller;
    color: #227;
  }
  :global(.message-text code) {
    background-color: #f0f0f0;
    font-size: smaller;
  }
</style>
