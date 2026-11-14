const stepByPage = {
  'create.html': 1,
  'word-origins.html': 2,
  'sentence-order.html': 3,
  'adjectives.html': 4,
  'tenses.html': 5,
  'personal-conjugations.html': 6,
  'finishing-touches.html': 7,
};

const stepNames = ['Sound profile', 'Word origins', 'Sentence order', 'Adjectives', 'Tenses', 'Personal conjugations', 'Finishing touches'];
const pageName = window.location.pathname.split('/').pop() || 'create.html';
const currentStep = stepByPage[pageName] || 1;
const stepLabel = document.querySelector('.flow-intro .eyebrow');

if (stepLabel) stepLabel.textContent = `Create your language · Step ${currentStep} of 7`;

function updateProgress() {
  const labels = document.querySelector('.progress-labels');
  const track = document.querySelector('.progress-track');
  if (!labels || !track) return;

  labels.innerHTML = stepNames.map((name) => `<span>${name}</span>`).join('');
  track.classList.add('seven-step');
  track.innerHTML = `<span class="progress-fill"></span>${stepNames.map((_, index) => `<i class="progress-dot ${index + 1 < currentStep ? 'complete' : ''} ${index + 1 === currentStep ? 'current' : ''}"></i>`).join('')}`;
  track.querySelector('.progress-fill').style.width = `${((currentStep - 1) / (stepNames.length - 1)) * 100}%`;
}

function requiredFields() {
  switch (pageName) {
    case 'create.html':
      return [];
    case 'word-origins.html':
      return [...document.querySelectorAll('.word-builder-card input')].map((input) => ({ input, message: 'Add a word for each concept before continuing.' }));
    case 'sentence-order.html':
      return [{ input: document.querySelector('#sentence-order-select'), message: 'Choose a sentence order before continuing.' }];
    case 'adjectives.html':
      return [...document.querySelectorAll('.adjective-grid input')].map((input) => ({ input, message: 'Create all three adjectives before continuing.' }));
    case 'tenses.html':
      return [...document.querySelectorAll('.marker-input')].map((input) => ({ input, message: 'Add a marker for every tense before continuing.' }));
    case 'personal-conjugations.html': {
      const fields = [...document.querySelectorAll('.pronoun-grid input, .verb-grid input')].map((input) => ({ input, message: 'Add a word for every verb and pronoun before continuing.' }));      if (document.querySelector('input[name="conjugations"]:checked')?.value === 'yes') {
        fields.push(...[...document.querySelectorAll('.conjugation-grid input')].map((input) => ({ input, message: 'Add a marker for every person before continuing.' })));
      }
      return fields;
    }
    case 'finishing-touches.html': {
      const fields = [...document.querySelectorAll('.touch-card input:not([type="radio"])')];
      if (document.querySelector('input[name="articles"]:checked')?.value !== 'yes') {
        return fields.filter((input) => !input.closest('#article-inputs')).map((input) => ({ input, message: 'Complete the finishing-touch fields before continuing.' }));
      }
      return fields.map((input) => ({ input, message: 'Complete the finishing-touch fields before continuing.' }));
    }
    default:
      return [];
  }
}

function showValidationError(message, target) {
  document.querySelector('.flow-error')?.remove();
  const error = document.createElement('p');
  error.className = 'flow-error';
  error.setAttribute('role', 'alert');
  error.textContent = `⚠ ${message}`;
  const footer = document.querySelector('.flow-footer');
  const actions = footer?.querySelector('.flow-actions') || footer;
  actions?.prepend(error);
  target?.classList.add('input-error');
  target?.focus();
  setTimeout(() => target?.classList.remove('input-error'), 1800);
}

function validateStep(event) {
  const checks = requiredFields();
  const invalid = checks.find(({ input }) => input && !input.value.trim());
  if (invalid) {
    event.preventDefault();
    showValidationError(invalid.message, invalid.input);
    return false;
  }
  if (checks.length === 1 && checks[0].message && !checks[0].input) {
    event.preventDefault();
    showValidationError(checks[0].message);
    return false;
  }
  return true;
}

updateProgress();
document.querySelectorAll('.flow-footer .continue-button').forEach((button) => {
  button.addEventListener('click', (event) => {
    if (validateStep(event)) document.querySelector('.flow-error')?.remove();
  });
});
