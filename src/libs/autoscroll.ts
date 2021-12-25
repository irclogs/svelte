import { beforeUpdate, afterUpdate } from "svelte";

/**
 * Initialize the autoscroller. Needs to be called in the context of a component because it'll
 * hook into the components beforeUpdate/afterUpdate.
 *
 * The autoscroll measures the document height before and after the update, and also the current
 * scroll position before the update. If the footer was visible before the update,
 * it will scroll that much after the update.
 *
 * There are a couple of assumptions here, one is the name of the 'footer' component,
 * and the other is that we scroll the whole document body.
 * These should probably be made configurable in the future.
 *
 * @export
 */
export function autoscroll_init() {
  let do_scroll = false;
  let prevHeight = document.body.scrollHeight;
  let footer = document.querySelector("footer");

  beforeUpdate(() => {
    // autoscroll only if the footer is visible
    let footerTop = footer?.offsetTop ?? document.body.scrollHeight;
    do_scroll = window.scrollY + window.innerHeight >= footerTop;

    prevHeight = document.body.scrollHeight;
  });

  afterUpdate(() => {
    if (do_scroll) {
      let scrollDiff = document.body.scrollHeight - prevHeight;
      window.scrollBy({ behavior: "smooth", top: scrollDiff });
    }
  });
}
