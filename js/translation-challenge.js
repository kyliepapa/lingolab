const get = (key) => (localStorage.getItem(key) || '').trim();
// Throws if the user never filled this in, so that sentence is skipped.
const req = (key) => {
  const value = get(key);
  if (!value) throw new Error(`Missing ${key}`);
  return value;
};

/* ---------- Building the correct translation from the user's language ---------- */
const kindOf = (value) => {
  const t = (value || '').toLowerCase();
  if (t.includes('prefix')) return 'prefix';
  if (t.includes('suffix')) return 'suffix';
  if (t.includes('after')) return 'after';
  return 'before';
};

function attach(base, marker, placement) {
  switch (kindOf(placement)) {
    case 'prefix': return marker + base;
    case 'suffix': return base + marker;
    case 'after': return `${base} ${marker}`;
    default: return `${marker} ${base}`;
  }
}

function nounPhrase({ noun, adj, plural, article }) {
  let phrase = req(`lingolab-word-${noun}`);
  if (plural) phrase = attach(phrase, req('lingolab-finishing-field-8'), get('lingolab-finishing-field-9'));
  if (adj) {
    const adjective = req(`lingolab-adjective-${adj}`);
    phrase = get('lingolab-adjective-placement') === 'after' ? `${phrase} ${adjective}` : `${adjective} ${phrase}`;
  }
  if (article && get('lingolab-articles') !== 'no') phrase = `${req('lingolab-finishing-field-3')} ${phrase}`;
  return phrase;
}

// Returns every valid form of the verb (person marker and tense marker can combine in either order).
function verbForms(verbKey, person, tense) {
  const stem = req(`lingolab-verb-${verbKey}`);
  const steps = [];
  if (get('lingolab-personal-conjugations') !== 'no') {
    steps.push((b) => attach(b, req(`lingolab-personal-field-${person * 2}`), get(`lingolab-personal-field-${person * 2 + 1}`)));
  }
  if (tense) {
    steps.push((b) => attach(b, req(`lingolab-tense-${tense}-marker`), get(`lingolab-tense-${tense}-placement`)));
  }
  const orders = steps.length === 2 ? [[0, 1], [1, 0]] : [steps.map((_, i) => i)];
  return [...new Set(orders.map((order) => order.reduce((b, i) => steps[i](b), stem)))];
}

function build(s) {
  const subject = req(`lingolab-personal-field-${12 + s.person}`);
  const verbs = verbForms(s.verb, s.person, s.tense).map((v) =>
    s.neg ? attach(v, req('lingolab-finishing-field-6'), get('lingolab-finishing-field-7')) : v
  );
  const object = s.comp ? req(`lingolab-adjective-${s.comp}`) : s.noun ? nounPhrase(s) : '';
  const order = (get('lingolab-sentence-order') || 'SVO').split('');
  return verbs.map((verb) => {
    const parts = { S: subject, V: verb, O: object };
    return order.map((letter) => parts[letter]).filter(Boolean).join(' ');
  });
}

/* person: 0 I, 1 you, 2 he, 3 she, 4 they, 5 we */
const sentences = [
  { en: 'I eat the apple.', person: 0, verb: 'eat', noun: 'apple', article: true },
  { en: 'You like the carrot.', person: 1, verb: 'like', noun: 'carrot', article: true },
  { en: 'She dances.', person: 3, verb: 'dance' },
  { en: 'We want the blue apple.', person: 5, verb: 'want', noun: 'apple', adj: 'blue', article: true },
  { en: 'He is fast.', person: 2, verb: 'be', comp: 'fast' },
  { en: 'They ate the carrot.', person: 4, verb: 'eat', noun: 'carrot', article: true, tense: 'past' },
  { en: 'I do not like the turtle.', person: 0, verb: 'like', noun: 'turtle', article: true, neg: true },
  { en: 'We eat the apples.', person: 5, verb: 'eat', noun: 'apple', article: true, plural: true },
  { en: 'She wants the tiny turtle.', person: 3, verb: 'want', noun: 'turtle', adj: 'tiny', article: true },
  { en: 'You enjoy the carrot.', person: 1, verb: 'enjoy', noun: 'carrot', article: true },
  { en: 'He did not dance.', person: 2, verb: 'dance', tense: 'past', neg: true },
];

const challenges = sentences.flatMap((s) => {
  try { return [{ en: s.en, answers: build(s) }]; } catch (error) { return []; }
});

/* ---------- Page behavior ---------- */
const englishBox = document.querySelector('#english-sentence');
const input = document.querySelector('#translation-input');
const feedback = document.querySelector('#feedback');
const submitBtn = document.querySelector('#submit-btn');
const retryBtn = document.querySelector('#retry-btn');
let current = null;
let answered = false;

const normalize = (text) => text.normalize('NFC').toLowerCase().replace(/[.,!?;:"“”¿¡]/g, ' ').replace(/\s+/g, ' ').trim();

function showFeedback(kind, ...content) {
  feedback.className = `tc-feedback ${kind}`;
  feedback.replaceChildren(...content);
  feedback.hidden = false;
}

function newChallenge() {
  answered = false;
  feedback.hidden = true;
  input.value = '';

  if (!challenges.length) {
    englishBox.value = '';
    englishBox.placeholder = 'No sentences available yet';
    input.disabled = true;
    submitBtn.disabled = true;
    retryBtn.disabled = true;
    showFeedback('warn', 'Your language needs a few more words before the challenge can start. Finish every step of creating your language, then come back.');
    return;
  }

  const pool = challenges.filter((c) => c !== current);
  const options = pool.length ? pool : challenges;
  current = options[Math.floor(Math.random() * options.length)];
  englishBox.value = current.en;
  input.disabled = false;
  submitBtn.disabled = false;
  input.focus();
}

function submit() {
  if (!current || answered) return;
  const typed = input.value.trim();
  if (!typed) {
    showFeedback('warn', 'Type your translation first, then press Submit.');
    input.focus();
    return;
  }
  answered = true;
  submitBtn.disabled = true;
  input.disabled = true;

  if (current.answers.some((answer) => normalize(answer) === normalize(typed))) {
    showFeedback('good', 'Good job!');
  } else {
    const correct = document.createElement('strong');
    correct.textContent = current.answers[0];
    showFeedback('bad', 'Nice try! Here is the correct translation: ', correct);
  }
}

submitBtn.addEventListener('click', submit);
retryBtn.addEventListener('click', newChallenge);
input.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') submit();
});

newChallenge();