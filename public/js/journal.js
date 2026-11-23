const jGrid = document.getElementById("journal-grid");

const sorted = DEMO_ARTICLES.slice().sort(function (a, b) {
  return b.date.localeCompare(a.date); // newest first
});

jGrid.innerHTML = sorted.map(function (a) {
  return '<li class="article-card">' +
    '<a href="journal-artikel.html?slug=' + a.slug + '">' +
      '<span class="article-thumb">Image (demo)</span>' +
      '<span class="article-meta">' + formatDate(a.date) + ' &middot; ' + a.category + '</span>' +
      '<span class="article-title">' + a.title + '</span>' +
      '<span class="article-intro">' + a.intro + '</span>' +
    '</a></li>';
}).join("");