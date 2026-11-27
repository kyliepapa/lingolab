const POS_LABELS = {
  pronoun: 'Pronoun',
  verb: 'Verb',
  noun: 'Noun',
  preposition: 'Preposition',
  determiner: 'Determiner',
  conjunction: 'Conjunction',
};

// Each word: [text, part of speech, English meaning]
const translations = {
  classes: {
    french: [['Quels', 'determiner', 'what'], ['cours', 'noun', 'classes'], ['suis-tu', 'verb', 'are you taking'], ['le semestre prochain ?', 'noun', 'the semester next']],
    'haitian-creole': [['Ki', 'determiner', 'what'], ['klas', 'noun', 'classes'], ['ou', 'pronoun', 'you'], ['ap pran', 'verb', 'are taking'], ['semès pwochen an ?', 'noun', 'semester next the']],
    spanish: [['¿Qué', 'determiner', 'what'], ['clases', 'noun', 'classes'], ['tomas', 'verb', 'are you taking'], ['el próximo semestre?', 'noun', 'the next semester']],
    english: [['What', 'determiner', 'what'], ['classes', 'noun', 'classes'], ['are', 'verb', 'are'], ['you', 'pronoun', 'you'], ['taking', 'verb', 'taking'], ['next semester?', 'noun', 'next semester']],
    asl: [['NEXT SEMESTER', 'noun', 'next semester'], ['YOU', 'pronoun', 'you'], ['TAKE', 'verb', 'are taking'], ['CLASS', 'noun', 'classes'], ['WHAT?', 'determiner', 'what']],
    albanian: [['Cilat', 'determiner', 'which'], ['klasa', 'noun', 'classes'], ['po merr', 'verb', 'are you taking'], ['semestrin tjetër?', 'noun', 'semester next']],
  },
  cook: {
    french: [['J’', 'pronoun', 'I'], ['ai demandé', 'verb', 'asked'], ['à', 'preposition', 'to'], ['mon ami', 'noun', 'my friend'], ['de m’aider à cuisiner.', 'verb', 'to help me cook']],
    'haitian-creole': [['Mwen', 'pronoun', 'I'], ['te mande', 'verb', 'asked'], ['zanmi mwen', 'noun', 'friend my'], ['pou', 'preposition', 'to'], ['ede m kwit manje.', 'verb', 'help me cook']],
    spanish: [['Le', 'pronoun', 'to him/her'], ['pedí', 'verb', 'I asked'], ['a', 'preposition', 'to'], ['mi amigo', 'noun', 'my friend'], ['que me ayudara a cocinar.', 'verb', 'that he help me cook']],
    english: [['I', 'pronoun', 'I'], ['asked', 'verb', 'asked'], ['my friend', 'noun', 'my friend'], ['to help me cook.', 'verb', 'to help me cook']],
    asl: [['FRIEND', 'noun', 'friend'], ['COOK', 'verb', 'cook'], ['HELP-ME', 'verb', 'help me'], ['I', 'pronoun', 'I'], ['ASK.', 'verb', 'asked']],
    albanian: [['I', 'pronoun', 'to him/her'], ['kërkova', 'verb', 'I asked'], ['shokut tim', 'noun', 'friend my'], ['të më ndihmonte të gatuaja.', 'verb', 'to help me cook']],
  },
  birthday: {
    french: [['Ma mère,', 'noun', 'my mom'], ['mon frère', 'noun', 'my brother'], ['et', 'conjunction', 'and'], ['moi', 'pronoun', 'I'], ['sortons manger', 'verb', 'are going out to eat'], ['parce que', 'conjunction', 'because'], ['c’est', 'verb', 'it is'], ['mon anniversaire.', 'noun', 'my birthday']],
    'haitian-creole': [['Manman m,', 'noun', 'mom my'], ['frè m', 'noun', 'brother my'], ['ak', 'conjunction', 'and'], ['mwen', 'pronoun', 'I'], ['pral soti manje', 'verb', 'going out to eat'], ['paske', 'conjunction', 'because'], ['se', 'verb', 'it is'], ['anivèsè mwen.', 'noun', 'birthday my']],
    spanish: [['Mi mamá,', 'noun', 'my mom'], ['mi hermano', 'noun', 'my brother'], ['y', 'conjunction', 'and'], ['yo', 'pronoun', 'I'], ['vamos a salir a comer', 'verb', 'are going out to eat'], ['porque', 'conjunction', 'because'], ['es', 'verb', 'it is'], ['mi cumpleaños.', 'noun', 'my birthday']],
    english: [['My mom,', 'noun', 'my mom'], ['my brother,', 'noun', 'my brother'], ['and', 'conjunction', 'and'], ['I', 'pronoun', 'I'], ['are going out to eat', 'verb', 'are going out to eat'], ['because', 'conjunction', 'because'], ['it’s', 'verb', 'it is'], ['my birthday.', 'noun', 'my birthday']],
    asl: [['MY MOM', 'noun', 'my mom'], ['MY BROTHER', 'noun', 'my brother'], ['ME', 'pronoun', 'I'], ['GO-OUT EAT', 'verb', 'going out to eat'], ['BECAUSE', 'conjunction', 'because'], ['MY BIRTHDAY.', 'noun', 'my birthday']],
    albanian: [['Nëna ime,', 'noun', 'mom my'], ['vëllai im', 'noun', 'brother my'], ['dhe', 'conjunction', 'and'], ['unë', 'pronoun', 'I'], ['po dalim për të ngrënë', 'verb', 'are going out to eat'], ['sepse', 'conjunction', 'because'], ['është', 'verb', 'it is'], ['ditëlindja ime.', 'noun', 'birthday my']],
  },
};

const sentenceSelect = document.querySelector('#sentence-select');
const languageSelect = document.querySelector('#language-select');
const languageLabel = document.querySelector('#language-label');
const translation = document.querySelector('#translation');
const controls = document.querySelector('.controls');
const languageNames = { french: 'French', 'haitian-creole': 'Haitian Creole', spanish: 'Spanish', english: 'English', asl: 'ASL', albanian: 'Albanian' };

function renderWords(words) {
  translation.textContent = '';
  translation.classList.add('word-blocks-grid');
  words.forEach(([text, pos, english]) => {
    const block = document.createElement('div');
    block.className = `word-block ${pos}`;
    [['word-target', text], ['word-pos', POS_LABELS[pos]], ['word-translation', english]].forEach(([cls, content]) => {
      const el = document.createElement('div');
      el.className = cls;
      el.textContent = content;
      block.appendChild(el);
    });
    translation.appendChild(block);
  });
}

function showMessage(message) {
  translation.classList.remove('word-blocks-grid');
  translation.textContent = message;
}

function updatePreview() {
  controls.classList.toggle('long-sentence', sentenceSelect.value === 'birthday' || sentenceSelect.options[sentenceSelect.selectedIndex]?.text.length > 55);
  controls.classList.toggle('medium-sentence', sentenceSelect.value === 'classes');

  if (!languageSelect.value) {
    languageLabel.textContent = '';
    showMessage('Choose a sentence and language to begin.');
    return;
  }
  languageLabel.textContent = `In ${languageNames[languageSelect.value]}`;
  if (!sentenceSelect.value) {
    showMessage('Choose a sentence to translate.');
    return;
  }
  const words = translations[sentenceSelect.value]?.[languageSelect.value];
  if (!words) {
    showMessage('Translation coming soon.');
    return;
  }
  renderWords(words);
}

if (sentenceSelect && languageSelect) {
  sentenceSelect.addEventListener('change', updatePreview);
  languageSelect.addEventListener('change', updatePreview);
}

const authOverlay = document.querySelector('#auth-overlay');

function openAuth(event) {
  event?.preventDefault();
  if (!authOverlay) return;
  authOverlay.classList.add('is-visible');
  authOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('auth-open');
  authOverlay.querySelector('input')?.focus();
}

function closeAuth(event) {
  event?.preventDefault();
  if (!authOverlay) return;
  authOverlay.classList.remove('is-visible');
  authOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('auth-open');
}

document.querySelectorAll('[data-action="signin"]').forEach((button) => button.addEventListener('click', openAuth));
if (window.location.hash === '#auth') openAuth();
document.querySelectorAll('[data-action="close-auth"]').forEach((button) => button.addEventListener('click', closeAuth));
document.querySelector('[data-action="create-account"]')?.addEventListener('click', () => {
  window.location.href = 'pages/auth/create-account.html';
});
document.querySelector('[data-action="google-signin"]')?.addEventListener('click', () => window.alert('Google sign in is coming soon.'));
document.querySelector('[data-action="forgot-password"]')?.addEventListener('click', (event) => {
  event.preventDefault();
  window.alert('Password reset is coming soon.');
});
document.querySelector('#signin-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const status = form.querySelector('.auth-status') || document.createElement('p');
  status.className = 'auth-status';
  status.setAttribute('role', 'status');
  if (!status.parentElement) form.appendChild(status);

  const email = form.elements.email.value.trim().toLowerCase();
  const password = form.elements.password.value;
  if (!email || !password) {
    status.textContent = 'Please enter your email address and password.';
    return;
  }

  let account = null;
  try {
    account = JSON.parse(localStorage.getItem('lingolab-account') || 'null');
  } catch (error) {
    account = null;
  }

  if (!account || account.email !== email || account.password !== password) {
    status.textContent = 'That email and password do not match a saved LingoLab account.';
    return;
  }

  localStorage.setItem('lingolab-authenticated', 'true');
  localStorage.setItem('lingolab-user-email', account.email);
  localStorage.setItem('lingolab-user-role', account.role || 'student');
  status.textContent = 'You are signed in.';
  const destination = account.role === 'teacher'
    ? 'pages/teacher/teacher-resources.html'
    : 'pages/create.html';
  window.setTimeout(() => { window.location.href = destination; }, 300);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && authOverlay?.classList.contains('is-visible')) closeAuth();
});

document.querySelector('.help-button')?.addEventListener('click', () => {
  window.alert('LingoLab helps you learn linguistics by building a language one choice at a time.');
});

/* Language Atlas: light up continents where the chosen language is spoken */
const languageRegions = {
  french: {
    continents: ['europe', 'africa', 'north-america', 'south-america', 'oceania'],
    description: 'French is spoken in Europe, Africa, North America, South America, and Oceania.',
  },
  'haitian-creole': {
    continents: ['north-america'],
    description: 'Haitian Creole is spoken in North America, mainly in Haiti and in Haitian communities abroad.',
  },
  spanish: {
    continents: ['europe', 'north-america', 'south-america', 'africa'],
    description: 'Spanish is spoken in Europe, North America, South America, and parts of Africa.',
  },
  english: {
    continents: ['north-america', 'europe', 'oceania', 'africa', 'asia', 'south-america'],
    description: 'English is spoken on nearly every continent, as a first or second language.',
  },
  asl: {
    continents: ['north-america'],
    description: 'American Sign Language is used by Deaf communities in North America.',
  },
  albanian: {
    continents: ['europe'],
    description: 'Albanian is spoken in Europe, mainly in Albania, Kosovo, and North Macedonia.',
  },
};

const worldSelect = document.querySelector('#world-language-select');
const worldLanguage = document.querySelector('#world-language');
const worldDescription = document.querySelector('#world-description');
const continentHighlights = document.querySelectorAll('.continent-highlight');

function updateGlobe() {
  const region = languageRegions[worldSelect.value];
  if (!region) return;

  worldLanguage.textContent = languageNames[worldSelect.value];
  worldDescription.textContent = region.description;

  continentHighlights.forEach((path) => {
    path.classList.toggle('active', region.continents.includes(path.dataset.continent));
  });
}

if (worldSelect) worldSelect.addEventListener('change', updateGlobe);
