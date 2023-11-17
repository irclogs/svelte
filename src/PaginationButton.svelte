<script lang="ts">
  export let onClick: (ev: Event) => Promise<void>;
  let disabled = false;

  async function handleClick(ev: Event) {
    disabled = true;
    await onClick(ev);
    disabled = false;
  }
</script>

<div class={$$props.class}>
  <button on:click|stopPropagation={handleClick} {disabled} class:disabled>
    <slot />
  </button>
</div>

<style>
  div {
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
    margin-top: 1.2rem;
  }

  button {
    color: black;
    line-height: 1.3;
    margin: 0;
    padding: 10px 16px;
    background-color: #f2f2f2;
    border: 1px solid #8181a8;
    border-radius: 6px;
    outline: none;
  }
  button:hover {
    color: #555;
    background-color: #e0e0e0;
  }
  button.disabled {
    color: #555;
    background-color: #e0e0e0;
    animation: glowing 5000ms infinite;
  }

  @keyframes glowing {
    0% {
      box-shadow: 0 0 0 #0068ad;
    }
    50% {
      box-shadow: 0 0 30px #0068ad;
    }
    100% {
      box-shadow: 0 0 0 #0068ad;
    }
  }
</style>
