const form = document.querySelector('#account-form');
const success = document.querySelector('#account-success');

function setError(name, message) {
  form.querySelector(`[data-error-for="${name}"]`).textContent = message;
  form.elements[name].classList.toggle('input-error', Boolean(message));
}

function validate() {
  const { name, role, email, password, confirm } = form.elements;
  const errors = {};

  if (!name.value.trim()) errors.name = 'Please enter your name.';
  if (!role.value) errors.role = 'Please choose Student or Teacher.';
  if (!email.value.trim()) errors.email = 'Please enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) errors.email = 'That email doesn’t look right.';
  if (password.value.length < 8) errors.password = 'Use at least 8 characters.';
  if (confirm.value !== password.value || !confirm.value) errors.confirm = 'Passwords don’t match.';

  ['name', 'role', 'email', 'password', 'confirm'].forEach((field) => setError(field, errors[field] || ''));
  const firstInvalid = Object.keys(errors)[0];
  if (firstInvalid) form.elements[firstInvalid].focus();
  return !firstInvalid;
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validate()) return;

  const account = {
    name: form.elements.name.value.trim(),
    role: form.elements.role.value,
    email: form.elements.email.value.trim().toLowerCase(),
    password: form.elements.password.value
  };
  const existing = JSON.parse(localStorage.getItem('lingolab-account') || 'null');
  if (existing && existing.email === account.email) {
    setError('email', 'An account with this email already exists. Please sign in.');
    form.elements.email.focus();
    return;
  }

  localStorage.setItem('lingolab-account', JSON.stringify(account));
  document.querySelector('#success-name').textContent = account.name;
  localStorage.setItem('lingolab-authenticated', 'true');
  localStorage.setItem('lingolab-user-email', account.email);
  localStorage.setItem('lingolab-user-role', account.role);
  form.hidden = true;
  success.hidden = false;
});
