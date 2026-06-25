// Shared password gate.
//
// This is a lightweight convenience gate for static client playbooks. It does
// not provide server-side security; it simply keeps operational pages out of
// casual view. Change SHARED_PASSWORD for each client build.
const ACCESS_CONFIG = {
  SHARED_PASSWORD: 'staffready',
  SESSION_KEY: 'staffready_access',
};

(function resolveRoot() {
  const scripts = document.querySelectorAll('script[src]');
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src.includes('assets/auth.js')) {
      window._AUTH_ROOT = scripts[i].src.replace('assets/auth.js', '');
      return;
    }
  }
  window._AUTH_ROOT = '/';
})();

function _hasSharedAccess() {
  return sessionStorage.getItem(ACCESS_CONFIG.SESSION_KEY) === 'granted';
}

function _setSharedAccess() {
  sessionStorage.setItem(ACCESS_CONFIG.SESSION_KEY, 'granted');
}

function _returnAfterAccess(fallback) {
  const ret = sessionStorage.getItem('_auth_return') || fallback || window._AUTH_ROOT + 'index.html';
  sessionStorage.removeItem('_auth_return');
  location.replace(ret);
}

// Public API used by protected pages.
function checkZone(zone) {
  if (zone === 1 || _hasSharedAccess()) return;

  document.documentElement.style.visibility = 'hidden';
  sessionStorage.setItem('_auth_return', location.href);
  location.replace(window._AUTH_ROOT + 'gate-access.html');
}

// Called from gate-access.html.
function submitSharedPassword(password, onWrong) {
  if (password === ACCESS_CONFIG.SHARED_PASSWORD) {
    _setSharedAccess();
    _returnAfterAccess(window._AUTH_ROOT + 'index.html');
  } else {
    onWrong();
  }
}

function clearSharedAccess() {
  sessionStorage.removeItem(ACCESS_CONFIG.SESSION_KEY);
}
