<script lang="ts">
  import { online } from "svelte/reactivity/window";
  import { config } from "../libs/config";
  let popover: HTMLElement;
</script>

<footer class:offline={!online.current}>
  <a href={config.homePage}>irclog home page</a> | ver:
  <button title="Build Info" onclick={() => popover.showPopover()}>{config.version}</button>
  <div id="build-info" popover="auto" bind:this={popover}>
    Artefact: <a href={config.githubArchive}>{config.githubArchive}</a><br />
    Project: <a href={config.projectUrl}>{config.projectUrl}</a>
  </div>
</footer>

<style>
  footer {
    padding: 8px 6px 10px;
    background-color: #efefef;
    border-top: 1px dashed #aaaaaa;
    color: #555555;
    margin-top: 1rem;
  }

  footer a {
    text-decoration: none;
    color: #555555;
    &:hover {
      text-decoration: underline;
    }
  }

  footer button {
    all: unset;
    anchor-name: --build-info-btn;
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }

  footer #build-info {
    position: fixed;
    position-anchor: --build-info-btn;
    bottom: anchor(--build-info-btn top);
    left: anchor(--build-info-btn left);
    top: unset;
    margin: 0 0 2em 5em;
    border-width: 1px;
  }

  footer.offline {
    border-top: 2px solid red;
  }
</style>
