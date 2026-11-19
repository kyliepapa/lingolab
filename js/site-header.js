const headerStyle = document.createElement('style');
headerStyle.textContent = `.site-header .header-actions{align-items:center;display:flex;gap:15px;margin-left:auto}.site-header .header-actions .sign-in{background:transparent}.site-header .create-account-button{align-items:center;background:#ee6d50;border:1px solid #ee6d50;border-radius:999px;color:#fff;display:inline-flex;font-size:16px;font-weight:700;padding:13px 25px;text-decoration:none;white-space:nowrap}.site-header .create-account-button:hover{background:#df5e44;border-color:#df5e44}@media(max-width:700px){.site-header .header-actions{gap:7px}.site-header .create-account-button{font-size:13px;padding:10px 13px}.site-header .header-actions .sign-in{font-size:13px;padding:10px 13px}}`;
document.head.appendChild(headerStyle);
headerStyle.textContent += `.site-header .logout-link{background:transparent;border:1px solid #b9c1bf;border-radius:999px;color:var(--ink);cursor:pointer;font:700 16px 'DM Sans',Arial;padding:13px 23px;white-space:nowrap}.site-header .logout-link:hover{background:#fff}@media(max-width:700px){.site-header .logout-link{font-size:13px;padding:10px 13px}}`;
const siteRoot = window.location.pathname.replaceAll('\\', '/').includes('/pages/create/') ? '../../' : '';

const pagePath = window.location.pathname.replaceAll('\\', '/');
const inPages = pagePath.includes('/pages/');
const inAuth = pagePath.includes('/pages/auth/');
const inNestedPage = pagePath.includes('/pages/create/') || pagePath.includes('/pages/games/') || pagePath.includes('/pages/auth/') || pagePath.includes('/pages/teacher/') || pagePath.includes('/pages/legacy/');
const pagePrefix = inNestedPage ? '../' : '';
const authPath = inAuth ? '' : inPages ? `${pagePrefix}auth/` : 'pages/auth/';
const homePath = inPages ? (inNestedPage ? '../../index.html' : '../index.html') : 'index.html';
const teacherPath = inPages ? `${pagePrefix}teacher/teacher-resources.html` : 'pages/teacher/teacher-resources.html';

document.querySelectorAll('.site-header').forEach((header) => {
  const nav = header.querySelector('.main-nav');
  nav?.querySelectorAll('.sign-in, .create-link').forEach((item) => item.remove());
  const teacherRole = localStorage.getItem('lingolab-user-role') === 'teacher';
  nav?.querySelectorAll('.teacher-nav-link').forEach((item) => item.remove());
  if (teacherRole && nav) {
    const teacherNavLink = document.createElement('a');
    teacherNavLink.className = 'teacher-nav-link teacher-resource-link';
    teacherNavLink.href = `${siteRoot}teacher-resources.html`;
    teacherNavLink.textContent = 'Teacher resources';
    const aboutLink = [...nav.querySelectorAll('a')].find((item) => item.textContent.trim().toLowerCase() === 'about');
    if (aboutLink) aboutLink.insertAdjacentElement('afterend', teacherNavLink);
    else nav.append(teacherNavLink);
  }
  nav?.querySelectorAll('a').forEach((link) => {
    const label = link.textContent.trim().toLowerCase();
    if (label === 'home') link.href = `${siteRoot}index.html#top`;
    if (label === 'explore') link.href = `${siteRoot}explore.html`;
    if (label === 'create') link.href = `${siteRoot}create.html`;
    if (label === 'about') link.href = `${siteRoot}about.html`;
  });

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
      signIn.href = `${siteRoot}signin.html`;
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
    createAccount.href = `${siteRoot}create-account.html`;
    createAccount.textContent = 'Create account';
    actions.append(createAccount);
  }

  if (signIn.tagName === 'BUTTON') {
    const link = document.createElement('a');
    link.className = signIn.className;
    link.href = `${siteRoot}signin.html`;
    link.textContent = 'Sign in';
    signIn.replaceWith(link);
  } else {
    signIn.href = `${siteRoot}signin.html`;
  }
  createAccount.href = `${siteRoot}create-account.html`;

  actions.querySelectorAll('.teacher-resource-link').forEach((item) => item.remove());

  const authenticated = localStorage.getItem('lingolab-authenticated') === 'true';
  actions.querySelectorAll('.logout-link').forEach((item) => item.remove());
  if (authenticated) {
    const logout = document.createElement('button');
    logout.className = 'logout-link';
    logout.type = 'button';
    logout.textContent = 'Log out';
    logout.addEventListener('click', () => {
      localStorage.removeItem('lingolab-authenticated');
      localStorage.removeItem('lingolab-user-email');
      localStorage.removeItem('lingolab-user-role');
      window.location.href = `${siteRoot}index.html`;
    });
    actions.append(logout);
  }
});
