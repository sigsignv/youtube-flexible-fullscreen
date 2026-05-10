import * as v from "valibot";

declare global {
  interface DocumentEventMap {
    "yt-navigate-finish": CustomEvent<unknown>;
  }
}

const pageTypeSchema = v.object({
  pageType: v.string(),
});

type NavigationCallback = (pageType: string) => Teardown | undefined;

type Teardown = () => void;

type Unsubscribe = () => void;

export function observeYouTubeNavigation(
  callback: NavigationCallback,
): Unsubscribe {
  let teardown: Teardown | undefined;

  const runTeardown = () => {
    try {
      teardown?.();
    } catch (ex) {
      console.error(ex);
    } finally {
      teardown = undefined;
    }
  };

  const listener = (event: CustomEvent<unknown>) => {
    runTeardown();

    const parsed = v.safeParse(pageTypeSchema, event.detail);
    if (!parsed.success) {
      return;
    }

    try {
      teardown = callback(parsed.output.pageType);
    } catch (ex) {
      console.error(ex);
    }
  };
  document.addEventListener("yt-navigate-finish", listener);

  return () => {
    document.removeEventListener("yt-navigate-finish", listener);
    runTeardown();
  };
}
