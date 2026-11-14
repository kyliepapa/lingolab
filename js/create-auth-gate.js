if (localStorage.getItem('lingolab-authenticated') !== 'true') {
  const returnTo = `${window.location.pathname.split('/').pop()}${window.location.hash}`;
  window.location.replace(`signin.html?return=${encodeURIComponent(returnTo)}`);
}
