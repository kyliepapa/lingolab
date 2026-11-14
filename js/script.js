const token = (word, type, label) => `<span class="token ${type}"><span>${word}</span><small>${label}</small></span>`;
const translations = {
  cook: {
    french: { label: 'In French', html: "J’ <span class='verb'>ai demandé</span> <span class='prep'>à</span> <span class='determiner'>mon</span> <span class='noun'>colocataire</span> <span class='verb'>d’aider</span> <span class='verb'>à cuisiner.</span>" },
    'haitian-creole': { label: 'An kreyòl ayisyen', html: "Mwen <span class='verb'>mande</span> <span class='determiner'>kolok mwen</span> pou <span class='verb'>ede m kwit manje.</span>" },
    spanish: { label: 'En español', html: "Le <span class='verb'>pedí</span> a <span class='determiner'>mi</span> <span class='noun'>compañero</span> de piso <span class='verb'>que me ayudara</span> a cocinar." },
    english: { label: 'In English', html: "I <span class='verb'>asked</span> <span class='determiner'>my roommate</span> to <span class='verb'>help me cook.</span>" },
    asl: { label: 'In ASL', html: "ROOMMATE, <span class='verb'>COOK</span> — <span class='verb'>HELP-ME</span>, I <span class='verb'>ASK.</span>" },
    albanian: { label: 'Në shqip', html: "I <span class='verb'>kërkova</span> <span class='determiner'>shokut tim të dhomës</span> të <span class='verb'>më ndihmonte të gatuaja.</span>" },
  },
  museum: {
    french: { label: 'In French', html: "Nous <span class='verb'>retrouvons</span> <span class='determiner'>nos</span> <span class='noun'>amis</span> au musée." },
    'haitian-creole': { label: 'An kreyòl ayisyen', html: "Nou <span class='verb'>ap rankontre</span> <span class='determiner'>zanmi nou yo</span> nan mize a." },
    spanish: { label: 'En español', html: "<span class='verb'>Nos encontramos</span> con <span class='determiner'>nuestros</span> <span class='noun'>amigos</span> en el museo." },
    english: { label: 'In English', html: "We <span class='verb'>are meeting</span> <span class='determiner'>our friends</span> at the museum." },
    asl: { label: 'In ASL', html: "MUSEUM, <span class='determiner'>OUR FRIENDS</span> — WE <span class='verb'>MEET.</span>" },
    albanian: { label: 'Në shqip', html: "Ne <span class='verb'>po takohemi</span> me <span class='determiner'>miqtë tanë</span> në muze." },
  },
  garden: {
    french: { label: 'In French', html: "Le <span class='determiner'>petit</span> <span class='noun'>renard</span> <span class='verb'>a traversé</span> le jardin calme." },
    'haitian-creole': { label: 'An kreyòl ayisyen', html: "<span class='determiner'>Ti</span> <span class='noun'>rena a</span> <span class='verb'>te travèse</span> jaden trankil la." },
    spanish: { label: 'En español', html: "El <span class='determiner'>pequeño</span> <span class='noun'>zorro</span> <span class='verb'>cruzó</span> el jardín tranquilo." },
    english: { label: 'In English', html: "The <span class='determiner'>little</span> <span class='noun'>fox</span> <span class='verb'>crossed</span> the quiet garden." },
    asl: { label: 'In ASL', html: "<span class='determiner'>LITTLE</span> <span class='noun'>FOX</span>, QUIET GARDEN <span class='verb'>CROSS.</span>" },
    albanian: { label: 'Në shqip', html: "<span class='determiner'>Dhelpra e vogël</span> <span class='verb'>kaloi</span> nëpër kopshtin e qetë." },
  },
};

Object.assign(translations, {
  classes: {
    french: { label: 'In French', english: 'What classes do you want to take next semester?', html: [token('Quels', 'pronoun', 'Pronoun'), token('cours', 'noun', 'Noun'), token('veux-tu', 'verb', 'Verb'), token('suivre', 'verb', 'Verb'), token('le', 'determiner', 'Determiner'), token('semestre', 'noun', 'Noun'), token('prochain', 'determiner', 'Determiner'), '?'].join(' ') },
    'haitian-creole': { label: 'In Haitian Creole', english: 'What classes do you want to take next semester?', html: [token('Ki', 'pronoun', 'Pronoun'), token('klas', 'noun', 'Noun'), token('ou vle', 'verb', 'Verb'), token('pran', 'verb', 'Verb'), token('semès pwochèn', 'determiner', 'Determiner'), '?'].join(' ') },
    spanish: { label: 'In Spanish', english: 'What classes do you want to take next semester?', html: [token('¿Qué', 'pronoun', 'Pronoun'), token('clases', 'noun', 'Noun'), token('quieres', 'verb', 'Verb'), token('tomar', 'verb', 'Verb'), token('el próximo semestre', 'determiner', 'Determiner'), '?'].join(' ') },
    english: { label: 'In English', english: 'What classes are you taking next semester?', html: [token('What', 'pronoun', 'Pronoun'), token('classes', 'noun', 'Noun'), token('are taking', 'verb', 'Verb'), token('you', 'pronoun', 'Pronoun'), token('next semester', 'determiner', 'Determiner'), '?'].join(' ') },
    asl: { label: 'In ASL', english: 'What classes do you want to take next semester?', html: [token('NEXT SEMESTER', 'determiner', 'Determiner'), token('YOU', 'pronoun', 'Pronoun'), token('WANT TAKE', 'verb', 'Verb'), token('WHAT CLASSES?', 'noun', 'Noun')].join(' ') },
    albanian: { label: 'In Albanian', english: 'What classes do you want to take next semester?', html: [token('Cilat', 'pronoun', 'Pronoun'), token('klasa', 'noun', 'Noun'), token('dëshiron', 'verb', 'Verb'), token('të marrësh', 'verb', 'Verb'), token('semestrin tjetër', 'determiner', 'Determiner'), '?'].join(' ') },
  },
  cook: {
    french: { label: 'In French', english: 'I asked my friend to help me cook.', html: [token('J’', 'pronoun', 'Pronoun'), token('ai demandé', 'verb', 'Verb'), token('à', 'prep', 'Preposition'), token('mon', 'determiner', 'Determiner'), token('ami', 'noun', 'Noun'), token('de m’aider', 'verb', 'Verb'), token('à cuisiner.', 'verb', 'Verb')].join(' ') },
    'haitian-creole': { label: 'In Haitian Creole', english: 'I asked my friend to help me cook.', html: [token('Mwen', 'pronoun', 'Pronoun'), token('te mande', 'verb', 'Verb'), token('zanmi mwen', 'noun', 'Noun'), token('pou', 'prep', 'Preposition'), token('ede m kwit manje.', 'verb', 'Verb')].join(' ') },
    spanish: { label: 'In Spanish', english: 'I asked my friend to help me cook.', html: [token('Le', 'pronoun', 'Pronoun'), token('pedí', 'verb', 'Verb'), token('a mi', 'prep', 'Preposition'), token('amigo', 'noun', 'Noun'), token('que me ayudara', 'verb', 'Verb'), token('a cocinar.', 'verb', 'Verb')].join(' ') },
    english: { label: 'In English', english: 'I asked my friend to help me cook.', html: [token('I', 'pronoun', 'Pronoun'), token('asked', 'verb', 'Verb'), token('my', 'determiner', 'Determiner'), token('friend', 'noun', 'Noun'), token('to help', 'verb', 'Verb'), token('me cook.', 'verb', 'Verb')].join(' ') },
    asl: { label: 'In ASL', english: 'I asked my friend to help me cook.', html: [token('FRIEND', 'noun', 'Noun'), token('COOK', 'verb', 'Verb'), token('HELP-ME', 'verb', 'Verb'), token('I', 'pronoun', 'Pronoun'), token('ASK.', 'verb', 'Verb')].join(' ') },
    albanian: { label: 'In Albanian', english: 'I asked my friend to help me cook.', html: [token('I', 'pronoun', 'Pronoun'), token('kërkova', 'verb', 'Verb'), token('shokut tim', 'noun', 'Noun'), token('të më ndihmonte', 'verb', 'Verb'), token('të gatuaja.', 'verb', 'Verb')].join(' ') },
  },
  birthday: {
    french: { label: 'In French', english: "My mom, my brother, and I are going out to eat because it's my birthday.", html: [token('Ma mère', 'determiner', 'Determiner'), token(', mon frère', 'noun', 'Noun'), token('et moi', 'pronoun', 'Pronoun'), token('sortons', 'verb', 'Verb'), token('manger', 'verb', 'Verb'), token('parce que', 'prep', 'Preposition'), token('c’est', 'verb', 'Verb'), token('mon anniversaire.', 'noun', 'Noun')].join(' ') },
    'haitian-creole': { label: 'In Haitian Creole', english: "My mom, my brother, and I are going out to eat because it's my birthday.", html: [token('Manman m', 'determiner', 'Determiner'), token(', frè m', 'noun', 'Noun'), token('ak mwen', 'pronoun', 'Pronoun'), token('pral manje', 'verb', 'Verb'), token('paske', 'prep', 'Preposition'), token('se anivèsè nesans mwen.', 'noun', 'Noun')].join(' ') },
    spanish: { label: 'In Spanish', english: "My mom, my brother, and I are going out to eat because it's my birthday.", html: [token('Mi mamá', 'determiner', 'Determiner'), token(', mi hermano', 'noun', 'Noun'), token('y yo', 'pronoun', 'Pronoun'), token('vamos', 'verb', 'Verb'), token('a comer', 'verb', 'Verb'), token('porque', 'prep', 'Preposition'), token('es mi cumpleaños.', 'noun', 'Noun')].join(' ') },
    english: { label: 'In English', english: "My mom, my brother, and I are going out to eat because it's my birthday.", html: [token('My mom', 'determiner', 'Determiner'), token(', my brother', 'noun', 'Noun'), token(', and I', 'pronoun', 'Pronoun'), token('are going', 'verb', 'Verb'), token('out to eat', 'verb', 'Verb'), token('because', 'prep', 'Preposition'), token('it’s', 'verb', 'Verb'), token('my birthday.', 'noun', 'Noun')].join(' ') },
    asl: { label: 'In ASL', english: "My mom, my brother, and I are going out to eat because it's my birthday.", html: [token('MY MOM', 'determiner', 'Determiner'), token('MY BROTHER', 'noun', 'Noun'), token('ME', 'pronoun', 'Pronoun'), token('GO EAT', 'verb', 'Verb'), token('BECAUSE', 'prep', 'Preposition'), token('MY BIRTHDAY.', 'noun', 'Noun')].join(' ') },
    albanian: { label: 'In Albanian', english: "My mom, my brother, and I are going out to eat because it's my birthday.", html: [token('Nëna ime', 'determiner', 'Determiner'), token(', vëllai im', 'noun', 'Noun'), token('dhe unë', 'pronoun', 'Pronoun'), token('po dalim', 'verb', 'Verb'), token('për të ngrënë', 'verb', 'Verb'), token('sepse', 'prep', 'Preposition'), token('është ditëlindja ime.', 'noun', 'Noun')].join(' ') },
  },
});

const sentenceSelect = document.querySelector('#sentence-select');
const languageSelect = document.querySelector('#language-select');
const languageLabel = document.querySelector('#language-label');
const translation = document.querySelector('#translation');
const englishTranslation = document.querySelector('#english-translation');
const controls = document.querySelector('.controls');
const languageNames = { french: 'French', 'haitian-creole': 'Haitian Creole', spanish: 'Spanish', english: 'English', asl: 'ASL', albanian: 'Albanian' };
const englishSources = { classes: 'What classes are you taking next semester?', cook: 'I asked my friend to help me cook.', birthday: "My mom, my brother, and I are going out to eat because it's my birthday." };

function updatePreview() {
  controls.classList.toggle('long-sentence', sentenceSelect.value === 'birthday' || sentenceSelect.options[sentenceSelect.selectedIndex]?.text.length > 55);
  controls.classList.toggle('medium-sentence', sentenceSelect.value === 'classes');
  if (!languageSelect.value) {
    languageLabel.textContent = '';
    translation.textContent = 'Choose a sentence and language to begin.';
    englishTranslation.textContent = '';
    return;
  }
  languageLabel.textContent = `In ${languageNames[languageSelect.value] || ''}`;
  if (!sentenceSelect.value) {
    translation.textContent = 'Choose a sentence to translate.';
    englishTranslation.textContent = '';
    return;
  }
  const result = translations[sentenceSelect.value][languageSelect.value] || translations[sentenceSelect.value].english || translations[sentenceSelect.value].french;
  languageLabel.textContent = result.label;
  translation.innerHTML = result.html;
  englishTranslation.innerHTML = `<strong>English:</strong> ${englishSources[sentenceSelect.value]}`;
}

if (sentenceSelect && languageSelect) {
  sentenceSelect.addEventListener('change', updatePreview);
  languageSelect.addEventListener('change', updatePreview);
}

const authOverlay = document.querySelector('#auth-overlay');

function openAuth(event) {
  event?.preventDefault();
  authOverlay.classList.add('is-visible');
  authOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('auth-open');
  authOverlay.querySelector('input')?.focus();
}

function closeAuth(event) {
  event?.preventDefault();
  authOverlay.classList.remove('is-visible');
  authOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('auth-open');
}

document.querySelectorAll('[data-action="signin"]').forEach((button) => button.addEventListener('click', openAuth));
if (window.location.hash === '#auth') openAuth();
document.querySelectorAll('[data-action="close-auth"]').forEach((button) => button.addEventListener('click', closeAuth));
document.querySelector('[data-action="create-account"]').addEventListener('click', () => window.alert('Account creation is coming soon.'));
document.querySelector('[data-action="google-signin"]').addEventListener('click', () => window.alert('Google sign in is coming soon.'));
document.querySelector('[data-action="forgot-password"]').addEventListener('click', (event) => {
  event.preventDefault();
  window.alert('Password reset is coming soon.');
});
document.querySelector('#signin-form').addEventListener('submit', (event) => {
  event.preventDefault();
  window.alert('Thanks! Account authentication will connect here next.');
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && authOverlay.classList.contains('is-visible')) closeAuth();
});

document.querySelector('.help-button').addEventListener('click', () => {
  window.alert('LingoLab helps you learn linguistics by building a language one choice at a time.');
});
