(function () {
  function init() {
    const store = window.LingoLabStore;
    if (!store || document.body.dataset.conjugationsBound === '1') return;
    document.body.dataset.conjugationsBound = '1';

    const { readLanguage, patchLanguage, setWord, setConjugation, PERSON_TO_CONJ } = store;

    const lang = readLanguage();
    const choiceInputs = document.querySelectorAll('input[name="conjugations"]');
    const builder = document.querySelector('#conjugation-builder');

    const hasConj = lang.has_conjugations !== false;
    choiceInputs.forEach((input) => {
      if ((input.value === 'yes') === hasConj) input.checked = true;
    });

    if (builder) builder.hidden = !hasConj;

    choiceInputs.forEach((input) => {
      input.addEventListener('change', () => {
        const yes = input.value === 'yes';
        if (builder) builder.hidden = !yes;
        patchLanguage({ has_conjugations: yes });
      });
    });

    function placementToUi(placement) {
      if (placement === 'before') return 'Separate word before';
      if (placement === 'after') return 'Separate word after';
      if (placement === 'prefix') return 'Prefix';
      if (placement === 'suffix') return 'Suffix';
      return 'Prefix';
    }

    document.querySelectorAll('[data-person][data-role="marker"]').forEach((input) => {
      const person = input.dataset.person;
      const key = PERSON_TO_CONJ[person];
      const row = lang.conjugations[key];
      if (row && row[1] && row[1] !== 'default') input.value = row[1];
      input.addEventListener('input', () => {
        const placementSelect = document.querySelector(`[data-person="${person}"][data-role="placement"]`);
        setConjugation(person, placementSelect?.value || 'Prefix', input.value);
      });
    });

    document.querySelectorAll('[data-person][data-role="placement"]').forEach((select) => {
      const person = select.dataset.person;
      const key = PERSON_TO_CONJ[person];
      const row = lang.conjugations[key];
      if (row && row[0] && row[0] !== 'default') select.value = placementToUi(row[0]);
      select.addEventListener('change', () => {
        const markerInput = document.querySelector(`[data-person="${person}"][data-role="marker"]`);
        setConjugation(person, select.value, markerInput?.value || '');
      });
    });

    document.querySelectorAll('[data-pronoun]').forEach((input) => {
      const concept = input.dataset.pronoun;
      const saved = lang.words[concept];
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