// DEMO variants: every product gets sizes x colours with demo stock.
const SIZES = ["XS", "S", "M", "L", "XL"];
const COLOURS = ["Ivory", "Sand", "Stone"];

function buildVariants(p) {
  const list = [];
  SIZES.forEach(function (size, si) {
    COLOURS.forEach(function (colour, ci) {
      const out = p.soldOut || (p.id + si + ci) % 4 === 0;
      list.push({ size: size, colour: colour, stock: out ? 0 : 5 });
    });
  });
  return list;
}

const productId = Number(new URLSearchParams(location.search).get("id"));
const product = DEMO_PRODUCTS.find(function (p) { return p.id === productId; });
const root = document.getElementById("product-root");

if (!product) {
  root.innerHTML = '<p>Product not found.</p><a class="btn btn-outline" href="winkel.html">Back to shop</a>';
} else {
  renderProduct();
  renderRelated();
}
addProductSchema();

function renderProduct() {
  const variants = buildVariants(product);
  let selSize = "";
  let selColour = "";

  document.title = product.name + " | LABELSAYMINE (Demo)";
  document.getElementById("crumb-name").textContent = product.name;

  let badge = "";
  let priceHtml = formatEUR(product.price);
  if (product.soldOut) {
    badge = '<span class="badge badge-soldout">Sold out</span>';
  } else if (product.salePrice) {
    const percent = Math.round((1 - product.salePrice / product.price) * 100);
    badge = '<span class="badge badge-sale">-' + percent + '%</span>';
    priceHtml = '<s>' + formatEUR(product.price) + '</s> <strong>' + formatEUR(product.salePrice) + '</strong>';
  }

  root.innerHTML =
    '<div class="product-layout">' +
      '<div class="product-gallery' + (product.images && product.images.length ? ' has-images' : '') + '">' + badge + galleryHtml(product) + '</div>' +
      '<div class="product-info">' +
        '<h1>' + product.name + '</h1>' +
        '<p class="product-price-big">' + priceHtml + ' <small>incl. btw</small></p>' +
        '<p>Demo description. Real product text will be supplied by the client.</p>' +
        '<p class="opt-label">Size</p><div id="size-options" class="options"></div>' +
        '<p class="opt-label">Colour</p><div id="colour-options" class="options"></div>' +
        '<label class="opt-label" for="qty">Quantity</label>' +
        '<input type="number" id="qty" value="1" min="1" max="5">' +
        '<p id="stock-msg" class="stock-msg" role="status" aria-live="polite"></p>' +
        '<button type="button" class="btn btn-primary" id="add-btn"' + (product.soldOut ? ' disabled' : '') + '>Add to cart</button>' +
        '<p class="small-note">Delivery estimate: to be confirmed by the client.<br>' +
        '14-day returns. <a href="maattabel.html">Size guide</a></p>' +
        '<div class="accordion">' +
          '<details><summary>Description</summary><p>Demo text. Product description will be supplied by the client.</p></details>' +
          '<details><summary>Fabric &amp; Care</summary><p>PLACEHOLDER: fabric composition and care instructions will be supplied by the client.</p></details>' +
          '<details><summary>Fit &amp; Modest Coverage</summary><p>PLACEHOLDER: fit and coverage notes will be supplied by the client.</p></details>' +
          '<details><summary>Shipping &amp; Returns</summary><p>14-day returns. Return postage payer, refund timing and return address: to be confirmed by the client.</p></details>' +
        '</div>' +
      '</div>' +
    '</div>';

  const sizeBox = document.getElementById("size-options");
  const colourBox = document.getElementById("colour-options");
  const msg = document.getElementById("stock-msg");
  const qtyEl = document.getElementById("qty");
  wireGallery(product);

  function stockOf(size, colour) {
    return variants.find(function (v) { return v.size === size && v.colour === colour; }).stock;
  }

  function say(text, isError) {
    msg.textContent = text;
    msg.className = "stock-msg " + (isError ? "form-error" : "form-ok");
  }

  function makeButtons(box, values, kind) {
    box.innerHTML = "";
    values.forEach(function (value) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "option-btn";
      b.textContent = value;
      b.addEventListener("click", function () {
        if (kind === "size") selSize = value; else selColour = value;
        refresh();
      });
      box.appendChild(b);
    });
  }

  function refresh() {
    Array.prototype.forEach.call(sizeBox.children, function (b) {
      const size = b.textContent;
      const out = selColour
        ? stockOf(size, selColour) === 0
        : COLOURS.every(function (c) { return stockOf(size, c) === 0; });
      b.disabled = out;
      b.title = out ? "Sold out" : "";
      b.setAttribute("aria-pressed", String(selSize === size));
    });
    Array.prototype.forEach.call(colourBox.children, function (b) {
      const colour = b.textContent;
      const out = selSize
        ? stockOf(selSize, colour) === 0
        : SIZES.every(function (s) { return stockOf(s, colour) === 0; });
      b.disabled = out;
      b.title = out ? "Sold out" : "";
      b.setAttribute("aria-pressed", String(selColour === colour));
    });
    if (product.soldOut) say("Sold out", true);
    else if (selSize && selColour) say("In stock (demo): " + selSize + ", " + selColour, false);
    else msg.textContent = "";
  }

  makeButtons(sizeBox, SIZES, "size");
  makeButtons(colourBox, COLOURS, "colour");
  refresh();

  document.getElementById("add-btn").addEventListener("click", function () {
    if (!selSize) { say("Please choose a size.", true); return; }
    if (!selColour) { say("Please choose a colour.", true); return; }
    const stock = stockOf(selSize, selColour);
    if (stock === 0) { say("This variant is sold out.", true); return; }

    let qty = parseInt(qtyEl.value, 10);
    if (!qty || qty < 1) qty = 1;

    let cart = [];
    try { cart = JSON.parse(localStorage.getItem("labelsaymine_cart")) || []; } catch (e) { cart = []; }

    const line = cart.find(function (i) {
      return i.id === product.id && i.size === selSize && i.colour === selColour;
    });
    if (line) {
      line.qty = Math.min(line.qty + qty, stock);
    } else {
      cart.push({
        id: product.id, name: product.name, size: selSize, colour: selColour,
        price: product.salePrice || product.price, qty: Math.min(qty, stock)
      });
    }
    try { localStorage.setItem("labelsaymine_cart", JSON.stringify(cart)); } catch (e) {}
    updateCartCount();
    say("Added to cart.", false);
  });
}

function renderRelated() {
  let list = DEMO_PRODUCTS.filter(function (p) {
    return p.id !== product.id && p.category === product.category;
  });
  if (list.length < 3) {
    DEMO_PRODUCTS.forEach(function (p) {
      if (p.id !== product.id && list.indexOf(p) === -1 && list.length < 3) list.push(p);
    });
  }
  document.getElementById("related-grid").innerHTML = list.slice(0, 3).map(function (p) {
    return '<li class="product-card"><a href="product.html?id=' + p.id + '">' +
      '<span class="product-img">' + productImageHtml(p) + '</span>' +
      '<span class="product-name">' + p.name + '</span>' +
      '<span class="product-price">' + formatEUR(p.salePrice || p.price) + '</span></a></li>';
  }).join("");
}
function addProductSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "priceCurrency": "EUR",
      "price": (product.salePrice || product.price).toFixed(2),
      "availability": product.soldOut
        ? "https://schema.org/OutOfStock"
        : "https://schema.org/InStock"
    }
  };
  const s = document.createElement("script");
  s.type = "application/ld+json";
  s.textContent = JSON.stringify(data);
  document.head.appendChild(s);
}
function galleryHtml(p) {
  const imgs = p.images || [];
  if (imgs.length === 0) return "Image (demo)";
  const dir = imageDir();

  let thumbs = "";
  if (imgs.length > 1) {
    thumbs = '<div class="thumbs">' + imgs.map(function (im, i) {
      const src = im.file ? dir + im.file : dir + im.base + "-600.webp";
      return '<button type="button" class="thumb-btn" data-i="' + i + '" aria-label="Show image ' + (i + 1) + '" aria-pressed="' + (i === 0) + '">' +
        '<img src="' + src + '" alt="" width="60" height="80" loading="lazy"></button>';
    }).join("") + '</div>';
  }

  return '<div class="zoom-box" id="zoom-box" role="button" tabindex="0" aria-label="Zoom image" aria-pressed="false">' +
    productImageHtml(p, { sizes: "(max-width: 860px) 100vw, 50vw", eager: true }) + '</div>' + thumbs;
}

function wireGallery(p) {
  const imgs = p.images || [];
  const box = document.getElementById("zoom-box");
  if (!box || imgs.length === 0) return;
  const main = box.querySelector("img");
  const dir = imageDir();
  const thumbs = document.querySelectorAll(".thumb-btn");

  thumbs.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const im = imgs[Number(btn.dataset.i)];
      main.removeAttribute("srcset");
      main.src = im.file ? dir + im.file : dir + im.base + "-1200.webp";
      main.alt = im.alt || p.name;
      thumbs.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
    });
  });

  function toggleZoom() {
    box.classList.toggle("zoomed");
    box.setAttribute("aria-pressed", String(box.classList.contains("zoomed")));
  }
  box.addEventListener("click", toggleZoom);
  box.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleZoom(); }
  });
  box.addEventListener("mousemove", function (e) {
    if (!box.classList.contains("zoomed")) return;
    const r = box.getBoundingClientRect();
    main.style.transformOrigin =
      ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%";
  });
}