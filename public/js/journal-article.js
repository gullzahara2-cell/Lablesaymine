const root = document.getElementById("article-root");
const slug = new URLSearchParams(location.search).get("slug");
const art = DEMO_ARTICLES.find(function (a) { return a.slug === slug; });

if (!art) {
  root.innerHTML = '<h1 class="page-title">Article not found</h1>' +
    '<p style="text-align:center"><a class="btn btn-outline" href="journal.html">Back to the Journal</a></p>';
} else {
  document.title = art.title + " | LABELSAYMINE (Demo)";

  // Update the meta tags (real per-article sharing tags come from the server later)
  function setMeta(selector, value) {
    const el = document.querySelector(selector);
    if (el) el.setAttribute("content", value);
  }
  setMeta('meta[name="description"]', art.intro);

  const ogTitle = document.createElement("meta");
  ogTitle.setAttribute("property", "og:title");
  ogTitle.setAttribute("content", art.title);
  document.head.appendChild(ogTitle);

  const h1 = document.createElement("h1");
  h1.className = "page-title";
  h1.textContent = art.title;

  const meta = document.createElement("p");
  meta.className = "article-meta center";
  meta.textContent = formatDate(art.date) + " \u00B7 " + art.category;

  root.appendChild(h1);
  root.appendChild(meta);

  art.body.forEach(function (text) {
    const p = document.createElement("p");
    p.textContent = text;
    root.appendChild(p);
  });

  const products = art.productIds.map(function (id) {
    return DEMO_PRODUCTS.find(function (p) { return p.id === id; });
  }).filter(Boolean);

  if (products.length) {
    const h2 = document.createElement("h2");
    h2.className = "sub-title";
    h2.textContent = "Shop this article";
    root.appendChild(h2);

    const ul = document.createElement("ul");
    ul.className = "cat-links";
    products.forEach(function (p) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.className = "btn btn-outline";
      a.href = "product.html?id=" + p.id;
      a.textContent = p.name;
      li.appendChild(a);
      ul.appendChild(li);
    });
    root.appendChild(ul);
  }

  const back = document.createElement("p");
  back.innerHTML = '<a class="btn btn-outline" href="journal.html">Back to the Journal</a>';
  root.appendChild(back);
}