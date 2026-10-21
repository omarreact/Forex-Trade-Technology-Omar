import type { KeyboardEvent } from 'react';

/** Standard roving-focus behavior for the showroom's automatically activated tabs. */
export function handleTabListKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
  const tabs = Array.from(
    event.currentTarget.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? [],
  );
  const current = tabs.indexOf(event.currentTarget);
  if (!tabs.length || current < 0) return;

  let next = current;
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (current + 1) % tabs.length;
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (current - 1 + tabs.length) % tabs.length;
  else if (event.key === 'Home') next = 0;
  else if (event.key === 'End') next = tabs.length - 1;
  else return;

  event.preventDefault();
  tabs[next].focus();
  tabs[next].click();
}
