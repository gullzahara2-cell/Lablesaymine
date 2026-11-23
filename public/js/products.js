// DEMO DATA ONLY - replace with real products when the client supplies them
const DEMO_PRODUCTS = [
  { id: 1, name: "Demo Maxi Dress",   category: "Dresses",     price: 79.95, salePrice: null,  soldOut: false, images: [{ file: "dress.jpg", alt: "Demo maxi dress" }] },
  { id: 2, name: "Demo Knit Sweater", category: "Knitwear",    price: 59.95, salePrice: 47.95, soldOut: false, images: [{ file: "knit.jpg", alt: "Demo knit sweater" }] },
  { id: 3, name: "Demo Co-ord Set",   category: "Co-ord Sets", price: 89.95, salePrice: null,  soldOut: false, images: [{ file: "kurta-1-1200.webp.jpg", alt: "Demo co-ord set" }] },
  { id: 4, name: "Demo Wrap Abaya",   category: "Abayas",      price: 69.95, salePrice: null,  soldOut: true,  images: [{ file: "abay.jpg", alt: "Demo wrap abaya" }] },
  { id: 5, name: "Demo Pleated Skirt", category: "Skirts",     price: 49.95, salePrice: 39.95, soldOut: false, images: [{ file: "abaya.jpg", alt: "Demo pleated skirt" }] },
  { id: 6, name: "Demo Linen Dress",  category: "Dresses",     price: 74.95, salePrice: null,  soldOut: false, images: [{ file: "ababya-600.jpg", alt: "Demo linen dress" }] }
];

function formatEUR(amount) {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount);
}