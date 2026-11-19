const levels = {
  english: { name: 'English', examples: [
    { word: 'construction', pieces: [['con', 'together'], ['struct', 'build'], ['-ion', 'action of']] },
    { word: 'unhelpful', pieces: [['un-', 'not or opposite of'], ['help', 'assist'], ['-ful', 'full of']] },
    { word: 'prepayment', pieces: [['pre-', 'before'], ['pay', 'give money'], ['-ment', 'result or action']] },
    { word: 'disrespectful', pieces: [['dis-', 'opposite of'], ['respect', 'admiration'], ['-ful', 'full of']] },
    { word: 'reusable', pieces: [['re-', 'again'], ['use', 'employ'], ['-able', 'capable of']] },
    { word: 'impossibility', pieces: [['im-', 'not'], ['possible', 'can happen'], ['-ity', 'state or quality']] }
  ] },
  french: { name: 'French', examples: [{ word: 'relecture', pieces: [['re-', 'again'], ['lecture', 'reading']] }, { word: 'impossible', pieces: [['im-', 'not'], ['possible', 'can happen']] }, { word: 'chanteur', pieces: [['chant', 'sing'], ['-eur', 'person who does it']] }] },
  'haitian-creole': { name: 'Haitian Creole', examples: [{ word: 'liv yo', pieces: [['liv', 'book'], ['yo', 'plural marker']] }, { word: 'te manje', pieces: [['te', 'past marker'], ['manje', 'eat']] }, { word: 'pa konnen', pieces: [['pa', 'not'], ['konnen', 'know']] }] },
  spanish: { name: 'Spanish', examples: [{ word: 'panadero', pieces: [['pan', 'bread'], ['-adero', 'person or place connected to']] }, { word: 'infeliz', pieces: [['in-', 'not or opposite of'], ['feliz', 'happy']] }, { word: 'flores', pieces: [['flor', 'flower'], ['-es', 'plural marker']] }] },
  asl: { name: 'ASL', examples: [{ word: 'TEACHER', pieces: [['TEACH', 'give knowledge'], ['PERSON', 'person who does it']] }, { word: 'CHAIR', pieces: [['SIT', 'rest on a seat'], ['CHAIR', 'thing connected to the action']] }, { word: 'THINKER', pieces: [['THINK', 'use your mind'], ['PERSON', 'person who does it']] }] },
  albanian: { name: 'Albanian', examples: [{ word: 'palumtur', pieces: [['pa-', 'without or not'], ['lumtur', 'happy']] }, { word: 'libra', pieces: [['libr', 'book'], ['-a', 'plural marker']] }, { word: 'punëtor', pieces: [['punë', 'work'], ['-tor', 'person who does it']] }] }
};
const WIN_HEIGHT = 10;
const BRICK_WIDTH = 250;
const BRICK_HEIGHT = 35;
let language = 'english';
let score = 0;
let selected = '';
let gameWon = false;
const tower = [];
const progress = Object.fromEntries(Object.keys(levels).map((key) => [key, { example: 0, piece: 0 }]));
const $ = (id) => document.getElementById(id);
const canvas = $('morphology-canvas');
const ctx = canvas.getContext('2d');
const gameDescription = document.createElement('p');
gameDescription.className = 'game-description';
gameDescription.textContent = 'Morphemes are tiny meaningful pieces inside words. Choose the right piece, add a brick to your tower, and keep building with new examples.';
document.getElementById('game-title').after(gameDescription);
function currentExample() { return levels[language].examples[progress[language].example]; }
function currentPiece() { return currentExample().pieces[progress[language].piece]; }
function setLevel() { const level = levels[language]; const example = currentExample(); const piece = currentPiece(); selected = ''; $('level-label').textContent = `${level.name} · ${example.word}`; $('example-label').textContent = `Piece ${progress[language].piece + 1} of ${example.pieces.length}`; $('prompt-meaning').textContent = piece[1]; $('prompt-help').textContent = `Which part of “${example.word}” has this meaning? Choose that piece to add it to your tower.`; $('feedback').textContent = 'Your next brick is waiting.'; $('feedback').className = 'feedback'; $('answer-controls').innerHTML = example.pieces.map((item) => `<button class="answer-control" type="button" data-piece="${item[0]}">${item[0]}</button>`).join(''); $('answer-controls').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => choose(button))); draw(); }
function choose(button) { if (selected || gameWon) return; selected = button.dataset.piece; button.classList.add('selected'); const piece = currentPiece(); if (selected === piece[0]) { button.classList.add('correct'); tower.push(selected); score = tower.length; $('score').textContent = score; $('tower-height').textContent = score; $('feedback').textContent = `Brick added! You found “${selected}.”`; $('feedback').className = 'feedback good'; draw(); if (tower.length >= WIN_HEIGHT) { gameWon = true; $('feedback').textContent = 'You reached the line—tower complete! You win!'; return; } setTimeout(() => { const state = progress[language]; state.piece += 1; if (state.piece >= currentExample().pieces.length) { state.piece = 0; state.example = (state.example + 1) % levels[language].examples.length; } setLevel(); }, 650); } else { button.classList.add('wrong'); $('feedback').textContent = 'That piece does not match this meaning. Try another brick.'; $('feedback').className = 'feedback try-again'; selected = ''; setTimeout(() => button.classList.remove('wrong'), 450); } }
function draw() { ctx.clearRect(0, 0, canvas.width, canvas.height); const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height); gradient.addColorStop(0, '#173f58'); gradient.addColorStop(1, '#0c2639'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#285771'; for (let x = 20; x < canvas.width; x += 32) for (let y = 30; y < canvas.height; y += 32) { ctx.globalAlpha = .25; ctx.fillRect(x, y, 2, 2); } ctx.globalAlpha = 1; const winY = canvas.height - 28 - WIN_HEIGHT * BRICK_HEIGHT; ctx.save(); ctx.setLineDash([8, 8]); ctx.strokeStyle = '#f6c54d'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(35, winY); ctx.lineTo(canvas.width - 35, winY); ctx.stroke(); ctx.restore(); ctx.fillStyle = '#f6c54d'; ctx.font = '800 11px DM Sans, Arial'; ctx.textAlign = 'right'; ctx.fillText('WIN LINE', canvas.width - 40, winY - 9); const x = canvas.width / 2 - BRICK_WIDTH / 2; tower.slice(-WIN_HEIGHT).forEach((brick, index) => { const y = canvas.height - 28 - (index + 1) * BRICK_HEIGHT; ctx.fillStyle = ['#ee6d50', '#f6c54d', '#249e99'][index % 3]; ctx.beginPath(); ctx.roundRect(x + (index % 2 ? 8 : -8), y, BRICK_WIDTH, BRICK_HEIGHT - 4, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '700 15px DM Sans, Arial'; ctx.textAlign = 'center'; ctx.fillText(brick, canvas.width / 2 + (index % 2 ? 8 : -8), y + 21); }); ctx.fillStyle = '#dbe9e3'; ctx.fillRect(55, canvas.height - 25, canvas.width - 110, 4); if (!tower.length) { ctx.fillStyle = '#a9c7c9'; ctx.font = '600 16px DM Sans, Arial'; ctx.textAlign = 'center'; ctx.fillText('Choose the right morpheme to place your first brick', canvas.width / 2, canvas.height - 70); } }
function resetForLanguage(nextLanguage) { language = nextLanguage; score = 0; tower.length = 0; gameWon = false; progress[language] = { example: 0, piece: 0 }; $('score').textContent = '0'; $('tower-height').textContent = '0'; setLevel(); }
document.querySelectorAll('.language-tab').forEach((tab) => tab.addEventListener('click', () => { document.querySelectorAll('.language-tab').forEach((item) => item.classList.remove('active')); tab.classList.add('active'); resetForLanguage(tab.dataset.language); }));
setLevel();
