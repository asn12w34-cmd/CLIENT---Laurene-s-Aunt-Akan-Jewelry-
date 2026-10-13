/*
CUSTOM FILE [AJ-004] — Idempotent next-section scrolling for the AKAN Hero cue
*/

(() => {
  const listenerKey = 'aknScrollCueBound';

  if (document.documentElement.dataset[listenerKey] === 'true') return;
  document.documentElement.dataset[listenerKey] = 'true';

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const trigger = target.closest('[data-akn-scroll-trigger]');
    if (!(trigger instanceof HTMLButtonElement)) return;

    const heroSection = trigger.closest('.shopify-section');
    if (!(heroSection instanceof HTMLElement)) return;

    const nextSection = heroSection.nextElementSibling;
    if (!(nextSection instanceof HTMLElement)) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    nextSection.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  });
})();
