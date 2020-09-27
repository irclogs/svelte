<script lang="ts">
  export let onClick: () => Promise<any>;
  let button: HTMLButtonElement;
  let disabled = false;

  async function handleClick() {
    disabled = true;
    await onClick();
    disabled = false;
  }
</script>

<style>
    div {
      width: 100%;
      text-align: center;
      margin-bottom: 0.5rem;
      margin-top: 1.2rem;
    }
</style>

<div class={$$props.class}>
    <button bind:this={button} on:click|stopPropagation={ handleClick } {disabled}><slot/></button>
</div>
