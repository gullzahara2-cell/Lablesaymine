(function () {
  if (window.__consentInit) return;
  window.__consentInit = true;

  const KEY = "labelsaymine_consent";
  const base = (typeof BASE !== "undefined") ? BASE : "";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)); }
    catch (e) { return null; }
  }

  function loadAnalytics() {
    // LATER: GA4 (or the agreed tool) is loaded here and ONLY here, after consent.
  }

  function apply() {
    const c = read();
    if (c && c.analytics) loadAnalytics();
  }

  function save(analytics) {
    try {
      localStorage.setItem(KEY, JSON.stringify({
        necessary: true,
        analytics: analytics,
        savedAt: new Date().toISOString()
      }));
    } catch (e) {}
    apply();
    banner.hidden = true;
  }

  // Other scripts can ask: labelsaymineConsent.allowed("analytics")
  window.labelsaymineConsent = {
    allowed: function (type) { const c = read(); return !!(c && c[type]); }
  };

  // ----- Banner (DEMO Dutch wording, to be approved by the client) -----
  const banner = document.createElement("div");
  banner.className = "cookie-banner";
  banner.setAttribute("role", "dialog");
  banner.setAttribute("aria-labelledby", "cookie-title");
  banner.setAttribute("tabindex", "-1");
  banner.hidden = true;
  banner.innerHTML =
    '<h2 id="cookie-title">Cookies</h2>' +
    '<p>Wij gebruiken noodzakelijke cookies om de website te laten werken. ' +
    'Met jouw toestemming gebruiken we ook analytische cookies. ' +
    'Lees meer in ons <a href="' + base + 'pages/cookiebeleid.html">cookiebeleid</a>.</p>' +
    '<div id="cookie-settings" class="cookie-settings" hidden>' +
      '<label class="radio-row"><input type="checkbox" checked disabled> Noodzakelijk (altijd aan)</label>' +
      '<label class="radio-row"><input type="checkbox" id="cookie-analytics"> Analytisch</label>' +
      '<button type="button" class="cookie-btn" id="cookie-save">Opslaan</button>' +
    '</div>' +
    '<div class="cookie-actions">' +
      '<button type="button" class="cookie-btn" id="cookie-accept">Alles accepteren</button>' +
      '<button type="button" class="cookie-btn" id="cookie-reject">Alles weigeren</button>' +
      '<button type="button" class="cookie-link" id="cookie-open-settings" aria-expanded="false">Instellingen</button>' +
    '</div>';
  document.body.appendChild(banner);

  const settingsBox = banner.querySelector("#cookie-settings");
  const analyticsBox = banner.querySelector("#cookie-analytics");
  const settingsBtn = banner.querySelector("#cookie-open-settings");

  banner.querySelector("#cookie-accept").addEventListener("click", function () { save(true); });
  banner.querySelector("#cookie-reject").addEventListener("click", function () { save(false); });
  banner.querySelector("#cookie-save").addEventListener("click", function () { save(analyticsBox.checked); });
  settingsBtn.addEventListener("click", function () {
    const open = settingsBox.hidden;
    settingsBox.hidden = !open;
    settingsBtn.setAttribute("aria-expanded", String(open));
  });

  function openBanner() {
    const c = read();
    analyticsBox.checked = !!(c && c.analytics);
    banner.hidden = false;
    banner.focus();
  }

  // Footer link to change the choice later
  const footerList = document.querySelector(".footer-bottom ul");
  if (footerList) {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cookie-link footer-cookie-link";
    b.textContent = "Cookie-instellingen";
    b.addEventListener("click", function () {
      settingsBox.hidden = false;
      settingsBtn.setAttribute("aria-expanded", "true");
      openBanner();
    });
    li.appendChild(b);
    footerList.appendChild(li);
  }

  if (read()) apply(); else openBanner();
})();