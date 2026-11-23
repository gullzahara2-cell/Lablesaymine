const PAGE_CATEGORY = document.body.dataset.category; // e.g. "Dresses", or "NEW" for New In
const NEW_IN_DAYS = 30; // Q-03 default, to be confirmed by the client

// DEMO: how many days ago each product was published. Real data comes from the database later.
const DEMO_DAYS_AGO = { 1: 5, 2: 12, 3: 40, 4: 20, 5: 3, 6: 60 };

function daysAgo(p) {
  return DEMO_DAYS_AGO[p.id] !== undefined ? DEMO_DAYS_AGO[p.id] : 999;
}
function currentPrice(p) { return p.salePrice || p.price; }

const availEl = document.getElementById("f-avail");
const priceEl = document.getElementById("f-price");
const sortEl = document.getElementById("f-sort");
const grid = document.getElementById("cat-grid");
const countEl = document.getElementById("result-count");
const emptyBox = document.getElementById("empty-state");

if (PAGE_CATEGORY === "NEW") sortEl.value = "newest";

function cardHtml(p) {
  let badge = "";
  let priceHtml = formatEUR(p.price);
  if (p.soldOut) {
    badge = '<span class="badge badge-soldout">Sold out</span>';
  } else if (p.salePrice) {
    const percent = Math.round((1 - p.salePrice / p.price) * 100);
    badge = '<span class="badge badge-sale">-' + percent + '%</span>';
    priceHtml = '<s>' + formatEUR(p.price) + '</s> <strong>' + formatEUR(p.salePrice) + '</strong>';
  }
  return '<li class="product-card"><a href="product.html?id=' + p.id + '">' +
    '<span class="product-img">' + badge + productImageHtml(p) + '</span>' +
    '<span class="product-name">' + p.name + '</span>' +
    '<span class="product-price">' + priceHtml + '</span></a></li>';
}

function render() {
  let list = DEMO_PRODUCTS.filter(function (p) {
    if (PAGE_CATEGORY === "NEW") {
      if (daysAgo(p) > NEW_IN_DAYS) return false;
    } else if (p.category !== PAGE_CATEGORY) {
      return false;
    }
    const price = currentPrice(p);
    if (availEl.value === "in" && p.soldOut) return false;
    if (priceEl.value === "u50" && price >= 50) return false;
    if (priceEl.value === "50-75" && (price < 50 || price > 75)) return false;
    if (priceEl.value === "o75" && price <= 75) return false;
    return true;
  });

  if (sortEl.value === "newest") list.sort(function (a, b) { return daysAgo(a) - daysAgo(b); });
  if (sortEl.value === "low") list.sort(function (a, b) { return currentPrice(a) - currentPrice(b); });
  if (sortEl.value === "high") list.sort(function (a, b) { return currentPrice(b) - currentPrice(a); });

  grid.innerHTML = list.map(cardHtml).join("");
  countEl.textContent = list.length + (list.length === 1 ? " product" : " products");
  emptyBox.hidden = list.length !== 0;
}

[availEl, priceEl, sortEl].forEach(function (el) { el.addEventListener("change", render); });

document.getElementById("clear-filters").addEventListener("click", function () {
  availEl.value = "";
  priceEl.value = "";
  sortEl.value = PAGE_CATEGORY === "NEW" ? "newest" : "featured";
  render();
});

render();