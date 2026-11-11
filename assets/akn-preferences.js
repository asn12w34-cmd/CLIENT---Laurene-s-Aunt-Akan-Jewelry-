/*
  CUSTOM FILE [AJ-044] — Persist the FCFA display preference and close language disclosures | See CUSTOM_CHANGES.md — AJ-044
  Estimates remain server-rendered by snippets/akn-fcfa.liquid (not recalculated here).
*/
(() => {
  const storageKey = 'akn-fcfa-visible-v1';
  const root = document.documentElement;
  let visible = true;
  try { visible = window.localStorage.getItem(storageKey) !== 'off'; } catch { /* Storage may be unavailable. */ }
  root.dataset.aknFcfaVisible = String(visible);

  function syncControls() {
    document.querySelectorAll('[data-akn-fcfa-toggle]').forEach((button) => {
      button.setAttribute('aria-pressed', String(visible));
      const status = button.querySelector('[data-akn-fcfa-status]');
      if (status) status.textContent = visible ? button.dataset.stateOn : button.dataset.stateOff;
    });
  }

  function closeDisclosures(except = null) {
    document.querySelectorAll('details[data-akn-language-selector][open]').forEach((details) => {
      if (details !== except) details.open = false;
    });
  }

  document.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const toggle = target.closest('[data-akn-fcfa-toggle]');
    if (toggle) {
      visible = !visible;
      root.dataset.aknFcfaVisible = String(visible);
      try { window.localStorage.setItem(storageKey, visible ? 'on' : 'off'); } catch { /* Session-only fallback. */ }
      syncControls();
    }
    const disclosure = target.closest('details[data-akn-language-selector]');
    closeDisclosures(disclosure);
  });

  // 'toggle' does not bubble; use capture to keep simultaneous dropdowns exclusive.
  document.addEventListener('toggle', (event) => {
    const target = event.target;
    if (target instanceof HTMLDetailsElement && target.matches('[data-akn-language-selector]') && target.open) {
      closeDisclosures(target);
    }
  }, true);

  let handledEscape = false;
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const opened = document.querySelector('details[data-akn-language-selector][open]');
    if (!(opened instanceof HTMLDetailsElement)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    closeDisclosures();
    opened.querySelector('summary')?.focus();
    // Prevent Atelier's drawer Escape keyup handler from closing the whole drawer.
    handledEscape = true;
  }, true);
  document.addEventListener('keyup', (event) => {
    if (handledEscape && event.key === 'Escape') {
      event.stopImmediatePropagation();
      handledEscape = false;
    }
  }, true);
  document.addEventListener('focusin', (event) => {
    const target = event.target;
    if (target instanceof Element) closeDisclosures(target.closest('details[data-akn-language-selector]'));
  });
  document.addEventListener('shopify:section:load', syncControls);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncControls, { once: true });
  else syncControls();
})();
