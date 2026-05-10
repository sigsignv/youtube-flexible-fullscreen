import { defineContentScript } from "#imports";
import { observeYouTubeNavigation } from "~/utils/events";

export default defineContentScript({
  matches: ["https://www.youtube.com/*"],
  runAt: "document_start",
  allFrames: false,

  main(ctx) {
    const disconnect = observeYouTubeNavigation((pageType) => {
      if (ctx.isInvalid || pageType !== "watch") {
        return;
      }

      console.log("on watch page");
    });

    ctx.onInvalidated(disconnect);
  },
});
