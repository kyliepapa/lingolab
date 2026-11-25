const STORAGE_KEY = 'lingolab-language';
const API_BASE =
  typeof window !== 'undefined' && window.location?.protocol?.startsWith('http')
    ? (window.location.port === '5000' ? window.location.origin : 'http://127.0.0.1:5000')
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
  try {
    const response = await fetch(`${API_BASE}/api/language`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Sync failed (${response.status})`);
    return response.json();
  } catch (error) {
    console.info('Language server unavailable; continuing with local storage.', error);
    return { ok: true, localOnly: true };
  }
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
  try {
    const response = await fetch(`${API_BASE}/api/sentences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) throw new Error(`Could not load sentences (${response.status})`);
    return response.json();
  } catch (error) {
    console.info('Using local sentence preview because the language server is unavailable.', error);
    return buildLocalSentencePackage(payload);
  }
}

function buildLocalSentencePackage(payload) {
  const words = { ...emptyLanguage().words, ...(payload.words || {}) };
  const word = (key) => words[key] || key;
  const userName = payload.user_name || '____';
  const plural = (value) => `${value}${payload.pluralizer?.[1] || 's'}`;
  const article = (value, type) => payload.has_articles === false ? value : `${payload.articles?.[type] || ''} ${value}`.trim();
  const translations = {
    intro: `${word('hello')} ${word('my')} ${word('name')} ${word('is')} ${userName}. ${word('what')} ${word('is')} ${word('your')} ${word('name')}?`,
    dancing_yes: `${word('I')} ${word('want')} ${word('dance')}.`,
    dancing_no: `${word('I')} ${word('want')} ${word('dance')}.`,
    turtle_I: `${word('I')} ${word('like')} ${word('blue')} ${plural(word('turtle'))}.`,
    turtle_you: `${word('you')} ${word('like')} ${word('tiny')} ${plural(word('turtle'))}.`,
    turtle_she: `${word('she')} ${word('like')} ${word('fast')} ${plural(word('turtle'))}.`,
    turtle_he: `${word('he')} ${word('like')} ${word('blue')} ${plural(word('turtle'))}.`,
    turtle_they: `${word('they')} ${word('like')} ${word('tiny')} ${plural(word('turtle'))}.`,
    turtle_we: `${word('we')} ${word('like')} ${word('fast')} ${plural(word('turtle'))}.`,
    apple_past: `${word('I')} ${word('eat')} ${article(word('apple'), 'indefinite')}.`,
    apple_present: `${word('I')} ${word('eat')} ${article(word('apple'), 'indefinite')}.`,
    apple_future: `${word('I')} ${word('eat')} ${article(word('apple'), 'indefinite')}.`,
    the_carrot: `${word('I')} ${word('enjoy')} ${article(word('carrot'), 'definite')}.`,
    the_carrots: `${word('I')} ${word('enjoy')} ${article(plural(word('carrot')), 'definite')}.`,
    a_carrot: `${word('I')} ${word('enjoy')} ${article(word('carrot'), 'indefinite')}.`,
    carrots: `${word('I')} ${word('enjoy')} ${plural(word('carrot'))}.`,
    advanced_she_no: `${word('she')} ${word('like')} ${word('tiny')} ${plural(word('turtle'))}.`,
    advanced_they_future: `${word('they')} ${word('eat')} ${article(plural(word('apple')), 'definite')}.`,
    advanced_we_no: `${word('we')} ${word('enjoy')} ${plural(word('carrot'))}.`,
  };
  return {
    english: {
      intro: "Hello! My name is ____. What's your name?",
      dancing_yes: 'I want to dance.', dancing_no: "I don't want to dance.",
      turtle_I: 'I like blue turtles.', turtle_you: 'You like tiny turtles.', turtle_she: 'She likes fast turtles.', turtle_he: 'He likes blue turtles.', turtle_they: 'They like tiny turtles.', turtle_we: 'We like fast turtles.',
      apple_past: 'I ate an apple.', apple_present: 'I eat an apple.', apple_future: 'I will eat an apple.',
      the_carrot: 'I enjoyed the carrot.', the_carrots: 'I enjoyed the carrots.', a_carrot: 'I enjoyed a carrot.', carrots: 'I enjoyed carrots.',
      advanced_she_no: "She doesn't like tiny turtles.", advanced_they_future: 'They will eat the apples.', advanced_we_no: 'We did not enjoy carrots.',
    },
    translations,
    groups: { dancing: ['dancing_yes', 'dancing_no'], turtle: ['turtle_I', 'turtle_you', 'turtle_she', 'turtle_he', 'turtle_they', 'turtle_we'], apple: ['apple_past', 'apple_present', 'apple_future'], carrot: ['the_carrot', 'the_carrots', 'a_carrot', 'carrots'], advanced: ['advanced_she_no', 'advanced_they_future', 'advanced_we_no'] },
  };
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
