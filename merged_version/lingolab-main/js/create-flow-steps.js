const stepByPage = {
  'create.html': 1,
  'word-origins.html': 2,
  'sentence-order.html': 3,
  'tenses.html': 5,
  'personal-conjugations.html': 6,
  'finishing-touches.html': 7,
};

const stepNames = ['Sound profile', 'Word origins', 'Sentence order', 'Adjectives', 'Tenses', 'Personal conjugations', 'Finishing touches'];
const pathSegment = window.location.pathname.split('/').pop() || 'create.html';
const pageName = pathSegment.endsWith('.html') ? pathSegment : `${pathSegment}.html`;
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
      return [...document.querySelectorAll('.word-builder-card input[data-word]')].map((input) => ({ input, message: 'Add a word for each concept before continuing.' }));
    case 'sentence-order.html':
      return [
        { input: document.querySelector('#sentence-order-select'), message: 'Choose a sentence order before continuing.' },
        ...[...document.querySelectorAll('.adjective-grid input[data-adj]')].map((input) => ({
          input,
          message: 'Create all three adjectives before continuing.',
        })),
      ];
    case 'tenses.html':
      return [...document.querySelectorAll('.verb-vocabulary-card input[data-verb]')].map((input) => ({
        input,
        message: 'Add a word for each verb before continuing.',
      }));
    case 'personal-conjugations.html': {
      const fields = [...document.querySelectorAll('.pronoun-card input[data-pronoun]')].map((input) => ({ input, message: 'Add a word for every pronoun before continuing.' }));
      if (document.querySelector('input[name="conjugations"]:checked')?.value === 'yes') {
        fields.push(...[...document.querySelectorAll('.conjugation-grid input[data-role="marker"]')].map((input) => ({ input, message: 'Add a marker for every person before continuing.' })));
      }
      return fields;
    }
    case 'finishing-touches.html': {
      const useArticles = document.querySelector('input[name="articles"]:checked')?.value === 'yes';
      const articleBlock = document.querySelector('#article-inputs');
      const fields = [
        ...document.querySelectorAll('.finishing-main [data-word]'),
        document.querySelector('[data-user-name]'),
        document.querySelector('[data-negation="marker"]'),
        document.querySelector('[data-pluralizer="marker"]'),
      ].filter((el) => {
        if (!el) return false;
        if (el.closest('[hidden]')) return false;
        if (!useArticles && articleBlock?.contains(el)) return false;
        return true;
      });
      if (useArticles) {
        fields.push(...document.querySelectorAll('[data-article]'));
      }
      return [...new Set(fields)].map((input) => ({
        input,
        message: 'Complete the finishing-touch fields before continuing.',
      }));
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

function fieldIsIncomplete(input) {
  if (!input) return true;
  const value = (input.value ?? '').trim();
  if (input.tagName === 'SELECT') return !value;
  return !value;
}

function validateStep(event) {
  window.LingoLabStore?.flushVocabularyInputs?.(document);
  const checks = requiredFields();
  const invalid = checks.find(({ input }) => fieldIsIncomplete(input));
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

const continueAfterSave = {
  'finish-tenses': 'personal-conjugations.html',
  'finish-conjugations': 'finishing-touches.html',
};

const SAVE_CONTINUE_LABEL = 'Save & continue <span aria-hidden="true">⟶</span>';

function saveAndContinue(button, event) {
  if (!validateStep(event)) return;
  document.querySelector('.flow-error')?.remove();
  const destination = continueAfterSave[button.id];
  if (!destination) return;
  event.preventDefault();
  button.disabled = true;
  button.innerHTML = 'Language saved ✓';
  window.location.href = destination;
}

async function finishLanguage(button, event) {
  if (!validateStep(event)) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  document.querySelector('.flow-error')?.remove();

  window.LingoLabStore?.flushVocabularyInputs?.(document);

  const syncToBackend = window.LingoLabStore?.syncToBackend;
  if (!syncToBackend) {
    showValidationError('Language storage is not ready. Refresh the page and try again.');
    return;
  }

  button.disabled = true;
  button.innerHTML = 'Saving…';
  try {
    await syncToBackend();
    button.innerHTML = 'Language complete ✓';
    window.location.href = 'language-report.html';
  } catch (err) {
    button.disabled = false;
    button.innerHTML = SAVE_CONTINUE_LABEL;
    window.alert(`Could not reach the language server. Run \`python app.py\` and try again.\n\n${err.message}`);
  }
}

const SENTENCE_ORDER_EXAMPLES = {
  SVO: 'I eat rice.',
  SOV: 'I rice eat.',
  VSO: 'Eat I rice.',
  VOS: 'Eat rice I.',
  OVS: 'Rice eat I.',
  OSV: 'Rice I eat.',
};

function wireSentenceOrderPreview() {
  if (pageName !== 'sentence-order.html') return;
  const orderSelect = document.querySelector('#sentence-order-select');
  const preview = document.querySelector('#sentence-preview');
  if (!orderSelect || !preview || orderSelect.dataset.flowPreviewBound === '1') return;

  orderSelect.dataset.flowPreviewBound = '1';

  function normalizeOrder(order) {
    if (!order) return '';
    const key = String(order).trim().toUpperCase();
    return Object.prototype.hasOwnProperty.call(SENTENCE_ORDER_EXAMPLES, key) ? key : '';
  }

  function show(order) {
    const normalized = normalizeOrder(order);
    if (!normalized) return;
    orderSelect.value = normalized;
    preview.textContent = SENTENCE_ORDER_EXAMPLES[normalized];
  }

  const saved = window.LingoLabStore?.readLanguage?.().sentence_order;
  show(normalizeOrder(saved) || 'SVO');

  orderSelect.addEventListener('change', () => {
    show(orderSelect.value);
  });
}

function bootFlow() {
  updateProgress();
  wireSentenceOrderPreview();

  document.querySelectorAll('.flow-footer .continue-button').forEach((button) => {
    button.addEventListener(
      'click',
      (event) => {
        if (button.id === 'finish-language') {
          finishLanguage(button, event);
          return;
        }
        if (continueAfterSave[button.id]) {
          saveAndContinue(button, event);
          return;
        }
        if (validateStep(event)) document.querySelector('.flow-error')?.remove();
      },
      { capture: true }
    );
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootFlow, { once: true });
} else {
  bootFlow();
}

window.addEventListener('lingolab:store-ready', wireSentenceOrderPreview, { once: true });
