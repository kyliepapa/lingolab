const markerInputs = document.querySelectorAll('.marker-input');
const markerSelects = document.querySelectorAll('.marker-row select');
const previewText = document.querySelector('#marker-preview-text');
const previewNote = document.querySelector('#marker-preview-note');

function updatePastPreview() {
  const marker = document.querySelector('.marker-input[data-tense="past"]').value || '—';
  const placement = document.querySelector('.marker-row select[data-tense="past"]').value;
  const verb = 'wait';
  const result = placement === 'prefix' ? `${marker}${verb}` : placement === 'suffix' ? `${verb}${marker}` : placement === 'separate-after' ? `${verb} ${marker}` : `${marker} ${verb}`;
  const label = placement === 'prefix' ? 'prefix' : placement === 'suffix' ? 'suffix' : placement === 'separate-after' ? 'separate word after the verb' : 'separate word before the verb';
  previewText.textContent = result;
  previewNote.textContent = `Your marker “${marker}” is a ${label}.`;
}

markerInputs.forEach((input) => input.addEventListener('input', updatePastPreview));
markerSelects.forEach((select) => select.addEventListener('change', updatePastPreview));
markerInputs.forEach((input) => input.addEventListener('input', () => localStorage.setItem(`lingolab-tense-${input.dataset.tense}-marker`, input.value)));
markerSelects.forEach((select) => select.addEventListener('change', () => localStorage.setItem(`lingolab-tense-${select.dataset.tense}-placement`, select.value)));

document.querySelector('#finish-tenses').addEventListener('click', (event) => {
  event.currentTarget.innerHTML = 'Language saved ✓';
  event.currentTarget.disabled = true;
  localStorage.setItem('lingolab-tenses-complete', 'true');
  window.location.href = '../personal-conjugations.html';
});
