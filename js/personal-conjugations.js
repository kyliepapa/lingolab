const choiceInputs = document.querySelectorAll('input[name="conjugations"]');
const builder = document.querySelector('#conjugation-builder');

choiceInputs.forEach((input) => {
  input.addEventListener('change', () => {
    document.querySelectorAll('.choice-button').forEach((item) => item.classList.remove('selected'));
    input.closest('.choice-button').classList.add('selected');
    builder.hidden = input.value === 'no';
    localStorage.setItem('lingolab-personal-conjugations', input.value);
  });
});

document.querySelectorAll('#conjugation-builder input, #conjugation-builder select, .pronoun-grid input').forEach((field, index) => {
  field.addEventListener('input', () => localStorage.setItem(`lingolab-personal-field-${index}`, field.value));
  field.addEventListener('change', () => localStorage.setItem(`lingolab-personal-field-${index}`, field.value));
});

document.querySelector('#finish-conjugations').addEventListener('click', (event) => {
  event.currentTarget.innerHTML = 'Language saved ✓';
  event.currentTarget.disabled = true;
  localStorage.setItem('lingolab-conjugations-complete', 'true');
  window.location.href = '../finishing-touches.html';
});
