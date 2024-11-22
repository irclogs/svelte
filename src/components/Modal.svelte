<script lang="ts">
  let visible = false;
  function showPopup() {
    visible = true;
    document.addEventListener("keydown", handleModalKeydown);
  }
  function hidePopup() {
    document.removeEventListener("keydown", handleModalKeydown);
    visible = false;
  }

  function handleGlobalKeydown(ev: KeyboardEvent) {
    // Do nothing if the event was already processed
    if (ev.defaultPrevented) return;
    if (ev.key === "/") {
      ev.preventDefault();
      showPopup();
    }
  }

  function handleCloseKeydown(ev: KeyboardEvent) {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      hidePopup();
    }
  }

  function handleModalKeydown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
      ev.preventDefault();
      hidePopup();
    }
    if (ev.key === "Tab") {
      const focusableElements =
        document
          .getElementById("modal-container")
          ?.querySelectorAll<HTMLElement>('input, textarea, button, [aria-label="Close"]') ?? [];
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (!ev.shiftKey && document.activeElement === lastElement) {
        ev.preventDefault();
        firstElement.focus();
      } else if (ev.shiftKey && document.activeElement === firstElement) {
        ev.preventDefault();
        lastElement.focus();
      }
    }
  }
</script>

<svelte:document on:keydown={handleGlobalKeydown} />
{#if visible}
  <div id="modal-container" class="overlay" tabindex="-1">
    <div class="modal-dialog" aria-modal="true" role="dialog">
      <!--slot /-->
      <h2>Search:</h2>
      <input />
      <p>Some text in the Modal..</p>
      <span aria-label="Close" role="button" tabindex="0" on:click={hidePopup} on:keydown={handleCloseKeydown}
        >&times;</span
      >
    </div>
  </div>
{/if}

<style>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(139, 139, 139, 0.462);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }

  .modal-dialog {
    background-color: #fff;
    width: 400px;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    position: relative;
  }

  [aria-label="Close"] {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  }
  [aria-label="Close"]:focus-visible {
    outline: none;
  }
</style>
