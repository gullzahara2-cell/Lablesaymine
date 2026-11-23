const FREE_FROM = 75; // EUR, Netherlands (from the requirements PDF)

// DEMO shipping rates. Real rates come from the client (Q-09).
const SHIPPING_METHODS = [
  { id: "standard", label: "Standard delivery (DEMO rate)", price: 4.95 },
  { id: "express",  label: "Express delivery (DEMO rate)",  price: 9.95 }
];

const form = document.getElementById("checkout-form");
const wrap = document.getElementById("co-wrap");
const emptyBox = document.getElementById("co-empty");
const summaryBox = document.getElementById("error-summary");

function getCart() {
  try { return JSON.parse(localStorage.getItem("labelsaymine_cart")) || []; }
  catch (e) { return []; }
}

const cart = getCart();

if (cart.length === 0) {
  emptyBox.hidden = false;
} else {
  wrap.hidden = false;
  setup();
}

function subtotalOf() {
  return cart.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
}

function shippingCost(methodId) {
  const country = document.getElementById("country").value;
  const method = SHIPPING_METHODS.find(function (m) { return m.id === methodId; });
  if (methodId === "standard" && country === "NL" && subtotalOf() >= FREE_FROM) return 0;
  return method.price;
}

function selectedMethod() {
  const checked = document.querySelector("input[name=ship]:checked");
  return checked ? checked.value : "standard";
}

function setup() {
  // Shipping method radios
  const box = document.getElementById("ship-methods");
  box.innerHTML = SHIPPING_METHODS.map(function (m, i) {
    return '<label class="radio-row"><input type="radio" name="ship" value="' + m.id + '"' +
      (i === 0 ? " checked" : "") + '> <span>' + m.label + ' <strong data-price="' + m.id + '"></strong></span></label>';
  }).join("");

  // Order review lines
  document.getElementById("co-lines").innerHTML = cart.map(function (i) {
    return '<li><span>' + i.qty + ' x ' + i.name + '<br><small>' + i.size + ' / ' + i.colour + '</small></span>' +
      '<span>' + formatEUR(i.price * i.qty) + '</span></li>';
  }).join("");

  form.addEventListener("change", updateTotals);
  form.addEventListener("submit", onSubmit);
  updateTotals();
}

function updateTotals() {
  const sub = subtotalOf();
  const ship = shippingCost(selectedMethod());

  SHIPPING_METHODS.forEach(function (m) {
    const c = shippingCost(m.id);
    document.querySelector('[data-price="' + m.id + '"]').textContent = c === 0 ? "Free" : formatEUR(c);
  });

  document.getElementById("co-subtotal").textContent = formatEUR(sub);
  document.getElementById("co-shipping").textContent = ship === 0 ? "Free (NL)" : formatEUR(ship);
  document.getElementById("co-total").textContent = formatEUR(sub + ship);
}

// ---------- Validation ----------
const POSTCODE_RULES = {
  NL: { re: /^[1-9][0-9]{3}\s?[A-Za-z]{2}$/, msg: "Enter a valid Dutch postcode, for example 1234 AB." },
  BE: { re: /^[1-9][0-9]{3}$/,               msg: "Enter a valid Belgian postcode (4 digits)." },
  DE: { re: /^[0-9]{5}$/,                    msg: "Enter a valid German postcode (5 digits)." },
  EU: { re: /^.{3,10}$/,                     msg: "Enter a valid postcode." }
};

const CHECKS = [
  { id: "email", test: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address."; } },
  { id: "firstname", test: function (v) { return v ? "" : "Enter your first name."; } },
  { id: "lastname",  test: function (v) { return v ? "" : "Enter your last name."; } },
  { id: "postcode",  test: function (v) {
      const rule = POSTCODE_RULES[document.getElementById("country").value];
      return rule.re.test(v) ? "" : rule.msg; } },
  { id: "housenr", test: function (v) { return v ? "" : "Enter your house number."; } },
  { id: "street",  test: function (v) { return v ? "" : "Enter your street."; } },
  { id: "city",    test: function (v) { return v ? "" : "Enter your city."; } }
];

function setError(id, message) {
  const input = document.getElementById(id);
  const err = document.getElementById("err-" + id);
  err.textContent = message;
  if (id !== "consent") {
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (message) input.setAttribute("aria-describedby", "err-" + id);
  }
}

function onSubmit(e) {
  e.preventDefault();
  const problems = [];

  CHECKS.forEach(function (c) {
    const value = document.getElementById(c.id).value.trim();
    const message = c.test(value);
    setError(c.id, message);
    if (message) problems.push({ id: c.id, message: message });
  });

  const consent = document.getElementById("consent");
  const consentMsg = consent.checked ? "" : "Please accept the privacy policy and terms to continue.";
  setError("consent", consentMsg);
  if (consentMsg) problems.push({ id: "consent", message: consentMsg });

  if (problems.length > 0) {
    // Data stays in the form. Only messages are shown.
    summaryBox.hidden = false;
    summaryBox.innerHTML = "<strong>Please fix " + problems.length + " item(s):</strong><ul>" +
      problems.map(function (p) { return '<li><a href="#' + p.id + '">' + p.message + '</a></li>'; }).join("") +
      "</ul>";
    summaryBox.focus();
    return;
  }

  summaryBox.hidden = true;
  placeDemoOrder();
}

function placeDemoOrder() {
  const sub = subtotalOf();
  const methodId = selectedMethod();
  const ship = shippingCost(methodId);

  const order = {
    number: "DEMO-" + String(Date.now()).slice(-8),
    placedAt: new Date().toISOString(),
    email: document.getElementById("email").value.trim(),
    name: document.getElementById("firstname").value.trim() + " " + document.getElementById("lastname").value.trim(),
    address: {
      country: document.getElementById("country").value,
      postcode: document.getElementById("postcode").value.trim().toUpperCase(),
      housenr: document.getElementById("housenr").value.trim(),
      street: document.getElementById("street").value.trim(),
      city: document.getElementById("city").value.trim()
    },
    shippingMethod: methodId,
    items: cart,
    subtotal: sub,
    shipping: ship,
    total: sub + ship,
    payment: "demo (no real payment)"
  };

  try {
    localStorage.setItem("labelsaymine_last_order", JSON.stringify(order));
    localStorage.removeItem("labelsaymine_cart");
  } catch (e) {}

  location.href = "bevestiging.html"; // built in Step 12
}