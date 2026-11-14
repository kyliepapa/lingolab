const form = document.querySelector('#account-form');
const success = document.querySelector('#account-success');

function setError(name, message) {
  form.querySelector(`[data-error-for="${name}"]`).textContent = message;
  form.elements[name].classList.toggle('input-error', Boolean(message));
}

function validate() {
  const { name, email, password, confirm } = form.elements;
  const errors = {};

  if (!name.value.trim()) errors.name = 'Please enter your name.';
  if (!email.value.trim()) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) errors.email = 'That email doesn’t look right.';
  if (password.value.length < 8) errors.password = 'Use at least 8 characters.';
  if (confirm.value !== password.value || !confirm.value) errors.confirm = 'Passwords don’t match.';

  ['name', 'email', 'password', 'confirm'].forEach((field) => setError(field, errors[field] || ''));
  const firstInvalid = Object.keys(errors)[0];
  if (firstInvalid) form.elements[firstInvalid].focus();
  return !firstInvalid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validate()) return;

  /* TODO: send { name, email, password } to your sign-up backend here.
     Never store the password in localStorage or anywhere in the browser. */

  document.querySelector('#success-name').textContent = form.elements.name.value.trim();
  localStorage.setItem('lingolab-authenticated', 'true');
  localStorage.setItem('lingolab-user-email', form.elements.email.value.trim());
  form.hidden = true;
  success.hidden = false;
});
