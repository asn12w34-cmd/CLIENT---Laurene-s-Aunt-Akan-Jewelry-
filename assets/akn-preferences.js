/*
  CUSTOM FILE [AJ-044] — Shared localization disclosure and visitor-preference behavior | See CUSTOM_CHANGES.md — AJ-044
*/
/* CUSTOM [AJ-045] — Coordinate independent market/language disclosures; legacy FCFA toggle behavior retired | See CUSTOM_CHANGES.md — AJ-045 */
(() => {
  const selector = 'details[data-akn-localization-selector], details[data-akn-language-selector]';
  const openSelector = 'details[data-akn-localization-selector][open], details[data-akn-language-selector][open]';

  function closeOtherDisclosures(except = null) {
    document.querySelectorAll(openSelector).forEach((details) => {
      if (details !== except) details.open = false;
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const disclosure = target.closest(selector);
    closeOtherDisclosures(disclosure);
  });

  // toggle does not bubble; capture it so a market and language menu cannot remain open together.
  document.addEventListener('toggle', (event) => {
    const target = event.target;
    if (target instanceof HTMLDetailsElement && target.matches(selector) && target.open) {
      closeOtherDisclosures(target);
    }
  }, true);

  let handledDrawerEscape = false;
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const opened = document.querySelector(openSelector);
    if (!(opened instanceof HTMLDetailsElement)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    closeOtherDisclosures();
    opened.querySelector('summary')?.focus();
    // Prevent Atelier's keyup listener from closing the entire mobile drawer as well.
    handledDrawerEscape = true;
  }, true);
  document.addEventListener('keyup', (event) => {
    if (handledDrawerEscape && event.key === 'Escape') {
      event.stopImmediatePropagation();
      handledDrawerEscape = false;
    }
  }, true);
  document.addEventListener('focusin', (event) => {
    const target = event.target;
    if (target instanceof Element) closeOtherDisclosures(target.closest(selector));
  });
})();
