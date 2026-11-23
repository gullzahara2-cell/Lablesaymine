const params = new URLSearchParams(location.search);
const query = (params.get("q") || "").trim();
document.getElementById("search-input").value = query;

const CATEGORY_PAGES = [
  { name: "Dresses", url: "jurken.html" },
  { name: "Knitwear", url: "breisels.html" },
  { name: "Co-ord Sets", url: "co-ord-sets.html" },
  { name: "Abayas", url: "abayas.html" },
  { name: "Skirts", url: "rokken.html" },
  { name: "New In", url: "nieuw.html" }
];

function words(text) {
  return text.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
}

function editDistance(a, b) {
  const dp = [];
  for (let i = 0; i <= a.length; i++) { dp[i] = [i]; }
  for (let j = 0; j <= b.length; j++) { dp[0][j] = j; }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
}

function termMatches(term, textWords) {
  return textWords.some(function (w) {
    if (w.indexOf(term) !== -1) return true;                       // "dres" finds "dress"
    if (w.length >= 4 && term.indexOf(w) !== -1) return true;      // "dresses" finds "dress"
    if (term.length >= 4 && Math.abs(w.length - term.length) <= 1) {
      return editDistance(term, w) <= 1;                           // one-letter typo
    }
    return false;
  });
}

function matches(text, terms) {
  const w = words(text);
  return terms.every(function (t) { return termMatches(t, w); });
}

function linkItem(name, url) {
  const li = document.createElement("li");
  const a = document.createElement("a");
  a.href = url;
  a.className = "btn btn-outline";
  a.textContent = name;
  li.appendChild(a);
  return li;
}

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

const status = document.getElementById("search-status");
const noBox = document.getElementById("no-results");

function showPopular() {
  const list = document.getElementById("popular-list");
  CATEGORY_PAGES.forEach(function (c) { list.appendChild(linkItem(c.name, c.url)); });
  noBox.hidden = false;
}

if (!query) {
  status.textContent = "Type a word to search.";
} else {
  const terms = words(query);

  const prodHits = DEMO_PRODUCTS.filter(function (p) {
    return matches(p.name + " " + p.category, terms);
  });
  const catHits = CATEGORY_PAGES.filter(function (c) { return matches(c.name, terms); });
const articleHits = (typeof DEMO_ARTICLES !== "undefined")
  ? DEMO_ARTICLES.filter(function (a) { return matches(a.title + " " + a.category, terms); })
  : [];
if (articleHits.length) {
  const aList = document.getElementById("art-list");
  articleHits.forEach(function (a) {
    aList.appendChild(linkItem(a.title, "journal-artikel.html?slug=" + a.slug));
  });
  document.getElementById("art-results").hidden = false;
}
  const total = prodHits.length + catHits.length + articleHits.length;
  // The query is shown with textContent, never as HTML.
  status.textContent = total + (total === 1 ? " result" : " results") + ' for "' + query + '"';

  if (catHits.length) {
    const list = document.getElementById("cat-list");
    catHits.forEach(function (c) { list.appendChild(linkItem(c.name, c.url)); });
    document.getElementById("cat-results").hidden = false;
  }
  if (prodHits.length) {
    document.getElementById("search-grid").innerHTML = prodHits.map(cardHtml).join("");
    document.getElementById("prod-results").hidden = false;
  }
  if (total === 0) showPopular();
}