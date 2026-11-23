// DEMO DATA ONLY. Real products come from the client.
const db = require("./db");

const count = db.prepare("SELECT COUNT(*) AS n FROM products").get().n;
if (count > 0) {
  console.log("Database already has products. Nothing to do.");
  process.exit(0);
}

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLOURS = ["Ivory", "Sand", "Stone"];

const PRODUCTS = [
  { id: 1, slug: "demo-maxi-dress",    name: "Demo Maxi Dress",    cat: "Dresses",     price: 7995, sale: null, out: false, days: 5 },
  { id: 2, slug: "demo-knit-sweater",  name: "Demo Knit Sweater",  cat: "Knitwear",    price: 5995, sale: 4795, out: false, days: 12 },
  { id: 3, slug: "demo-co-ord-set",    name: "Demo Co-ord Set",    cat: "Co-ord Sets", price: 8995, sale: null, out: false, days: 40 },
  { id: 4, slug: "demo-wrap-abaya",    name: "Demo Wrap Abaya",    cat: "Abayas",      price: 6995, sale: null, out: true,  days: 20 },
  { id: 5, slug: "demo-pleated-skirt", name: "Demo Pleated Skirt", cat: "Skirts",      price: 4995, sale: 3995, out: false, days: 3 },
  { id: 6, slug: "demo-linen-dress",   name: "Demo Linen Dress",   cat: "Dresses",     price: 7495, sale: null, out: false, days: 60 }
];

const addProduct = db.prepare(
  "INSERT INTO products (id, slug, name, category, price_cents, sale_price_cents, published_at, is_demo) VALUES (?, ?, ?, ?, ?, ?, ?, 1)"
);
const addVariant = db.prepare(
  "INSERT INTO variants (product_id, size, colour, stock) VALUES (?, ?, ?, ?)"
);

const run = db.transaction(function () {
  PRODUCTS.forEach(function (p) {
    const published = new Date(Date.now() - p.days * 86400000).toISOString();
    addProduct.run(p.id, p.slug, p.name, p.cat, p.price, p.sale, published);
    SIZES.forEach(function (s, si) {
      COLOURS.forEach(function (c, ci) {
        const out = p.out || (p.id + si + ci) % 4 === 0;
        addVariant.run(p.id, s, c, out ? 0 : 5);
      });
    });
  });
});

run();
console.log("Demo products added.");