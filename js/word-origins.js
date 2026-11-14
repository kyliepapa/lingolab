document.querySelectorAll('.word-row').forEach((row) => {
  const concept = row.querySelector('.concept-word').textContent.trim();
  const input = row.querySelector('input');
  const key = `lingolab-word-${concept}`;
  input.value = localStorage.getItem(key) || '';
  input.addEventListener('input', () => localStorage.setItem(key, input.value));
});