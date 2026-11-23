const catEl = document.getElementById("f-category");
const availEl = document.getElementById("f-avail");
const priceEl = document.getElementById("f-price");
const sortEl = document.getElementById("f-sort");
const shopGrid = document.getElementById("shop-grid");
const countEl = document.getElementById("result-count");
const emptyEl = document.getElementById("empty-state");

// Category from the URL, e.g. winkel.html?category=Dresses
const urlCategory = new URLSearchParams(location.search).get("category");
if (urlCategory) {
  catEl.value = urlCategory;
  if (catEl.selectedIndex === -1) catEl.value = "";
}

function currentPrice(p) { return p.salePrice || p.price; }

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

function renderShop() {
  let list = DEMO_PRODUCTS.filter(function (p) {
    const price = currentPrice(p);
    if (catEl.value && p.category !== catEl.value) return false;
    if (availEl.value === "in" && p.soldOut) return false;
    if (priceEl.value === "u50" && price >= 50) return false;
    if (priceEl.value === "50-75" && (price < 50 || price > 75)) return false;
    if (priceEl.value === "o75" && price <= 75) return false;
    return true;
  });

  if (sortEl.value === "newest") list.sort(function (a, b) { return b.id - a.id; });
  if (sortEl.value === "low") list.sort(function (a, b) { return currentPrice(a) - currentPrice(b); });
  if (sortEl.value === "high") list.sort(function (a, b) { return currentPrice(b) - currentPrice(a); });

  shopGrid.innerHTML = list.map(cardHtml).join("");
  countEl.textContent = list.length + (list.length === 1 ? " product" : " products");
  emptyEl.hidden = list.length !== 0;
}

[catEl, availEl, priceEl, sortEl].forEach(function (el) {
  el.addEventListener("change", renderShop);
});

document.getElementById("clear-filters").addEventListener("click", function () {
  catEl.value = "";
  availEl.value = "";
  priceEl.value = "";
  sortEl.value = "featured";
  renderShop();
});
fetch("/api/products")
  .then(function (r) { return r.json(); })
  .then(function (list) {
    // keep the test photos, which are still defined locally for now
    list.forEach(function (p) {
      const local = DEMO_PRODUCTS.find(function (d) { return d.id === p.id; });
      if (local && local.images) p.images = local.images;
    });
    DEMO_PRODUCTS.length = 0;
    list.forEach(function (p) { DEMO_PRODUCTS.push(p); });
    renderShop();
  })
  .catch(function () { renderShop(); });