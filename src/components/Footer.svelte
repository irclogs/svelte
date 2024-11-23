<script lang="ts">
  import { config } from "../libs/config";
  let online = $state(true);
  let popover: HTMLElement;
</script>

<svelte:window bind:online />

<footer class:offline={!online}>
  <a href={config.homePage}>irclog home page</a> | ver:
  <button title="Build Info" onclick={() => popover.showPopover()}>{config.version}</button>
  <div id="build-info" popover="auto" bind:this={popover}>
    Artefact: {config.githubArchive}<br />
    Project: {config.projectUrl}
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
    margin: 0;
    border-width: 1px;
  }

  footer.offline {
    border-top: 2px solid red;
  }
</style>
