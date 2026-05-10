type Unsubscribe = () => void;

export function onKeyup(key: string, callback: () => void): Unsubscribe {
  const handler = (ev: KeyboardEvent) => {
    if (ev.key !== key || hasModifierKey(ev) || isEditingContext(ev)) {
      return;
    }
    callback();
  };
  document.addEventListener("keyup", handler);

  return () => {
    document.removeEventListener("keyup", handler);
  };
}

function hasModifierKey(ev: KeyboardEvent): boolean {
  return ev.ctrlKey || ev.altKey || ev.metaKey;
}

function isEditingContext(ev: KeyboardEvent): boolean {
  if (ev.isComposing) {
    return true;
  }

  const target = ev.target;
  return (
    target instanceof HTMLElement &&
    (target.matches("input, textarea") || target.isContentEditable)
  );
}
