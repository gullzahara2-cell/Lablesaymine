const express = require("express");
const path = require("path");const db = require("./db");

const app = express();
const PORT = process.env.PORT || 3000;

app.disable("x-powered-by");
app.use('/images', express.static(path.join(__dirname, "images")));
app.use(express.json({ limit: "100kb" }));

// Test route
app.get("/api/health", function (req, res) {
  res.json({ status: "ok" });
});
app.get("/api/products", function (req, res) {
  const rows = db.prepare(`
    SELECT p.id, p.slug, p.name, p.category, p.price_cents, p.sale_price_cents, p.published_at,
           (SELECT COALESCE(SUM(stock), 0) FROM variants v WHERE v.product_id = p.id) AS total_stock
    FROM products p
    ORDER BY p.id
  `).all();

  res.json(rows.map(function (r) {
    return {
      id: r.id,
      slug: r.slug,
      name: r.name,
      category: r.category,
      price: r.price_cents / 100,
      salePrice: r.sale_price_cents === null ? null : r.sale_price_cents / 100,
      soldOut: r.total_stock === 0,
      publishedAt: r.published_at
    };
  }));
});

app.get("/api/products/:slug", function (req, res) {
  const p = db.prepare("SELECT * FROM products WHERE slug = ?").get(req.params.slug);
  if (!p) return res.status(404).json({ error: "Not found" });

  const variants = db.prepare(
    "SELECT size, colour, stock FROM variants WHERE product_id = ? ORDER BY id"
  ).all(p.id);

  res.json({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price_cents / 100,
    salePrice: p.sale_price_cents === null ? null : p.sale_price_cents / 100,
    variants: variants.map(function (v) {
      return { size: v.size, colour: v.colour, inStock: v.stock > 0 };
    })
  });
});

// Only the public folder is served to the internet
app.use(express.static(path.join(__dirname, "public")));

// Real 404 status (requirement from the PDF)
app.use(function (req, res) {
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

app.listen(PORT, function (err) {
  if (err) {
    console.error("Server could not start:", err.message);
    process.exit(1);
  }
  console.log("LABELSAYMINE server running at http://localhost:" + PORT);
});
