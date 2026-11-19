const STORAGE_KEY = 'lingolab-language';
const API_BASE =
  typeof window !== 'undefined' && window.location?.protocol?.startsWith('http')
    ? window.location.origin
    : 'http://127.0.0.1:5000';

const PERSON_TO_CONJ = {
  I: 'first_single',
  you: 'second_person',
  he: 'third_single_male',
  she: 'third_single_female',
  they: 'third_plural',
  we: 'first_plural',
};

function emptyLanguage() {
  return {
    words: {},
    sounds: [],
    sentence_order: 'SVO',
    adj_placement: 'before',
    tenses: {
      infinitive: ['default', 'default'],
      present: ['default', 'default'],
      past: ['default', 'default'],
      future: ['default', 'default'],
    },
    has_conjugations: true,
    conjugations: {},
    has_articles: true,
    articles: { definite: '', indefinite: '' },
    negation: ['before', ''],
    pluralizer: ['suffix', ''],
    question_order: 'wiyn',
    user_name: '',
  };
}

function readLanguage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyLanguage();
    return { ...emptyLanguage(), ...JSON.parse(raw), words: { ...emptyLanguage().words, ...(JSON.parse(raw).words || {}) } };
  } catch {
    return emptyLanguage();
  }
}

function writeLanguage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private-mode errors so UI scripts keep running */
  }
}

function patchLanguage(partial) {
  const current = readLanguage();
  const next = {
    ...current,
    ...partial,
    words: { ...current.words, ...(partial.words || {}) },
    tenses: { ...current.tenses, ...(partial.tenses || {}) },
    conjugations: { ...current.conjugations, ...(partial.conjugations || {}) },
    articles: { ...current.articles, ...(partial.articles || {}) },
  };
  writeLanguage(next);
  return next;
}

function setWord(concept, value) {
  return patchLanguage({ words: { [concept]: value } });
}

function vocabularyKeyFromInput(input) {
  if (!input?.dataset) return '';
  return (
    input.dataset.word ||
    input.dataset.adj ||
    input.dataset.verb ||
    input.dataset.pronoun ||
    ''
  );
}

/** Persist every vocabulary field on the current page (e.g. before continue / sync). */
function flushVocabularyInputs(root = document) {
  const words = {};
  root.querySelectorAll('input[data-word], input[data-adj], input[data-verb], input[data-pronoun]').forEach((input) => {
    const key = vocabularyKeyFromInput(input);
    if (key) words[key] = (input.value ?? '').trim();
  });
  if (!Object.keys(words).length) return readLanguage();
  return patchLanguage({ words });
}

function setTense(tenseKey, placement, marker) {
  const tenses = { ...readLanguage().tenses };
  const trimmed = (marker || '').trim();
  tenses[tenseKey] = trimmed ? [placement, trimmed] : ['default', 'default'];
  return patchLanguage({ tenses });
}

function setConjugation(person, placement, marker) {
  const key = PERSON_TO_CONJ[person] || person;
  const conjugations = { ...readLanguage().conjugations };
  const trimmed = (marker || '').trim();
  conjugations[key] = trimmed ? [placement, trimmed] : ['default', 'default'];
  return patchLanguage({ conjugations });
}

function getLanguagePayload() {
  const lang = readLanguage();
  const payload = { ...lang };
  if (payload.words.be && !payload.words.is) {
    payload.words.is = payload.words.be;
  }
  return payload;
}

async function syncToBackend() {
  const payload = getLanguagePayload();
  const response = await fetch(`${API_BASE}/api/language`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Sync failed (${response.status})`);
  }
  return response.json();
}

function normalizeAnswer(text) {
  return String(text || '')
    .trim()
    .toLowerCase()
    .replace(/[.!?]+$/, '')
    .replace(/\s+/g, ' ');
}

async function fetchSentencePackage() {
  const payload = getLanguagePayload();
  const response = await fetch(`${API_BASE}/api/sentences`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Could not load sentences (${response.status})`);
  }
  return response.json();
}

window.LingoLabStore = {
  STORAGE_KEY,
  API_BASE,
  PERSON_TO_CONJ,
  emptyLanguage,
  readLanguage,
  writeLanguage,
  patchLanguage,
  setWord,
  flushVocabularyInputs,
  setTense,
  setConjugation,
  getLanguagePayload,
  syncToBackend,
  normalizeAnswer,
  fetchSentencePackage,
};

window.dispatchEvent(new Event('lingolab:store-ready'));