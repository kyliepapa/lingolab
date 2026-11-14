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

  localStorage.setItem('lingolab-authenticated', 'true');
  localStorage.setItem('lingolab-user-email', email);
  const requestedReturn = new URLSearchParams(window.location.search).get('return');
  const returnTo = requestedReturn && !/^(?:[a-z]+:|\/\/)/i.test(requestedReturn)
    ? requestedReturn
    : 'create.html';
  window.location.href = returnTo;
});
