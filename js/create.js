const phonemeSets = {
  consonants: ['p', 'b', 't', 'd', 'k', 'g', 'm', 'n', 'ŋ', 'f', 'v', 's', 'z', 'ʃ', 'ʒ', 'h', 'l', 'r', 'j', 'w', 'θ', 'ð', 'ɲ', 'ʔ'],
  vowels: ['i', 'e', 'ɛ', 'a', 'ɑ', 'ɔ', 'o', 'u', 'ɪ', 'ʊ', 'ə', 'y', 'ø', 'œ', 'ɐ', 'ɨ'],
};
const selectedSounds = new Set();
const chart = document.querySelector('#phoneme-chart');
const count = document.querySelector('#sound-count');

function renderChart(type) {
  chart.innerHTML = phonemeSets[type].map((sound) => `<button class="phoneme-button ${selectedSounds.has(sound) ? 'selected' : ''}" type="button" data-sound="${sound}" aria-pressed="${selectedSounds.has(sound)}">/${sound}/</button>`).join('');
  chart.querySelectorAll('.phoneme-button').forEach((button) => button.addEventListener('click', () => {
    const sound = button.dataset.sound;
    selectedSounds.has(sound) ? selectedSounds.delete(sound) : selectedSounds.add(sound);
    button.classList.toggle('selected', selectedSounds.has(sound));
    button.setAttribute('aria-pressed', selectedSounds.has(sound));
    count.textContent = selectedSounds.size;
    localStorage.setItem('lingolab-sounds', JSON.stringify([...selectedSounds]));
  }));
}

document.querySelectorAll('.chart-tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.chart-tab').forEach((item) => item.classList.remove('active'));
  tab.classList.add('active');
  renderChart(tab.dataset.chart);
}));

renderChart('consonants');
