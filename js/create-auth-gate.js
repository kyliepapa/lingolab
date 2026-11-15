if (localStorage.getItem('lingolab-authenticated') !== 'true') {
  const returnTo = `${window.location.pathname}${window.location.hash}`;
  const signinPath = window.location.pathname.includes('/pages/create/') ? '../auth/signin.html' : window.location.pathname.includes('/pages/') ? 'auth/signin.html' : 'pages/auth/signin.html';
  window.location.replace(`${signinPath}?return=${encodeURIComponent(returnTo)}`);
}
