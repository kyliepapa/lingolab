(function () {
  function init() {
    const store = window.LingoLabStore;
    if (!store) return;

    const { readLanguage, patchLanguage, setWord } = store;

    const examples = {
      SVO: 'I eat rice.',
      SOV: 'I rice eat.',
      VSO: 'Eat I rice.',
      VOS: 'Eat rice I.',
      OVS: 'Rice eat I.',
      OSV: 'Rice I eat.',
    };

    const orderSelect = document.querySelector('#sentence-order-select');
    const preview = document.querySelector('#sentence-preview');
    if (!orderSelect || orderSelect.dataset.orderBound === '1') return;

    orderSelect.dataset.orderBound = '1';

    const validOrders = Object.keys(examples);

    function normalizeOrder(order) {
      if (!order) return '';
      const key = String(order).trim().toUpperCase();
      return validOrders.includes(key) ? key : '';
    }

    function updatePreview(order) {
      const normalized = normalizeOrder(order);
      if (!normalized || !preview) return;
      preview.textContent = examples[normalized];
    }

    function applyOrder(order, { persist } = { persist: false }) {
      const normalized = normalizeOrder(order);
      if (!normalized) return '';
      orderSelect.value = normalized;
      updatePreview(normalized);
      if (persist) {
        try {
          patchLanguage({ sentence_order: normalized });
        } catch (_) {
          /* preview still works if storage is unavailable */
        }
      }
      return normalized;
    }

    const lang = readLanguage();
    const saved = normalizeOrder(lang.sentence_order);
    applyOrder(saved || 'SVO', { persist: !saved });

    orderSelect.addEventListener('change', () => {
      applyOrder(orderSelect.value, { persist: true });
    });

    const placementValue = lang.adj_placement || 'before';
    document.querySelectorAll('input[name="placement"]').forEach((option) => {
      if (option.value === placementValue) {
        option.checked = true;
        option.closest('.placement-option')?.classList.add('selected');
      }
    });

    document.querySelectorAll('input[name="placement"]').forEach((option) => {
      option.addEventListener('change', () => {
        document.querySelectorAll('.placement-option').forEach((item) => item.classList.remove('selected'));
        option.closest('.placement-option')?.classList.add('selected');
        patchLanguage({ adj_placement: option.value });
      });
    });

    document.querySelectorAll('[data-adj]').forEach((input) => {
      const concept = input.dataset.adj;
      const savedWord = lang.words[concept];
      if (savedWord) input.value = savedWord;
      input.addEventListener('input', () => setWord(concept, input.value.trim()));
    });

    document.querySelector('#save-order')?.addEventListener('click', () => {
      const placement = document.querySelector('input[name="placement"]:checked');
      if (placement) patchLanguage({ adj_placement: placement.value });
      if (orderSelect.value) patchLanguage({ sentence_order: normalizeOrder(orderSelect.value) || orderSelect.value });
    });
  }

  function boot() {
    init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  window.addEventListener('lingolab:store-ready', boot, { once: true });
})();