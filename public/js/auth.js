function getToken() { return localStorage.getItem('token'); }
function setToken(t) { localStorage.setItem('token', t); }
function clearAuth() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('role');
}
function requireAuth() {
  if (!getToken()) { window.location.href = 'login.html'; return false; }
  return true;
}
function logout() { clearAuth(); window.location.href = 'login.html'; }