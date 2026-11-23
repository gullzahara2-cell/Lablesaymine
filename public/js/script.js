// ----- Image helpers (used on every page) -----
function escapeAttr(text) {
  return String(text).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function imageDir() {
  return ((typeof BASE !== "undefined") ? BASE : "") + "products/";
}

function productImageHtml(p, opts) {
  const o = opts || {};
  const first = p.images && p.images[0];
  if (!first) return "Image (demo)";
  const dir = imageDir();
  const src = first.file ? dir + first.file : dir + first.base + "-600.webp";
  const srcset = first.file
    ? ""
    : 'srcset="' + dir + first.base + '-600.webp 600w, ' + dir + first.base + '-1200.webp 1200w" ';
  return '<img src="' + src + '" ' + srcset +
    'sizes="' + (o.sizes || "(max-width: 860px) 50vw, 33vw") + '" ' +
    'alt="' + escapeAttr(first.alt || p.name) + '" width="600" height="800" ' +
    (o.eager ? 'fetchpriority="high"' : 'loading="lazy"') + '>';
}
// 1) Mobile menu open/close
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", function () {
    const isOpen = mainNav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.textContent = isOpen ? "Close" : "Menu";
  });
}

// 2) Rotating announcement bar (messages from the requirements PDF)
const messages = [
  "Free shipping from EUR 75 (NL)",
  "Dispatch within 24 hours",
  "14-day returns",
  "Secure payment via iDEAL"
];
const announcementText = document.getElementById("announcement-text");
let msgIndex = 0;
const prefersReducedMotion = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let paused = Boolean(prefersReducedMotion);

const announcementBar = document.querySelector(".announcement");
if (announcementText) {
  setInterval(function () {
    if (paused) return;
    msgIndex = (msgIndex + 1) % messages.length;
    announcementText.textContent = messages[msgIndex];
  }, 4000);
}

if (announcementBar) {
  const pauseBtn = document.createElement("button");
  pauseBtn.type = "button";
  pauseBtn.className = "announce-pause";
  pauseBtn.textContent = paused ? "Play" : "Pause";
  pauseBtn.setAttribute("aria-label", "Pause or play the rotating announcements");
  pauseBtn.addEventListener("click", function () {
    paused = !paused;
    pauseBtn.textContent = paused ? "Play" : "Pause";
  });
  announcementBar.appendChild(pauseBtn);
}

// 3) Cart count (demo: reads from browser storage)
function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (!cartCount) return;

  let cart = [];
  try {
    const storedCart = JSON.parse(localStorage.getItem("labelsaymine_cart"));
    cart = Array.isArray(storedCart) ? storedCart : [];
  } catch (e) {
    cart = [];
  }
  const total = cart.reduce(function (sum, item) {
    const quantity = Number(item && item.qty);
    return sum + (Number.isFinite(quantity) && quantity > 0 ? quantity : 0);
  }, 0);
  cartCount.textContent = total;
}
updateCartCount();

// 4) Featured products (demo)
function renderFeatured() {
  const grid = document.getElementById("featured-grid");
  if (!grid) return;

  grid.innerHTML = DEMO_PRODUCTS.map(function (p) {
    let badge = "";
    let priceHtml = formatEUR(p.price);

    if (p.soldOut) {
      badge = '<span class="badge badge-soldout">Sold out</span>';
    } else if (p.salePrice) {
      const percent = Math.round((1 - p.salePrice / p.price) * 100);
      badge = '<span class="badge badge-sale">-' + percent + '%</span>';
      priceHtml = '<s>' + formatEUR(p.price) + '</s> <strong>' + formatEUR(p.salePrice) + '</strong>';
    }

    return '<li class="product-card">' +
      '<a href="pages/product.html?id=' + p.id + '">' +
        '<span class="product-img">' + badge + productImageHtml(p) + '</span>' +
        '<span class="product-name">' + p.name + '</span>' +
        '<span class="product-price">' + priceHtml + '</span>' +
      '</a></li>';
  }).join("");
}
renderFeatured();
// 5) Newsletter form (DEMO: validates only, nothing is sent or saved)
const newsForm = document.getElementById("newsletter-form");
if (newsForm) {
  newsForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("news-email");
    const consent = document.getElementById("news-consent");
    const msg = document.getElementById("news-message");

    if (!email.value || !email.checkValidity()) {
      msg.textContent = "Please enter a valid email address.";
      msg.className = "form-error";
      email.focus();
      return;
    }
    if (!consent.checked) {
      msg.textContent = "Please tick the consent box to subscribe.";
      msg.className = "form-error";
      consent.focus();
      return;
    }
    msg.textContent = "Demo only: no email was saved. Real double opt-in comes with the backend.";
    msg.className = "form-ok";
    newsForm.reset();
  });
}