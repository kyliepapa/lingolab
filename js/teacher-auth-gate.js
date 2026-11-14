const savedAccount = JSON.parse(localStorage.getItem('lingolab-account') || 'null');
if (localStorage.getItem('lingolab-authenticated') !== 'true' || savedAccount?.role !== 'teacher') {
  window.location.replace('signin.html?return=teacher-resources.html');
}
