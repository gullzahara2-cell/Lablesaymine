const FREE_SHIPPING_FROM = 75; // EUR, Netherlands (from the requirements PDF)

const linesEl = document.getElementById("cart-lines");
const emptyEl2 = document.getElementById("cart-empty");
const fullEl = document.getElementById("cart-full");

function loadCart() {
  try { return JSON.parse(localStorage.getItem("labelsaymine_cart")) || []; }
  catch (e) { return []; }
}

function saveCart(cart) {
  try { localStorage.setItem("labelsaymine_cart", JSON.stringify(cart)); } catch (e) {}
  updateCartCount();
}

function renderCart() {
  const cart = loadCart();

  if (cart.length === 0) {
    emptyEl2.hidden = false;
    fullEl.hidden = true;
    return;
  }
  emptyEl2.hidden = true;
  fullEl.hidden = false;

  linesEl.innerHTML = cart.map(function (item, i) {
    return '<li class="cart-line">' +
      '<div class="cart-thumb">' + cartThumb(item) + '</div>' +
      '<div class="cart-info">' +
        '<a href="product.html?id=' + item.id + '"><strong>' + item.name + '</strong></a>' +
        '<p>Size: ' + item.size + ' / Colour: ' + item.colour + '</p>' +
        '<p>' + formatEUR(item.price) + '</p>' +
        '<div class="qty-row">' +
          '<label for="q' + i + '">Qty</label>' +
          '<input type="number" id="q' + i + '" min="1" max="5" value="' + item.qty + '" data-index="' + i + '">' +
          '<button type="button" class="link-btn" data-remove="' + i + '">Remove</button>' +
        '</div>' +
      '</div>' +
      '<div class="cart-line-total">' + formatEUR(item.price * item.qty) + '</div>' +
    '</li>';
  }).join("");

  const subtotal = cart.reduce(function (sum, it) { return sum + it.price * it.qty; }, 0);
  document.getElementById("sum-subtotal").textContent = formatEUR(subtotal);

  const progressText = document.getElementById("ship-progress");
  const bar = document.getElementById("progress-bar");
  const shipEl = document.getElementById("sum-shipping");

  if (subtotal >= FREE_SHIPPING_FROM) {
    progressText.textContent = "You get free shipping (NL).";
    bar.style.width = "100%";
    shipEl.textContent = "Free (NL)";
  } else {
    const left = FREE_SHIPPING_FROM - subtotal;
    progressText.textContent = "Add " + formatEUR(left) + " more for free shipping (NL).";
    bar.style.width = Math.round((subtotal / FREE_SHIPPING_FROM) * 100) + "%";
    shipEl.textContent = "Calculated at checkout";
  }
}

linesEl.addEventListener("change", function (e) {
  if (e.target.matches("input[type=number]")) {
    const cart = loadCart();
    let qty = parseInt(e.target.value, 10);
    if (!qty || qty < 1) qty = 1;
    if (qty > 5) qty = 5; // demo stock limit
    cart[Number(e.target.dataset.index)].qty = qty;
    saveCart(cart);
    renderCart();
  }
});

linesEl.addEventListener("click", function (e) {
  if (e.target.dataset.remove !== undefined) {
    const cart = loadCart();
    cart.splice(Number(e.target.dataset.remove), 1);
    saveCart(cart);
    renderCart();
  }
});

document.getElementById("coupon-btn").addEventListener("click", function () {
  const msg = document.getElementById("coupon-msg");
  const code = document.getElementById("coupon").value.trim();
  if (!code) {
    msg.textContent = "Please enter a coupon code.";
    msg.className = "form-error";
    return;
  }
  // DEMO: no coupons exist yet. Real codes, expiry and usage rules come with the backend.
  msg.textContent = "This code is not valid (demo: no coupons exist yet).";
  msg.className = "form-error";
});

renderCart();
function cartThumb(item) {
  const p = DEMO_PRODUCTS.find(function (x) { return x.id === item.id; });
  return p ? productImageHtml(p, { sizes: "90px" }) : "Image (demo)";
}