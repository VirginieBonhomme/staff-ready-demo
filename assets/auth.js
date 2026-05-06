// ── Access Zone Configuration ────────────────────────────────────────────────
// Zone 1 = open (onboarding, home, crisis)
// Zone 2 = company Wi-Fi only (SOPs, checklists, roles, FOH, food safety)
// Zone 3 = company Wi-Fi + BOH password (recipes, back-of-house)
//
// TODO: Replace both values below when ready to go live.
// ─────────────────────────────────────────────────────────────────────────────
const ZONE_CONFIG = {
  WIFI_IP:           'REPLACE_WITH_COMPANY_WIFI_PUBLIC_IP',  // e.g. '203.0.113.42'
  BOH_PASSWORD_HASH: 'REPLACE_WITH_SHA256_OF_BOH_PASSWORD',  // see note below
};

// To get the SHA-256 hash of your BOH password, open a browser console and run:
//   const b = new TextEncoder().encode('yourpassword');
//   crypto.subtle.digest('SHA-256', b).then(h =>
//     console.log(Array.from(new Uint8Array(h)).map(x=>x.toString(16).padStart(2,'0')).join(''))
//   );
// Paste the result above.

// ── Internal ─────────────────────────────────────────────────────────────────

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

const _DEV_MODE = {
  wifi: ZONE_CONFIG.WIFI_IP           === 'REPLACE_WITH_COMPANY_WIFI_PUBLIC_IP',
  boh:  ZONE_CONFIG.BOH_PASSWORD_HASH === 'REPLACE_WITH_SHA256_OF_BOH_PASSWORD',
};

async function _getPublicIP() {
  try {
    const r = await fetch('https://api.ipify.org?format=json');
    const d = await r.json();
    return d.ip;
  } catch (_) {
    return null;
  }
}

async function _isOnCompanyWifi() {
  if (_DEV_MODE.wifi) return true;
  const ip = await _getPublicIP();
  return ip === ZONE_CONFIG.WIFI_IP;
}

function _hasBOHSession() {
  if (_DEV_MODE.boh) return true;
  const stored = sessionStorage.getItem('boh_auth');
  return !!stored && stored === ZONE_CONFIG.BOH_PASSWORD_HASH;
}

// ── Public API ────────────────────────────────────────────────────────────────

async function checkZone(zone) {
  if (zone === 1) return;

  document.documentElement.style.visibility = 'hidden';

  try {
    const onWifi = await _isOnCompanyWifi();
    if (!onWifi) {
      sessionStorage.setItem('_auth_return', location.href);
      location.replace(window._AUTH_ROOT + 'gate-wifi.html');
      return;
    }

    if (zone === 3 && !_hasBOHSession()) {
      sessionStorage.setItem('_auth_return', location.href);
      location.replace(window._AUTH_ROOT + 'gate-boh.html');
      return;
    }
  } catch (_) { /* fail open on network errors */ }

  document.documentElement.style.visibility = '';
}

// Called from gate-boh.html
async function submitBOHPassword(password, onWrong) {
  const buf  = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');

  if (_DEV_MODE.boh || hash === ZONE_CONFIG.BOH_PASSWORD_HASH) {
    sessionStorage.setItem('boh_auth', hash);
    const ret = sessionStorage.getItem('_auth_return') || window._AUTH_ROOT + 'recipes/index.html';
    sessionStorage.removeItem('_auth_return');
    location.replace(ret);
  } else {
    onWrong();
  }
}
