if (localStorage.getItem('lingolab-authenticated') !== 'true') {
  const nestedCreatePage = window.location.pathname.replaceAll('\\', '/').includes('/pages/create/');
  const returnTo = `${nestedCreatePage ? 'pages/create/' : ''}${window.location.pathname.split('/').pop()}${window.location.hash}`;
  const siteRoot = nestedCreatePage ? '../../' : '';
  window.location.replace(`${siteRoot}signin.html?return=${encodeURIComponent(returnTo)}`);
}
