// Injects the shared header and footer. data-base is "" on index.html and "../" inside /pages/
const BASE = document.currentScript.dataset.base || "";

const headerHtml = `
  <div class="announcement" role="region" aria-label="Store announcements">
    <p id="announcement-text">Free shipping from EUR 75 (NL)</p>
  </div>
  <header class="site-header">
    <div class="header-inner">
      <button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Open menu">Menu</button>
      <a href="${BASE}index.html" class="logo">LABELSAYMINE</a>
      <nav id="main-nav" class="main-nav" aria-label="Main navigation">
        <ul>
          <li><a href="${BASE}index.html">Home</a></li>
          <li class="has-sub">
            <a href="${BASE}pages/winkel.html">Shop</a>
            <ul class="submenu">
              <li><a href="${BASE}pages/winkel.html?category=Dresses">Dresses</a></li>
              <li><a href="${BASE}pages/winkel.html?category=Knitwear">Knitwear</a></li>
              <li><a href="${BASE}pages/winkel.html?category=Co-ord Sets">Co-ord Sets</a></li>
              <li><a href="${BASE}pages/winkel.html?category=Abayas">Abayas</a></li>
              <li><a href="${BASE}pages/winkel.html?category=Skirts">Skirts</a></li>
            </ul>
          </li>
          <li><a href="${BASE}pages/nieuw.html">New In</a></li>
          <li><a href="${BASE}pages/over-ons.html">About</a></li>
          <li><a href="${BASE}pages/journal.html">Journal</a></li>
          <li><a href="${BASE}pages/contact.html">Contact</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <a href="${BASE}pages/zoeken.html">Search</a>
        <a href="${BASE}pages/mijn-account.html">Account</a>
        <a href="${BASE}pages/winkelwagen.html">Cart (<span id="cart-count">0</span>)</a>
      </div>
    </div>
  </header>`;

const footerHtml = `
  <footer class="site-footer">
    <div class="footer-inner">
      <div>
        <h3>Shop</h3>
        <ul>
          <li><a href="${BASE}pages/winkel.html">Shop</a></li>
          <li><a href="${BASE}pages/nieuw.html">New In</a></li>
          <li><a href="${BASE}pages/winkel.html?category=Dresses">Dresses</a></li>
          <li><a href="${BASE}pages/winkel.html?category=Abayas">Abayas</a></li>
        </ul>
      </div>
      <div>
        <h3>Help</h3>
        <ul>
          <li><a href="${BASE}pages/veelgestelde-vragen.html">FAQ</a></li>
          <li><a href="${BASE}pages/verzending.html">Shipping</a></li>
          <li><a href="${BASE}pages/retourneren.html">Returns</a></li>
          <li><a href="${BASE}pages/maattabel.html">Size Guide</a></li>
          <li><a href="${BASE}pages/contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h3>About</h3>
        <ul>
          <li><a href="${BASE}pages/over-ons.html">About us</a></li>
          <li><a href="${BASE}pages/journal.html">Journal</a></li>
        </ul>
      </div>
      <div>
        <h3>Business details</h3>
        <p>PLACEHOLDER: legal name, address, KvK and BTW numbers, contact email will be supplied by the client.</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>Payment methods: iDEAL (more to be confirmed)</p>
      <ul>
        <li><a href="${BASE}pages/privacybeleid.html">Privacy</a></li>
        <li><a href="${BASE}pages/algemene-voorwaarden.html">Terms</a></li>
        <li><a href="${BASE}pages/cookiebeleid.html">Cookies</a></li>
      </ul>
      <p>&copy; LABELSAYMINE (demo site)</p>
    </div>
  </footer>`;

document.getElementById("site-header").innerHTML = headerHtml;
document.getElementById("site-footer").innerHTML = footerHtml;
const cookieScript = document.createElement("script");
cookieScript.src = BASE + "js/cookies.js";
document.body.appendChild(cookieScript)