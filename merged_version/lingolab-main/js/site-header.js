const headerStyle = document.createElement('style');
headerStyle.textContent = `.site-header .header-actions{align-items:center;display:flex;gap:15px;margin-left:auto}.site-header .header-actions .sign-in{background:transparent}.site-header .create-account-button{align-items:center;background:#ee6d50;border:1px solid #ee6d50;border-radius:999px;color:#fff;display:inline-flex;font-size:16px;font-weight:700;padding:13px 25px;text-decoration:none;white-space:nowrap}.site-header .create-account-button:hover{background:#df5e44;border-color:#df5e44}@media(max-width:700px){.site-header .header-actions{gap:7px}.site-header .create-account-button{font-size:13px;padding:10px 13px}.site-header .header-actions .sign-in{font-size:13px;padding:10px 13px}}`;
document.head.appendChild(headerStyle);
headerStyle.textContent += `.site-header .logout-link{background:transparent;border:1px solid #b9c1bf;border-radius:999px;color:var(--ink);cursor:pointer;font:700 16px 'DM Sans',Arial;padding:13px 23px;white-space:nowrap}.site-header .logout-link:hover{background:#fff}@media(max-width:700px){.site-header .logout-link{font-size:13px;padding:10px 13px}}`;

const pathname = window.location.pathname.replace(/\\/g, '/');
const projectRootPrefix = pathname.includes('/pages/create/') || pathname.includes('/pages/games/') || pathname.includes('/pages/auth/') || pathname.includes('/pages/teacher/')
  ? '../../'
  : pathname.includes('/pages/')
    ? '../'
    : '';
const projectLink = (target) => `${projectRootPrefix}${target}`;

document.querySelectorAll('.site-header').forEach((header) => {
  const nav = header.querySelector('.main-nav');
  nav?.querySelectorAll('.sign-in, .create-link').forEach((item) => item.remove());
  const teacherRole = localStorage.getItem('lingolab-user-role') === 'teacher';
  nav?.querySelectorAll('.teacher-nav-link').forEach((item) => item.remove());
  if (teacherRole && nav) {
    const teacherNavLink = document.createElement('a');
    teacherNavLink.className = `teacher-nav-link teacher-resource-link${pathname.includes('/pages/teacher/') ? ' active' : ''}`;
    teacherNavLink.href = projectLink('pages/teacher/teacher-resources.html');
    teacherNavLink.textContent = 'Teacher resources';
    const aboutLink = [...nav.querySelectorAll('a')].find((item) => item.textContent.trim().toLowerCase() === 'about');
    if (aboutLink) aboutLink.insertAdjacentElement('afterend', teacherNavLink);
    else nav.append(teacherNavLink);
  }

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
      signIn.href = projectLink('index.html#auth');
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
    createAccount.href = projectLink('pages/auth/create-account.html');
    createAccount.textContent = 'Create account';
    actions.append(createAccount);
  }

  if (signIn.tagName === 'BUTTON') {
    const link = document.createElement('a');
    link.className = signIn.className;
    link.href = projectLink('pages/auth/signin.html');
    link.textContent = 'Sign in';
    signIn.replaceWith(link);
  } else {
    signIn.href = projectLink('pages/auth/signin.html');
  }
  createAccount.href = projectLink('pages/auth/create-account.html');

  let mobileToggle = header.querySelector(':scope > .mobile-menu-toggle');
  let mobileNav = header.querySelector(':scope > .mobile-nav');
  if (!mobileToggle) {
    mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.type = 'button';
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.setAttribute('aria-label', 'Open navigation');
    mobileToggle.innerHTML = '<span></span><span></span><span></span>';
    header.append(mobileToggle);
  }
  if (!mobileNav) {
    mobileNav = document.createElement('div');
    mobileNav.className = 'mobile-nav';
    mobileNav.id = `mobile-nav-${Math.random().toString(36).slice(2)}`;
    mobileNav.setAttribute('aria-hidden', 'true');
    header.append(mobileNav);
  }
  mobileToggle.setAttribute('aria-controls', mobileNav.id);
  mobileNav.innerHTML = '';
  nav?.querySelectorAll('a').forEach((item) => mobileNav.append(item.cloneNode(true)));
  actions.querySelectorAll('a, button').forEach((item) => mobileNav.append(item.cloneNode(true)));
  mobileToggle.addEventListener('click', () => {
    const open = header.classList.toggle('menu-open');
    mobileToggle.setAttribute('aria-expanded', String(open));
    mobileToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    mobileNav.setAttribute('aria-hidden', String(!open));
  });
  mobileNav.addEventListener('click', () => {
    header.classList.remove('menu-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  });

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
      window.location.href = projectLink('index.html');
    });
    actions.append(logout);
  }
});
