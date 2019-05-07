<script>
  import { version } from '../package.json';
  let online;
</script>

<style>
  footer {
    padding: 8px 6px 10px;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: #efefef;
    border-top: 1px dashed #aaaaaa;
    color: #555555;
  }
  footer a {
    text-decoration: none;
    color: #555555;
  }
  footer.red {
      background-color: red;
  }
</style>

<svelte:window bind:online={online}/>
<footer class={online ? '':'red'}>
  <a href="https://irc.softver.org.mk/">irclog home page</a> | ver: {version}
</footer>

