const headerStyle = document.createElement('style');
headerStyle.textContent = `.site-header .header-actions{align-items:center;display:flex;gap:15px;margin-left:auto}.site-header .header-actions .sign-in{background:transparent}.site-header .create-account-button{align-items:center;background:#ee6d50;border:1px solid #ee6d50;border-radius:999px;color:#fff;display:inline-flex;font-size:16px;font-weight:700;padding:13px 25px;text-decoration:none;white-space:nowrap}.site-header .create-account-button:hover{background:#df5e44;border-color:#df5e44}@media(max-width:700px){.site-header .header-actions{gap:7px}.site-header .create-account-button{font-size:13px;padding:10px 13px}.site-header .header-actions .sign-in{font-size:13px;padding:10px 13px}}`;
document.head.appendChild(headerStyle);

document.querySelectorAll('.site-header').forEach((header) => {
  const nav = header.querySelector('.main-nav');
  nav?.querySelectorAll('.sign-in, .create-link').forEach((item) => item.remove());

  let actions = header.querySelector(':scope > .header-actions');
  if (!actions) {
    actions = document.createElement('div');
    actions.className = 'header-actions';
    header.append(actions);
  }

  let signIn = actions.querySelector('.sign-in');
  const directSignIn = header.querySelector(':scope > .sign-in');
  if (!signIn) {
    signIn = directSignIn || document.createElement('a');
    if (!directSignIn) {
      signIn.className = 'sign-in';
      signIn.textContent = 'Sign in';
      signIn.href = 'index.html#auth';
    }
    actions.prepend(signIn);
  } else if (directSignIn && directSignIn !== signIn) {
    directSignIn.remove();
  }

  let createAccount = actions.querySelector('.create-account-button');
  if (!createAccount) {
    createAccount = actions.querySelector('.create-link');
    if (createAccount) createAccount.classList.add('create-account-button');
  }
  if (!createAccount) {
    createAccount = document.createElement('a');
    createAccount.className = 'create-account-button';
    createAccount.href = 'create-account.html';
    createAccount.textContent = 'Create account';
    actions.append(createAccount);
  }

  if (signIn.tagName === 'BUTTON') {
    const link = document.createElement('a');
    link.className = signIn.className;
    link.href = 'signin.html';
    link.textContent = 'Sign in';
    signIn.replaceWith(link);
  } else {
    signIn.href = 'signin.html';
  }
  createAccount.href = 'create-account.html';
});
