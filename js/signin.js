const form = document.querySelector('#standalone-signin-form');
const status = document.querySelector('#signin-status');

function setError(field, message) {
  const input = form.elements[field];
  const error = form.querySelector(`[data-error-for="${field}"]`);
  input.classList.toggle('input-error', Boolean(message));
  error.textContent = message;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = form.elements.email.value.trim();
  const password = form.elements.password.value;
  setError('email', email ? '' : 'Please enter your email address.');
  setError('password', password ? '' : 'Please enter your password.');
  if (!email || !password) return;

  const account = JSON.parse(localStorage.getItem('lingolab-account') || 'null');
  if (!account || account.email !== email.toLowerCase() || account.password !== password) {
    status.textContent = 'That email and password do not match a saved LingoLab account.';
    status.classList.add('is-error');
    return;
  }

  localStorage.setItem('lingolab-authenticated', 'true');
  localStorage.setItem('lingolab-user-email', account.email);
  localStorage.setItem('lingolab-user-role', account.role);
  const requestedReturn = new URLSearchParams(window.location.search).get('return');
  const createSteps = new Set(['word-origins.html', 'sentence-order.html', 'adjectives.html', 'tenses.html', 'personal-conjugations.html', 'finishing-touches.html']);
  let returnTo = '/pages/create.html';
  if (requestedReturn && !/^(?:[a-z]+:|\/\/)/i.test(requestedReturn)) {
    if (requestedReturn.startsWith('/')) returnTo = requestedReturn;
    else if (requestedReturn === 'create.html') returnTo = '/pages/create.html';
    else if (createSteps.has(requestedReturn)) returnTo = `/pages/create/${requestedReturn}`;
    else if (requestedReturn === 'teacher-resources.html') returnTo = '/pages/teacher/teacher-resources.html';
  }
  window.location.href = returnTo;
});
