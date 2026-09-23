/* Shared across Sure Imports sites. No persistent identifier without analytics consent. */
(function () {
  'use strict';
  if (window.__sureImportsWhatsAppTracking) return;
  window.__sureImportsWhatsAppTracking = true;
  var sites = ['sureimports.com', 'www.sureimports.com', 'linescout.sureimports.com', 'affiliate.sureimports.com', 'partner.sureimports.com'];
  if (sites.indexOf(location.hostname) === -1) return;
  var last = new Map();
  var landingQuery = new URLSearchParams(location.search);
  var initialSource = clean(landingQuery.get('utm_source'));
  var initialCampaign = clean(landingQuery.get('utm_campaign'));
  if (!initialSource && document.referrer) {
    try { var referringHost = new URL(document.referrer).hostname; if (referringHost !== location.hostname) initialSource = clean(referringHost); } catch (_) {}
  }
  function consent() {
    try {
      var partner = JSON.parse(localStorage.getItem('sure-imports-partner-consent-v1') || 'null');
      return document.cookie.split('; ').includes('consent=true') ||
        localStorage.getItem('sure-imports-affiliate-cookie-consent') === 'analytics' ||
        !!(partner && partner.version === 1 && partner.choice === 'analytics' && partner.expiresAt > Date.now());
    } catch (_) { return false; }
  }
  function clean(value) { return /^[\w .-]{1,80}$/.test(value || '') ? value : ''; }
  function track(event) {
    if (!event.isTrusted || (event.type === 'auxclick' && event.button !== 1)) return;
    var anchor = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!anchor) return;
    var url;
    try { url = new URL(anchor.href); } catch (_) { return; }
    if (url.hostname !== 'wa.me' && url.hostname !== 'api.whatsapp.com') return;
    var destination = url.hostname === 'wa.me' ? url.pathname.replace(/^\/+|\/+$/g, '') : (url.searchParams.get('phone') || '').replace(/\D/g, '');
    if (!/^(?:\d{8,15}|message\/[A-Za-z0-9]+)$/.test(destination)) return;
    if (['447881194138','2348037649956','message/CUR7YKW3K3RBA1'].indexOf(destination) === -1 && !anchor.hasAttribute('data-whatsapp-contact')) return;
    var key = location.pathname + ':' + destination;
    if (Date.now() - (last.get(key) || 0) < 2000) return;
    last.set(key, Date.now());
    var id = crypto.randomUUID();
    var session = null;
    var source = '', campaign = '';
    if (consent()) {
      try {
        var stored = JSON.parse(sessionStorage.getItem('si-wa-session') || 'null');
        if (!stored || Date.now() - stored.at > 1800000) stored = { id: crypto.randomUUID() };
        stored.at = Date.now();
        var query = new URLSearchParams(location.search);
        stored.source = clean(query.get('utm_source')) || stored.source || initialSource;
        stored.campaign = clean(query.get('utm_campaign')) || stored.campaign || initialCampaign;
        sessionStorage.setItem('si-wa-session', JSON.stringify(stored));
        session = stored.id;
        source = clean(stored.source);
        campaign = clean(stored.campaign);
      } catch (_) {}
    }
    var placement = anchor.closest('[data-whatsapp-placement]');
    var payload = JSON.stringify({ id: id, path: location.pathname.replace(/[^a-zA-Z0-9/_-]/g, '').slice(0,250), destination: destination,
      placement: placement ? placement.getAttribute('data-whatsapp-placement') : anchor.closest('footer') ? 'footer' : 'page',
      device: matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop', session: session, source: source, campaign: campaign });
    // Phone links support editable prefilled text; business short links may not.
    if (/^\d/.test(destination)) {
      var text = (url.searchParams.get('text') || 'Hello, I would like to make an enquiry.').replace(/\s*Reference: WA-[a-f0-9-]{36}/gi, '');
      url.searchParams.set('text', text + '\nReference: WA-' + id);
      anchor.href = url.toString();
    }
    var endpoint = 'https://www.sureimports.com/api/marketing/whatsapp-click';
    try {
      if (!navigator.sendBeacon || !navigator.sendBeacon(endpoint, new Blob([payload], { type: 'text/plain' }))) {
        fetch(endpoint, { method: 'POST', body: payload, credentials: 'omit', keepalive: true, headers: { 'Content-Type': 'text/plain' } }).catch(function () {});
      }
    } catch (_) { /* Never interrupt the contact action. */ }
  }
  document.addEventListener('click', track, true);
  document.addEventListener('auxclick', track, true);
})();
