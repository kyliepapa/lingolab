(function () {
  function init() {
    const store = window.LingoLabStore;
    if (!store || document.body.dataset.tensesBound === '1') return;
    document.body.dataset.tensesBound = '1';

    const { readLanguage, setWord, setTense } = store;

    const markerInputs = document.querySelectorAll('.marker-input');
    const markerSelects = document.querySelectorAll('.marker-row select');
    const verbInputs = document.querySelectorAll('.verb-vocabulary-card input[data-verb]');
    const lang = readLanguage();

    markerInputs.forEach((input) => {
      const tense = input.dataset.tense;
      const row = lang.tenses[tense];
      if (row && row[0] !== 'default') input.value = row[1] || '';
    });
    markerSelects.forEach((select) => {
      const tense = select.dataset.tense;
      const row = lang.tenses[tense];
      if (row && row[0] !== 'default') {
        const ui = row[0] === 'before' ? 'separate-before' : row[0] === 'after' ? 'separate-after' : row[0];
        select.value = ui;
      }
    });
    verbInputs.forEach((input) => {
      const verb = input.dataset.verb;
      const saved = lang.words[verb];
      if (saved) input.value = saved;
    });

    markerInputs.forEach((input) => {
      input.addEventListener('input', () => {
        const tense = input.dataset.tense;
        const select = input.closest('.marker-row')?.querySelector('select[data-tense]');
        const placement = select?.value || 'separate-before';
        setTense(tense, placement, input.value);
      });
    });

    markerSelects.forEach((select) => {
      select.addEventListener('change', () => {
        const tense = select.dataset.tense;
        const input = select.closest('.marker-row')?.querySelector('.marker-input[data-tense]');
        setTense(tense, select.value, input?.value || '');
      });
    });

    verbInputs.forEach((input) => {
      input.addEventListener('input', () => setWord(input.dataset.verb, input.value.trim()));
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