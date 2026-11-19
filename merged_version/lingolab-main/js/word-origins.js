(function () {
  function init() {
    const store = window.LingoLabStore;
    if (!store || document.body.dataset.wordOriginsBound === '1') return;
    document.body.dataset.wordOriginsBound = '1';

    const { readLanguage, setWord } = store;

    document.querySelectorAll('.word-builder-card input[data-word]').forEach((input) => {
      const concept = input.dataset.word;
      const saved = readLanguage().words[concept];
      if (saved) input.value = saved;

      input.addEventListener('input', () => setWord(concept, input.value.trim()));
      input.addEventListener('change', () => setWord(concept, input.value.trim()));
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