const placementOptions = document.querySelectorAll('input[name="placement"]');
const preview = document.querySelector('#adjective-preview');
const note = document.querySelector('#adjective-note');
const badge = document.querySelector('#placement-badge');

placementOptions.forEach((option) => {
  option.addEventListener('change', () => {
    const isBefore = option.value === 'before';
    document.querySelectorAll('.placement-option').forEach((item) => item.classList.remove('selected'));
    option.closest('.placement-option').classList.add('selected');
    badge.textContent = isBefore ? 'Before' : 'After';
    preview.innerHTML = isBefore
      ? '<span class="adjective-word">pink</span> <span class="noun-word">flower</span>'
      : '<span class="noun-word">flower</span> <span class="adjective-word">pink</span>';
    note.textContent = isBefore ? 'The describing word comes before the noun.' : 'The describing word comes after the noun.';
    localStorage.setItem('lingolab-adjective-placement', option.value);
  });
});

document.querySelector('#save-adjectives').addEventListener('click', () => {
  localStorage.setItem('lingolab-adjective-placement', document.querySelector('input[name="placement"]:checked').value);
});
