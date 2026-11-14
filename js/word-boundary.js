const pairs = [
  ['unhelpful', 'un- + help + -ful'],
  ['prepayment', 'pre- + pay + -ment'],
  ['reusable', 're- + use + -able'],
  ['impossibility', 'im- + possible + -ity']
];
let flipped = [];
let moves = 0;
let matches = 0;
const grid = document.getElementById('memory-grid');
const feedback = document.getElementById('memory-feedback');
function shuffle(cards) { return cards.sort(() => Math.random() - .5); }
function startCase() { flipped = []; moves = 0; matches = 0; document.getElementById('moves').textContent = '0'; document.getElementById('matches').textContent = '0'; feedback.textContent = 'Flip a card to start investigating.'; grid.innerHTML = ''; const cards = shuffle(pairs.flatMap(([word, boundary], index) => [{ value: `word-${index}`, label: word }, { value: `word-${index}`, label: boundary }])); cards.forEach((card) => { const button = document.createElement('button'); button.className = 'memory-card'; button.type = 'button'; button.dataset.value = card.value; button.innerHTML = `<span class="memory-card-inner"><span class="memory-face memory-front">?</span><span class="memory-face memory-back">${card.label}</span></span>`; button.addEventListener('click', () => flip(button)); grid.appendChild(button); }); }
function flip(card) { if (flipped.length === 2 || card.classList.contains('flipped') || card.classList.contains('matched')) return; card.classList.add('flipped'); flipped.push(card); if (flipped.length < 2) return; moves += 1; document.getElementById('moves').textContent = moves; const [first, second] = flipped; if (first.dataset.value === second.dataset.value) { first.classList.add('matched'); second.classList.add('matched'); matches += 1; document.getElementById('matches').textContent = matches; feedback.textContent = matches === pairs.length ? `Case closed in ${moves} moves! You found every word boundary.` : 'Match found! Keep investigating.'; flipped = []; } else { feedback.textContent = 'Not a match—remember what you saw.'; setTimeout(() => { first.classList.remove('flipped'); second.classList.remove('flipped'); flipped = []; }, 850); } }
document.getElementById('reset-memory').addEventListener('click', startCase);
startCase();
