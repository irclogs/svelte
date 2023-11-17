<header>
  <h1><slot /></h1>
</header>

<style>
  header {
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.3);
    color: #444444;
    padding: 1em 0;
  }
  header h1 {
    margin: 0;
  }
  header :global(h1 a) {
    color: inherit;
    text-decoration: none;
  }
  header :global(h1 a:hover) {
    color: #777777;
    text-decoration: underline;
  }
</style>
