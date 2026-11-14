document.querySelectorAll('input[name="articles"]').forEach((input) => {
  input.addEventListener('change', () => {
    document.querySelector('#article-inputs').hidden = input.value === 'no';
    localStorage.setItem('lingolab-articles', input.value);
  });
});

document.querySelectorAll('.touch-card input, .touch-card select').forEach((field, index) => {
  field.addEventListener('input', () => localStorage.setItem(`lingolab-finishing-field-${index}`, field.value));
  field.addEventListener('change', () => localStorage.setItem(`lingolab-finishing-field-${index}`, field.value));
});

document.querySelector('#finish-language').addEventListener('click', (event) => {
  event.currentTarget.innerHTML = 'Language complete ✓';
  event.currentTarget.disabled = true;
  localStorage.setItem('lingolab-language-complete', 'true');
  window.location.href = '../language-report.html';
});
