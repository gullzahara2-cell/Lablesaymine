// DEMO ARTICLES ONLY. Real articles are supplied by the client.
const DEMO_ARTICLES = [
  {
    slug: "demo-artikel-1",
    title: "Demo article one (PLACEHOLDER)",
    date: "2026-10-01",
    category: "Demo category A",
    intro: "PLACEHOLDER: short introduction supplied by the client.",
    body: [
      "PLACEHOLDER: first paragraph of the article, supplied by the client.",
      "PLACEHOLDER: second paragraph of the article, supplied by the client."
    ],
    productIds: [1, 5]
  },
  {
    slug: "demo-artikel-2",
    title: "Demo article two (PLACEHOLDER)",
    date: "2026-09-15",
    category: "Demo category B",
    intro: "PLACEHOLDER: short introduction supplied by the client.",
    body: [
      "PLACEHOLDER: first paragraph of the article, supplied by the client."
    ],
    productIds: [2]
  },
  {
    slug: "demo-artikel-3",
    title: "Demo article three (PLACEHOLDER)",
    date: "2026-08-20",
    category: "Demo category A",
    intro: "PLACEHOLDER: short introduction supplied by the client.",
    body: [
      "PLACEHOLDER: first paragraph of the article, supplied by the client."
    ],
    productIds: []
  }
];

function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric"
  });
}