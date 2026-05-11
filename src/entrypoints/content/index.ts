import { defineContentScript } from "#imports";
import { observeYouTubeNavigation } from "~/utils/events";
import { onKeyup } from "~/utils/keyboard";

import "./style.css";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  main(ctx) {
    const disconnect = observeYouTubeNavigation((pageType) => {
      if (ctx.isInvalid || pageType !== "watch") {
        return;
      }

      const controller = new AbortController();
      const signal = controller.signal;

      const prevent = () => {
        document.body.classList.remove("flexible-fullscreen");
      };
      document.addEventListener("fullscreenchange", prevent, { signal });

      const unsubscribe = onKeyup("`", () => {
        if (document.fullscreenElement) {
          return;
        }

        if (document.body.classList.contains("flexible-fullscreen")) {
          document.body.classList.remove("flexible-fullscreen");
        } else {
          document.body.classList.add("flexible-fullscreen");
        }
        window.dispatchEvent(new Event("resize"));
      });

      console.debug("YouTube Flexible Fullscreen: Enabled");

      return () => {
        controller.abort();
        unsubscribe();
        prevent();

        console.debug("YouTube Flexible Fullscreen: Disabled");
      };
    });

    ctx.onInvalidated(() => {
      console.debug("YouTube Flexible Fullscreen: Content script invalidated");
      disconnect();
    });
  },
});
