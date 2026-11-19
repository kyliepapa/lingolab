(function () {
  function init() {
    const store = window.LingoLabStore;
    if (!store || document.body.dataset.finishingBound === '1') return;
    document.body.dataset.finishingBound = '1';

    const { readLanguage, patchLanguage, setWord } = store;
    const lang = readLanguage();

    document.querySelectorAll('input[name="articles"]').forEach((input) => {
      if ((input.value === 'yes') === lang.has_articles) input.checked = true;
      input.addEventListener('change', () => {
        const yes = input.value === 'yes';
        document.querySelector('#article-inputs').hidden = !yes;
        patchLanguage({ has_articles: yes });
      });
    });
    document.querySelector('#article-inputs').hidden = !lang.has_articles;

    function negationPlacementFromUi(optionText) {
      return optionText.startsWith('After') ? 'after' : 'before';
    }

    function pluralPlacementFromUi(optionText) {
      const map = {
        'Word before': 'before',
        Prefix: 'prefix',
        Suffix: 'suffix',
        'Word after': 'after',
      };
      return map[optionText] || 'suffix';
    }

    const articleDefinite = document.querySelector('[data-article="definite"]');
    const articleIndefinite = document.querySelector('[data-article="indefinite"]');
    if (articleDefinite && lang.articles.definite) articleDefinite.value = lang.articles.definite;
    if (articleIndefinite && lang.articles.indefinite) articleIndefinite.value = lang.articles.indefinite;

    articleDefinite?.addEventListener('input', () => {
      patchLanguage({ articles: { ...readLanguage().articles, definite: articleDefinite.value.trim() } });
    });
    articleIndefinite?.addEventListener('input', () => {
      patchLanguage({ articles: { ...readLanguage().articles, indefinite: articleIndefinite.value.trim() } });
    });

    document.querySelectorAll('.finishing-main [data-word]').forEach((input) => {
      const concept = input.dataset.word;
      const saved = lang.words[concept];
      if (saved) input.value = saved;
      input.addEventListener('input', () => setWord(concept, input.value.trim()));
    });

    const userNameInput = document.querySelector('[data-user-name]');
    if (userNameInput) {
      if (lang.user_name) userNameInput.value = lang.user_name;
      userNameInput.addEventListener('input', () => patchLanguage({ user_name: userNameInput.value.trim() }));
    }

    const questionSelect = document.querySelector('[data-question-order]');
    if (questionSelect && lang.question_order) questionSelect.value = lang.question_order;
    questionSelect?.addEventListener('change', () => patchLanguage({ question_order: questionSelect.value }));

    const negMarker = document.querySelector('[data-negation="marker"]');
    const negPlacement = document.querySelector('[data-negation="placement"]');
    if (negMarker && lang.negation[1]) negMarker.value = lang.negation[1];
    if (negPlacement && lang.negation[0]) {
      negPlacement.value = lang.negation[0] === 'after' ? 'After the verb — wait not' : 'Before the verb — not wait';
    }
    negMarker?.addEventListener('input', () => {
      const placement = negationPlacementFromUi(negPlacement?.value || '');
      patchLanguage({ negation: [placement, negMarker.value.trim()] });
    });
    negPlacement?.addEventListener('change', () => {
      patchLanguage({ negation: [negationPlacementFromUi(negPlacement.value), negMarker?.value.trim() || ''] });
    });

    const pluralMarker = document.querySelector('[data-pluralizer="marker"]');
    const pluralPlacement = document.querySelector('[data-pluralizer="placement"]');
    if (pluralMarker && lang.pluralizer[1]) pluralMarker.value = lang.pluralizer[1];
    if (pluralPlacement && lang.pluralizer[0]) {
      const labels = { before: 'Word before', prefix: 'Prefix', suffix: 'Suffix', after: 'Word after' };
      pluralPlacement.value = labels[lang.pluralizer[0]] || 'Suffix';
    }
    pluralMarker?.addEventListener('input', () => {
      const placement = pluralPlacementFromUi(pluralPlacement?.value || '');
      patchLanguage({ pluralizer: [placement, pluralMarker.value.trim()] });
    });
    pluralPlacement?.addEventListener('change', () => {
      patchLanguage({ pluralizer: [pluralPlacementFromUi(pluralPlacement.value), pluralMarker?.value.trim() || ''] });
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