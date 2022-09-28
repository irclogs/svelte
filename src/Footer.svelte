<script>
  import { version } from "../package.json";
  let online;
</script>

<svelte:window bind:online />
<footer class:offline={!online}>
  <a href="https://irc.softver.org.mk/">irclog home page</a> |
  ver: <abbr title="{import.meta.env.VITE_GITHUB_ARCHIVE_URL}">{version}</abbr>
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
