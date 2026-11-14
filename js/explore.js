const worldLanguageSelect = document.querySelector('#world-language-select');
const worldLanguage = document.querySelector('#world-language');
const worldDescription = document.querySelector('#world-description');
const exploreSentenceSelect = document.querySelector('#explore-sentence-select');
const exploreLanguageSelect = document.querySelector('#explore-language-select');
const outputLabel = document.querySelector('#output-label');
const exploreTranslation = document.querySelector('#explore-translation');
const grammarNote = document.querySelector('#grammar-note');

const regions = {
  french: { name: 'French', description: 'Explore the many places French is spoken across Europe, Africa, the Americas, and Oceania.', continents: ['europe', 'africa', 'north-america', 'south-america', 'oceania'] },
  'haitian-creole': { name: 'Haitian Creole', description: 'Haitian Creole is spoken throughout Haiti and by Haitian communities around the world.', continents: ['north-america', 'south-america', 'europe'] },
  spanish: { name: 'Spanish', description: 'Follow Spanish across Europe, North America, South America, and Africa.', continents: ['europe', 'north-america', 'south-america', 'africa'] },
  english: { name: 'English', description: 'English connects communities across North America, Europe, Oceania, Africa, Asia, and South America.', continents: ['north-america', 'europe', 'oceania', 'africa', 'asia', 'south-america'] },
  asl: { name: 'ASL', description: 'American Sign Language is used across North America, with signing communities and learners connecting it to Africa, Asia, and South America.', continents: ['north-america', 'africa', 'asia', 'south-america'] },
  albanian: { name: 'Albanian', description: 'Albanian is spoken in Albania, Kosovo, neighboring regions, and diaspora communities around the world.', continents: ['europe'] },
};

const sentenceData = {
  cook: {
    french: { label: 'In French', html: "J’ <span class='verb'>ai demandé</span> <span class='prep'>à</span> <span class='determiner'>mon</span> <span class='noun'>colocataire</span> <span class='verb'>d’aider</span> <span class='verb'>à cuisiner.</span>", note: 'French keeps the subject close to the verb, then uses a preposition to connect the person being asked and the action.' },
    'haitian-creole': { label: 'An kreyòl ayisyen', html: "Mwen <span class='verb'>mande</span> <span class='determiner'>kolok mwen</span> pou <span class='verb'>ede m kwit manje.</span>", note: 'Haitian Creole uses familiar markers and a clear verb phrase to connect the request and the action.' },
    spanish: { label: 'En español', html: "Le <span class='verb'>pedí</span> a <span class='determiner'>mi</span> <span class='noun'>compañero</span> de piso <span class='verb'>que me ayudara</span> a cocinar.", note: 'Spanish can use a pronoun before the verb to show who receives the request.' },
    english: { label: 'In English', html: "I <span class='verb'>asked</span> <span class='determiner'>my roommate</span> to <span class='verb'>help me cook.</span>", note: 'English often makes the subject, verb, and object easy to spot in that order.' },
    asl: { label: 'In ASL', html: "ROOMMATE, <span class='verb'>COOK</span> — <span class='verb'>HELP-ME</span>, I <span class='verb'>ASK.</span>", note: 'ASL uses signing space, facial grammar, and topic-comment structure to organize meaning.' },
    albanian: { label: 'Në shqip', html: "I <span class='verb'>kërkova</span> <span class='determiner'>shokut tim të dhomës</span> të <span class='verb'>më ndihmonte të gatuaja.</span>", note: 'Albanian uses rich verb forms and case endings to show relationships between words.' },
  },
  museum: {
    french: { label: 'In French', html: "Nous <span class='verb'>retrouvons</span> <span class='determiner'>nos</span> <span class='noun'>amis</span> au musée.", note: 'French places the subject before the verb, then adds the object and location.' },
    'haitian-creole': { label: 'An kreyòl ayisyen', html: "Nou <span class='verb'>ap rankontre</span> <span class='determiner'>zanmi nou yo</span> nan mize a.", note: 'Haitian Creole uses particles like ap to signal an ongoing action.' },
    spanish: { label: 'En español', html: "<span class='verb'>Nos encontramos</span> con <span class='determiner'>nuestros</span> <span class='noun'>amigos</span> en el museo.", note: 'Spanish often uses a reflexive form to express meeting one another.' },
    english: { label: 'In English', html: "We <span class='verb'>are meeting</span> <span class='determiner'>our friends</span> at the museum.", note: 'English uses a subject-verb pattern and a preposition to introduce the place.' },
    asl: { label: 'In ASL', html: "MUSEUM, <span class='determiner'>OUR FRIENDS</span> — WE <span class='verb'>MEET.</span>", note: 'ASL can establish a place or topic first, then show the action in signing space.' },
    albanian: { label: 'Në shqip', html: "Ne <span class='verb'>po takohemi</span> me <span class='determiner'>miqtë tanë</span> në muze.", note: 'Albanian combines verb forms with noun endings that carry grammatical information.' },
  },
  garden: {
    french: { label: 'In French', html: "Le <span class='determiner'>petit</span> <span class='noun'>renard</span> <span class='verb'>a traversé</span> le jardin calme.", note: 'Adjectives usually follow the noun in French, but petit is one familiar exception.' },
    'haitian-creole': { label: 'An kreyòl ayisyen', html: "<span class='determiner'>Ti</span> <span class='noun'>rena a</span> <span class='verb'>te travèse</span> jaden trankil la.", note: 'Haitian Creole uses small words around the noun phrase to make meaning clear.' },
    spanish: { label: 'En español', html: "El <span class='determiner'>pequeño</span> <span class='noun'>zorro</span> <span class='verb'>cruzó</span> el jardín tranquilo.", note: 'Spanish commonly places descriptive adjectives after nouns, with a few flexible exceptions.' },
    english: { label: 'In English', html: "The <span class='determiner'>little</span> <span class='noun'>fox</span> <span class='verb'>crossed</span> the quiet garden.", note: 'English typically places adjectives before nouns, then follows with the verb.' },
    asl: { label: 'In ASL', html: "<span class='determiner'>LITTLE</span> <span class='noun'>FOX</span>, QUIET GARDEN <span class='verb'>CROSS.</span>", note: 'ASL uses visual emphasis, movement, and topic-comment order to show the scene.' },
    albanian: { label: 'Në shqip', html: "<span class='determiner'>Dhelpra e vogël</span> <span class='verb'>kaloi</span> nëpër kopshtin e qetë.", note: 'Albanian marks the relationship between descriptive words and nouns with inflection.' },
  },
};

function updateWorld() {
  const region = regions[worldLanguageSelect.value];
  if (!region) return;
  worldLanguage.textContent = region.name;
  worldDescription.textContent = region.description;
  document.querySelectorAll('.continent-highlight').forEach((shape) => {
    shape.classList.toggle('active', region.continents.includes(shape.dataset.continent));
  });
}

function updateSentence() {
  const result = sentenceData[exploreSentenceSelect.value][exploreLanguageSelect.value];
  outputLabel.textContent = result.label;
  exploreTranslation.innerHTML = result.html;
  grammarNote.textContent = result.note;
}

worldLanguageSelect.addEventListener('change', updateWorld);
exploreSentenceSelect.addEventListener('change', updateSentence);
exploreLanguageSelect.addEventListener('change', updateSentence);
updateWorld();
updateSentence();
