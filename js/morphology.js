const levels = {
  english: { name: 'English', rule: 'English commonly builds words with prefixes, roots, and suffixes.', examples: [
    { word: 'construction', pieces: [['con', 'together'], ['struct', 'build'], ['-ion', 'action of']] },
    { word: 'unhelpful', pieces: [['un-', 'not or opposite of'], ['help', 'assist'], ['-ful', 'full of']] },
    { word: 'prepayment', pieces: [['pre-', 'before'], ['pay', 'give money'], ['-ment', 'result or action']] },
    { word: 'disrespectful', pieces: [['dis-', 'opposite of'], ['respect', 'admiration'], ['-ful', 'full of']] },
    { word: 'reusable', pieces: [['re-', 'again'], ['use', 'employ'], ['-able', 'capable of']] },
    { word: 'impossibility', pieces: [['im-', 'not'], ['possible', 'can happen'], ['-ity', 'state or quality']] }
  ] },
  french: { name: 'French', rule: 'French often combines a root with prefixes and suffixes that show meaning or a person who does an action.', examples: [{ word: 'relecture', pieces: [['re-', 'again'], ['lecture', 'reading']] }, { word: 'impossible', pieces: [['im-', 'not'], ['possible', 'can happen']] }, { word: 'chanteur', pieces: [['chant', 'sing'], ['-eur', 'person who does it']] }] },
  'haitian-creole': { name: 'Haitian Creole', rule: 'Haitian Creole often uses separate grammar words after or before a root instead of stacking many affixes.', examples: [{ word: 'liv yo', pieces: [['liv', 'book'], ['yo', 'plural marker']] }, { word: 'te manje', pieces: [['te', 'past marker'], ['manje', 'eat']] }, { word: 'pa konnen', pieces: [['pa', 'not'], ['konnen', 'know']] }] },
  spanish: { name: 'Spanish', rule: 'Spanish uses roots and endings to show ideas such as people, number, and word families.', examples: [{ word: 'panadero', pieces: [['pan', 'bread'], ['-adero', 'person or place connected to']] }, { word: 'infeliz', pieces: [['in-', 'not or opposite of'], ['feliz', 'happy']] }, { word: 'flores', pieces: [['flor', 'flower'], ['-es', 'plural marker']] }] },
  asl: { name: 'ASL', rule: 'ASL meaning is built through signs, movement, space, facial expression, and visual combinations—not written affixes.', supportsSpeech: false, examples: [{ word: 'TEACHER', pieces: [['TEACH', 'give knowledge'], ['PERSON', 'person who does it']] }, { word: 'CHAIR', pieces: [['SIT', 'rest on a seat'], ['CHAIR', 'thing connected to the action']] }, { word: 'THINKER', pieces: [['THINK', 'use your mind'], ['PERSON', 'person who does it']] }] },
  albanian: { name: 'Albanian', rule: 'Albanian can stack prefixes, roots, and suffixes to build a more specific meaning.', examples: [{ word: 'palumtur', pieces: [['pa-', 'without or not'], ['lumtur', 'happy']] }, { word: 'libra', pieces: [['libr', 'book'], ['-a', 'plural marker']] }, { word: 'punëtor', pieces: [['punë', 'work'], ['-tor', 'person who does it']] }] }
};

const WIN_HEIGHT = 10;
const BRICK_WIDTH = 250;
const BRICK_HEIGHT = 35;
let language = 'english';
let mode = 'practice';
let selected = '';
let gameWon = false;
let state = { example: 0, piece: 0, score: 0, tower: [] };
const savedStates = JSON.parse(localStorage.getItem('lingolab-morphology-progress') || '{}');
const $ = (id) => document.getElementById(id);
const canvas = $('morphology-canvas');
const ctx = canvas.getContext('2d');

const gameDescription = document.createElement('p');
gameDescription.className = 'game-description';
gameDescription.textContent = 'Morphemes are meaningful pieces inside words. Choose the right piece, add a brick to your tower, and keep building with new examples.';
document.getElementById('game-title').after(gameDescription);

document.querySelector('.language-tabs').insertAdjacentHTML('afterend', '<div class="game-options"><div class="mode-switch" role="group" aria-label="Choose game mode"><button type="button" class="mode-button active" data-mode="practice">Practice mode</button><button type="button" class="mode-button" data-mode="challenge">Challenge mode</button></div><span class="mode-note" id="mode-note">No pressure—use hints and learn as you build.</span></div>');
document.querySelector('.morphology-prompt').insertAdjacentHTML('afterbegin', '<div class="language-rule" id="language-rule"></div>');
document.querySelector('#answer-controls').insertAdjacentHTML('beforebegin', '<div class="prompt-actions"><button type="button" class="prompt-action" id="hint-button">💡 Hint</button><button type="button" class="prompt-action" id="hear-button">🔊 Hear it</button></div>');
document.querySelector('.tower-footer').insertAdjacentHTML('afterend', '<div class="tower-progress" aria-live="polite"><span>Goal</span><div><i id="tower-progress-fill"></i></div><strong id="tower-progress-label">0 / 6</strong></div>');

function currentExample() { return levels[language].examples[state.example]; }
function currentPiece() { return currentExample().pieces[state.piece]; }
function pieceMeta(piece) {
  const text = piece[0];
  if (levels[language].supportsSpeech === false) return { role: 'sign', position: 'in a visual sequence' };
  if (text.endsWith('-')) return { role: 'prefix', position: 'at the beginning' };
  if (text.startsWith('-')) return { role: 'suffix', position: 'at the end' };
  if (language === 'haitian-creole' && ['yo', 'te', 'pa'].includes(text)) return { role: 'grammar word', position: text === 'yo' ? 'after the root' : 'before the root' };
  return { role: 'root', position: 'at the word’s center' };
}
function saveProgress() { savedStates[language] = state; localStorage.setItem('lingolab-morphology-progress', JSON.stringify(savedStates)); }
function loadProgress(nextLanguage) { const stored = savedStates[nextLanguage]; return stored ? { ...stored, tower: [...(stored.tower || [])] } : { example: 0, piece: 0, score: 0, tower: [] }; }
function goalHeight() { return mode === 'challenge' ? WIN_HEIGHT : 6; }
function updateGoal() { const goal = goalHeight(); $('tower-progress-label').textContent = `${Math.min(state.tower.length, goal)} / ${goal}`; $('tower-progress-fill').style.width = `${Math.min(100, state.tower.length / goal * 100)}%`; }

function setLevel() {
  const level = levels[language];
  const example = currentExample();
  const piece = currentPiece();
  selected = '';
  $('level-label').textContent = `${level.name} · ${example.word}`;
  $('example-label').textContent = `Build ${state.piece + 1} of ${example.pieces.length}`;
  $('language-rule').textContent = level.rule;
  $('prompt-meaning').textContent = piece[1];
  $('prompt-help').textContent = `Which part of “${example.word}” has this meaning? Choose a ${pieceMeta(piece).role} to add a brick.`;
  $('feedback').textContent = 'Your next brick is waiting.';
  $('feedback').className = 'feedback';
  $('answer-controls').innerHTML = example.pieces.map((item) => `<button class="answer-control" type="button" data-piece="${item[0]}"><span>${item[0]}</span><small>${pieceMeta(item).role}</small></button>`).join('');
  $('answer-controls').querySelectorAll('button').forEach((button) => button.addEventListener('click', () => choose(button)));
  updateGoal();
  draw();
}

function speak(text) {
  if (levels[language].supportsSpeech === false || !('speechSynthesis' in window)) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.replaceAll('-', ''));
  utterance.lang = language === 'french' ? 'fr-FR' : language === 'spanish' ? 'es-ES' : language === 'albanian' ? 'sq-AL' : 'en-US';
  utterance.rate = .75;
  window.speechSynthesis.speak(utterance);
  return true;
}

function choose(button) {
  if (selected || gameWon) return;
  selected = button.dataset.piece;
  button.classList.add('selected');
  const piece = currentPiece();
  if (selected === piece[0]) {
    button.classList.add('correct');
    state.tower.push(selected);
    state.score = state.tower.length;
    $('score').textContent = state.score;
    $('tower-height').textContent = state.score;
    $('feedback').textContent = `Brick added! “${selected}” is a ${pieceMeta(piece).role}.`;
    $('feedback').className = 'feedback good';
    speak(selected);
    saveProgress();
    draw();
    if (state.tower.length >= goalHeight()) {
      gameWon = true;
      $('feedback').textContent = `You reached the ${mode} goal—tower complete! You win!`;
      return;
    }
    setTimeout(() => { state.piece += 1; if (state.piece >= currentExample().pieces.length) { state.piece = 0; state.example = (state.example + 1) % levels[language].examples.length; } saveProgress(); setLevel(); }, 650);
  } else {
    button.classList.add('wrong');
    $('feedback').textContent = `That ${pieceMeta([selected, '']).role} does not match this meaning. Try another brick.`;
    $('feedback').className = 'feedback try-again';
    selected = '';
    setTimeout(() => button.classList.remove('wrong'), 450);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#173f58'); gradient.addColorStop(1, '#0c2639'); ctx.fillStyle = gradient; ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#285771'; for (let x = 20; x < canvas.width; x += 32) for (let y = 30; y < canvas.height; y += 32) { ctx.globalAlpha = .25; ctx.fillRect(x, y, 2, 2); } ctx.globalAlpha = 1;
  const winY = canvas.height - 28 - goalHeight() * BRICK_HEIGHT; ctx.save(); ctx.setLineDash([8, 8]); ctx.strokeStyle = '#ee6d50'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(35, winY); ctx.lineTo(canvas.width - 35, winY); ctx.stroke(); ctx.restore(); ctx.fillStyle = '#ee6d50'; ctx.font = '800 11px DM Sans, Arial'; ctx.textAlign = 'right'; ctx.fillText('WIN LINE', canvas.width - 40, winY - 9);
  const x = canvas.width / 2 - BRICK_WIDTH / 2; state.tower.slice(-goalHeight()).forEach((brick, index) => { const y = canvas.height - 28 - (index + 1) * BRICK_HEIGHT; ctx.fillStyle = ['#ee6d50', '#249e99', '#173f58'][index % 3]; ctx.beginPath(); ctx.roundRect(x + (index % 2 ? 8 : -8), y, BRICK_WIDTH, BRICK_HEIGHT - 4, 7); ctx.fill(); ctx.fillStyle = '#fff'; ctx.font = '700 15px DM Sans, Arial'; ctx.textAlign = 'center'; ctx.fillText(brick, canvas.width / 2 + (index % 2 ? 8 : -8), y + 21); });
  ctx.fillStyle = '#dbe9e3'; ctx.fillRect(55, canvas.height - 25, canvas.width - 110, 4); if (!state.tower.length) { ctx.fillStyle = '#a9c7c9'; ctx.font = '600 16px DM Sans, Arial'; ctx.textAlign = 'center'; ctx.fillText('Choose the right morpheme to place your first brick', canvas.width / 2, canvas.height - 70); }
}

function resetForLanguage(nextLanguage) { language = nextLanguage; state = loadProgress(language); gameWon = false; $('score').textContent = state.score; $('tower-height').textContent = state.tower.length; setLevel(); }
function setMode(nextMode) { mode = nextMode; document.querySelectorAll('.mode-button').forEach((button) => button.classList.toggle('active', button.dataset.mode === mode)); $('mode-note').textContent = mode === 'challenge' ? 'Reach the taller win line with fewer hints.' : 'No pressure—use hints and learn as you build.'; updateGoal(); draw(); }

document.querySelectorAll('.language-tab').forEach((tab) => tab.addEventListener('click', () => { document.querySelectorAll('.language-tab').forEach((item) => item.classList.remove('active')); tab.classList.add('active'); resetForLanguage(tab.dataset.language); }));
document.querySelectorAll('.mode-button').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
$('hint-button').addEventListener('click', () => { const piece = currentPiece(); const meta = pieceMeta(piece); $('feedback').textContent = `Hint: look for a ${meta.role} placed ${meta.position}.`; $('feedback').className = 'feedback'; });
$('hear-button').addEventListener('click', () => { const heard = speak(currentPiece()[0]); $('feedback').textContent = heard ? `Listen for “${currentPiece()[0]}.”` : 'This language uses visual signs here, so listen mode is not available for this example.'; $('feedback').className = 'feedback'; });

state = loadProgress(language);
$('score').textContent = state.score;
$('tower-height').textContent = state.tower.length;
setLevel();
