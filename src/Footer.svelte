<script>
  import { config } from "./libs/config";
  let online = $state(true);
</script>

<svelte:window bind:online />
<footer class:offline={!online}>
  <a href={config.homePage}>irclog home page</a> | ver:
  <abbr title={config.githubArchive}>{config.version}</abbr>
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
  }
  footer.offline {
    border-top: 2px solid red;
  }
</style>
