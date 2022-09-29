<script>
  import { version } from "../package.json";
  let online;
</script>

<svelte:window bind:online />
<footer class:offline={!online}>
  <a class="infolink" href="#" />
  <a href="https://irc.softver.org.mk/">irclog home page</a> | ver:
  <abbr title={import.meta.env.VITE_GITHUB_ARCHIVE_URL}>{version}</abbr>
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
  .infolink:before {
    content: "?";
    display: inline-block;
    font-family: sans-serif;
    font-weight: bold;
    text-align: center;
    width: 1.8ex;
    height: 1.8ex;
    font-size: 1.4ex;
    line-height: 1.8ex;
    border-radius: 1.2ex;
    margin-right: 4px;
    padding: 1px;
    color: blue;
    background: white;
    border: 1px solid blue;
    text-decoration: none;
  }

  .infolink:hover:before {
    color: white;
    background: blue;
    border-color: white;
    text-decoration: none;
  }

  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 100%;
  }
  .green {
    background-color: rgb(34, 200, 162);
  }
  .red {
    background-color: rgb(200, 34, 34);
  }
</style>
