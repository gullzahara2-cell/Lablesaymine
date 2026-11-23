// DEMO ONLY. No password is ever stored. Real accounts (hashed passwords) come with the backend.
const USER_KEY = "labelsaymine_demo_user";
const ADDR_KEY = "labelsaymine_demo_addresses";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch (e) { return fallback; }
}
function writeJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
}

const authBox = document.getElementById("auth-box");
const accountBox = document.getElementById("account-box");
const authMsg = document.getElementById("auth-msg");

function setErr(id, message) {
  document.getElementById("err-" + id).textContent = message;
  document.getElementById(id).setAttribute("aria-invalid", message ? "true" : "false");
}

function showAuthMsg(text, ok) {
  authMsg.textContent = text;
  authMsg.className = ok ? "form-ok" : "form-error";
}

// ----- Tabs -----
document.querySelectorAll(".tab-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".tab-btn").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b === btn));
    });
    ["login", "register", "reset"].forEach(function (name) {
      document.getElementById("panel-" + name).hidden = (name !== btn.dataset.panel);
    });
    authMsg.textContent = "";
  });
});

// ----- Login -----
document.getElementById("panel-login").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("l-email").value.trim();
  const pass = document.getElementById("l-pass").value;
  const e1 = EMAIL_RE.test(email) ? "" : "Enter a valid email address.";
  const e2 = pass.length >= 8 ? "" : "Password must be at least 8 characters.";
  setErr("l-email", e1);
  setErr("l-pass", e2);
  if (e1 || e2) return;

  writeJson(USER_KEY, { name: email.split("@")[0], email: email });
  document.getElementById("l-pass").value = "";
  render();
});

// ----- Register -----
document.getElementById("panel-register").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("r-name").value.trim();
  const email = document.getElementById("r-email").value.trim();
  const pass = document.getElementById("r-pass").value;
  const pass2 = document.getElementById("r-pass2").value;

  const e1 = name ? "" : "Enter your name.";
  const e2 = EMAIL_RE.test(email) ? "" : "Enter a valid email address.";
  const e3 = pass.length >= 8 ? "" : "Password must be at least 8 characters.";
  const e4 = pass === pass2 ? "" : "The passwords do not match.";
  setErr("r-name", e1);
  setErr("r-email", e2);
  setErr("r-pass", e3);
  setErr("r-pass2", e4);
  if (e1 || e2 || e3 || e4) return;

  writeJson(USER_KEY, { name: name, email: email }); // password is NOT stored
  document.getElementById("r-pass").value = "";
  document.getElementById("r-pass2").value = "";
  render();
});

// ----- Password reset -----
document.getElementById("panel-reset").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("p-email").value.trim();
  const err = EMAIL_RE.test(email) ? "" : "Enter a valid email address.";
  setErr("p-email", err);
  if (err) return;
  // Same message whether or not an account exists (this is how real systems avoid leaking accounts).
  showAuthMsg("If an account exists for this email, a reset link would be sent. Demo: no email was sent.", true);
});

// ----- Logged-in area -----
function renderOrders() {
  const box = document.getElementById("orders-content");
  box.textContent = "";
  const order = readJson("labelsaymine_last_order", null);
  if (!order) {
    box.textContent = "No orders yet.";
    return;
  }
  const p = document.createElement("p");
  p.textContent = "Order " + order.number + " | " + formatEUR(order.total) + " incl. btw | " +
    new Date(order.placedAt).toLocaleDateString("en-GB");
  const a = document.createElement("a");
  a.href = "bevestiging.html";
  a.textContent = "View order";
  a.className = "btn btn-outline";
  box.appendChild(p);
  box.appendChild(a);
}

function renderAddresses() {
  const list = document.getElementById("addr-list");
  list.textContent = "";
  const addrs = readJson(ADDR_KEY, []);
  if (addrs.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No saved addresses yet.";
    list.appendChild(li);
    return;
  }
  addrs.forEach(function (a, i) {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = a.street + " " + a.nr + ", " + a.post + " " + a.city;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "link-btn";
    btn.textContent = "Remove";
    btn.addEventListener("click", function () {
      const all = readJson(ADDR_KEY, []);
      all.splice(i, 1);
      writeJson(ADDR_KEY, all);
      renderAddresses();
    });
    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });
}

document.getElementById("addr-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const street = document.getElementById("a-street").value.trim();
  const nr = document.getElementById("a-nr").value.trim();
  const post = document.getElementById("a-post").value.trim();
  const city = document.getElementById("a-city").value.trim();

  const e1 = street ? "" : "Enter your street.";
  const e2 = nr ? "" : "Enter your house number.";
  const e3 = post ? "" : "Enter your postcode.";
  const e4 = city ? "" : "Enter your city.";
  setErr("a-street", e1);
  setErr("a-nr", e2);
  setErr("a-post", e3);
  setErr("a-city", e4);
  if (e1 || e2 || e3 || e4) return;

  const all = readJson(ADDR_KEY, []);
  all.push({ street: street, nr: nr, post: post, city: city });
  writeJson(ADDR_KEY, all);
  e.target.reset();
  renderAddresses();
});

document.getElementById("logout-btn").addEventListener("click", function () {
  try { localStorage.removeItem(USER_KEY); } catch (err) {}
  render();
});

function render() {
  const user = readJson(USER_KEY, null);
  if (user) {
    authBox.hidden = true;
    accountBox.hidden = false;
    document.getElementById("welcome").textContent = "Signed in as " + user.name + " (" + user.email + ") - demo";
    renderOrders();
    renderAddresses();
  } else {
    accountBox.hidden = true;
    authBox.hidden = false;
  }
}

render();