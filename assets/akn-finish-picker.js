/*
CUSTOM FILE [AJ-020] — Accessible AKAN finish disclosure behaviour
*/

class AknFinishDisclosure extends HTMLElement {
  /** @type {AbortController | undefined} */
  #abortController;

  /** @type {HTMLDetailsElement | null} */
  #details = null;

  /** @type {HTMLElement | null} */
  #summary = null;

  connectedCallback() {
    this.#abortController?.abort();
    this.#abortController = new AbortController();

    this.#details = this.querySelector('details');
    this.#summary = this.#details?.querySelector('summary') ?? null;

    if (!this.#details || !this.#summary) return;

    const { signal } = this.#abortController;
    this.#details.addEventListener('toggle', this.#handleToggle, { signal });
    this.addEventListener('click', this.#handleChoiceClick, { signal });
    this.addEventListener('change', this.#handleChange, { signal });
    this.addEventListener('keydown', this.#handleKeydown, { signal });
    document.addEventListener('pointerdown', this.#handleOutsidePointerDown, { signal });
  }

  disconnectedCallback() {
    this.#abortController?.abort();
  }

  #handleToggle = () => {
    if (!this.#details?.open) return;

    for (const disclosure of document.querySelectorAll('akn-finish-disclosure')) {
      if (disclosure === this) continue;

      const openDetails = disclosure.querySelector('details[open]');
      if (openDetails instanceof HTMLDetailsElement) openDetails.open = false;
    }

    requestAnimationFrame(() => {
      const selectedChoice = this.querySelector('.akn-finish-picker__choice:has(input:checked)');
      selectedChoice?.scrollIntoView({ block: 'nearest' });
    });
  };

  /**
   * Closes the menu when the already-selected choice is activated again.
   * A newly selected radio is handled by the subsequent change event.
   * @param {MouseEvent} event
   */
  #handleChoiceClick = (event) => {
    if (!(event.target instanceof Element)) return;

    const choice = event.target.closest('.akn-finish-picker__choice');
    const input = choice?.querySelector('input[type="radio"]');

    if (input instanceof HTMLInputElement && input.checked) this.#close(true);
  };

  /**
   * @param {Event} event
   */
  #handleChange = (event) => {
    if (!(event.target instanceof HTMLInputElement) || event.target.type !== 'radio') return;

    const selectedChoice = event.target.closest('.akn-finish-picker__choice');
    const selectedSwatch = selectedChoice?.querySelector('.swatch');
    const summarySwatch = this.#summary?.querySelector('.swatch');
    const summaryValue = this.#summary?.querySelector('.akn-finish-picker__value');

    if (summaryValue) summaryValue.textContent = event.target.value;
    if (this.#summary && selectedChoice instanceof HTMLElement) {
      this.#summary.dataset.finishName = selectedChoice.dataset.finishName ?? '';
    }
    if (selectedSwatch && summarySwatch) summarySwatch.replaceWith(selectedSwatch.cloneNode(true));

    this.#close(true);
  };

  /**
   * @param {KeyboardEvent} event
   */
  #handleKeydown = (event) => {
    if (event.key !== 'Escape' || !this.#details?.open) return;

    event.preventDefault();
    event.stopPropagation();
    this.#close(true);
  };

  /**
   * @param {PointerEvent} event
   */
  #handleOutsidePointerDown = (event) => {
    if (!this.#details?.open || !(event.target instanceof Node) || this.contains(event.target)) return;
    this.#close(false);
  };

  /**
   * @param {boolean} restoreFocus
   */
  #close(restoreFocus) {
    if (!this.#details?.open) return;

    this.#details.open = false;
    if (restoreFocus) this.#summary?.focus({ preventScroll: true });
  }
}

if (!customElements.get('akn-finish-disclosure')) {
  customElements.define('akn-finish-disclosure', AknFinishDisclosure);
}
