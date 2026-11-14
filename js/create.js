const phonemes = ['p', 'b', 't', 'd', 'k', 'g', 'm', 'n', 'f', 's', 'l', 'r', 'h', 'a', 'e', 'i', 'o', 'u'];
const phonemeSounds = { p: 'pa', b: 'ba', t: 'ta', d: 'da', k: 'ka', g: 'ga', m: 'ma', n: 'na', f: 'fa', s: 'sa', l: 'la', r: 'ra', h: 'ha', a: 'ah', e: 'eh', i: 'ee', o: 'oh', u: 'oo' };
const selectedSounds = new Set(JSON.parse(localStorage.getItem('lingolab-sounds') || '[]'));
const chart = document.querySelector('#phoneme-chart');

function playPhoneme(sound) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(phonemeSounds[sound]);
  utterance.lang = 'en-US';
  utterance.rate = 0.72;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

function renderChart() {
  chart.innerHTML = phonemes.map((sound) => `<button class="phoneme-button ${selectedSounds.has(sound) ? 'selected' : ''}" type="button" data-sound="${sound}" aria-pressed="${selectedSounds.has(sound)}"><span>${sound}</span><small aria-hidden="true">▶</small></button>`).join('');
  chart.querySelectorAll('.phoneme-button').forEach((button) => button.addEventListener('click', () => {
    const sound = button.dataset.sound;
    playPhoneme(sound);
    selectedSounds.has(sound) ? selectedSounds.delete(sound) : selectedSounds.add(sound);
    button.classList.toggle('selected', selectedSounds.has(sound));
    button.setAttribute('aria-pressed', selectedSounds.has(sound));
    localStorage.setItem('lingolab-sounds', JSON.stringify([...selectedSounds]));
  }));
}

renderChart();
