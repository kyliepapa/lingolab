(function () {
  const { readLanguage, PERSON_TO_CONJ } = window.LingoLabStore;

  const ORDER_LABELS = {
    SVO: 'SVO — Subject · Verb · Object',
    SOV: 'SOV — Subject · Object · Verb',
    VSO: 'VSO — Verb · Subject · Object',
    VOS: 'VOS — Verb · Object · Subject',
    OVS: 'OVS — Object · Verb · Subject',
    OSV: 'OSV — Object · Subject · Verb',
  };

  const QUESTION_LABELS = {
    wiyn: 'What · is · your · name?',
    wyni: 'What · your · name · is',
    yniw: 'Your · name · is · what',
    ynwi: 'Your · name · what · is',
  };

  const CONJ_TO_PERSON = Object.fromEntries(
    Object.entries(PERSON_TO_CONJ).map(([person, key]) => [key, person]),
  );

  const VOCAB_GROUPS = [
    { title: 'Core nouns', keys: ['name', 'apple', 'turtle', 'carrot'] },
    { title: 'Adjectives', keys: ['blue', 'tiny', 'fast'] },
    { title: 'Verbs', keys: ['be', 'want', 'like', 'dance', 'eat', 'enjoy'] },
    { title: 'Pronouns', keys: ['I', 'you', 'he', 'she', 'they', 'we'] },
    { title: 'Function words', keys: ['hello', 'what', 'my', 'your'] },
  ];

  function placementLabel(raw) {
    const key = String(raw || 'default').toLowerCase();
    const map = {
      prefix: 'prefix',
      suffix: 'suffix',
      after: 'separate word after',
      before: 'separate word before',
      default: 'base form only',
    };
    return map[key] || key;
  }

  function markerSummary(entry) {
    if (!entry || !Array.isArray(entry)) return 'base form only (no marker)';
    const [placementRaw, marker] = entry;
    const trimmed = (marker || '').trim();
    if (!trimmed || placementRaw === 'default') return 'base form only (no marker)';
    return `“${trimmed}” · ${placementLabel(placementRaw)}`;
  }

  function wordValue(words, key) {
    if (key === 'be') return words.be || words.is || '';
    return words[key] || '';
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function renderVocabulary(root, lang, compact) {
    const host = root.querySelector('#report-vocabulary');
    if (!host) return;

    const rows = [];
    VOCAB_GROUPS.forEach((group) => {
      group.keys.forEach((key) => {
        const val = wordValue(lang.words, key);
        if (!val && key !== 'be') return;
        const displayKey = key === 'be' ? 'be / is' : key;
        rows.push(
          `<div class="vocab-row"><span class="vocab-concept">${escapeHtml(displayKey)}</span><span class="vocab-arrow">→</span><span class="vocab-coinage">${escapeHtml(val || '—')}</span></div>`,
        );
      });
    });

    if (lang.has_articles) {
      const def = lang.articles?.definite || '';
      const indef = lang.articles?.indefinite || '';
      if (def) {
        rows.push(
          `<div class="vocab-row"><span class="vocab-concept">definite article</span><span class="vocab-arrow">→</span><span class="vocab-coinage">${escapeHtml(def)}</span></div>`,
        );
      }
      if (indef) {
        rows.push(
          `<div class="vocab-row"><span class="vocab-concept">indefinite article</span><span class="vocab-arrow">→</span><span class="vocab-coinage">${escapeHtml(indef)}</span></div>`,
        );
      }
    }

    host.innerHTML = rows.length
      ? rows.join('')
      : '<p class="report-muted">No vocabulary saved yet.</p>';
    host.classList.toggle('vocab-compact', Boolean(compact));
  }

  function renderGrammarCards(root, lang) {
    const orderEl = root.querySelector('#report-order');
    if (orderEl) {
      orderEl.textContent = ORDER_LABELS[lang.sentence_order] || ORDER_LABELS.SVO;
    }

    const adjEl = root.querySelector('#report-adjectives');
    if (adjEl) {
      const placement = lang.adj_placement || 'before';
      const adjWords = ['blue', 'tiny', 'fast']
        .map((k) => lang.words[k])
        .filter(Boolean)
        .join(', ');
      const placementText =
        placement === 'after' ? 'After the noun — flower pink' : 'Before the noun — pink flower';
      adjEl.textContent = adjWords ? `${placementText} · ${adjWords}` : placementText;
    }

    const tensesEl = root.querySelector('#report-tenses');
    if (tensesEl) {
      const lines = ['infinitive', 'present', 'past', 'future'].map(
        (key) => `${key}: ${markerSummary(lang.tenses?.[key])}`,
      );
      tensesEl.innerHTML = lines.map((line) => escapeHtml(line)).join('<br />');
    }

    const conjEl = root.querySelector('#report-conjugations');
    if (conjEl) {
      if (!lang.has_conjugations) {
        conjEl.textContent = 'Personal conjugations not used — one verb form for every subject.';
      } else {
        const lines = Object.entries(lang.conjugations || {}).map(([key, entry]) => {
          const person = CONJ_TO_PERSON[key] || key.replace(/_/g, ' ');
          return `${person}: ${markerSummary(entry)}`;
        });
        const pronouns = ['I', 'you', 'he', 'she', 'they', 'we']
          .map((p) => (lang.words[p] ? `${p}: ${lang.words[p]}` : null))
          .filter(Boolean);
        const bits = [];
        if (lines.length) bits.push(lines.join(' · '));
        if (pronouns.length) bits.push(`Pronouns — ${pronouns.join(' · ')}`);
        conjEl.textContent = bits.join(' ') || 'Conjugation markers not set yet.';
      }
    }

    const finishingEl = root.querySelector('#report-finishing');
    if (finishingEl) {
      const bits = [];
      bits.push(lang.has_articles ? 'Articles on' : 'Articles off');
      if (lang.words.hello) bits.push(`hello: ${lang.words.hello}`);
      if (lang.user_name) bits.push(`creator name: ${lang.user_name}`);
      bits.push(`question pattern: ${QUESTION_LABELS[lang.question_order] || lang.question_order}`);
      bits.push(`negation: ${markerSummary(lang.negation)}`);
      bits.push(`pluralizer: ${markerSummary(lang.pluralizer)}`);
      finishingEl.textContent = bits.join(' · ');
    }
  }

  function renderReport(root, options = {}) {
    const scope = root || document;
    const lang = readLanguage();
    const compact = options.variant === 'sidebar';
    scope.classList?.toggle('report-sidebar-mode', compact);
    renderVocabulary(scope, lang, compact);
    renderGrammarCards(scope, lang);
  }

  window.LingoLabReport = { renderReport };
})();