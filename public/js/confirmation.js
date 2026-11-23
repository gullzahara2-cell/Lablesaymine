const COUNTRY_NAMES = {
  NL: "Netherlands", BE: "Belgium", DE: "Germany", EU: "Other EU country"
};

let order = null;
try { order = JSON.parse(localStorage.getItem("labelsaymine_last_order")); } catch (e) {}

if (!order) {
  document.getElementById("conf-none").hidden = false;
} else {
  document.getElementById("conf-wrap").hidden = false;

  // User-typed values go in with textContent, never as HTML.
  document.getElementById("c-number").textContent = order.number;
  document.getElementById("c-name").textContent = order.name;
  document.getElementById("c-street").textContent = order.address.street + " " + order.address.housenr;
  document.getElementById("c-city").textContent = order.address.postcode + " " + order.address.city;
  document.getElementById("c-country").textContent = COUNTRY_NAMES[order.address.country] || order.address.country;
  document.getElementById("c-email").textContent = "Confirmation would be sent to: " + order.email + " (demo: no email sent)";

  const list = document.getElementById("c-items");
  order.items.forEach(function (item) {
    const li = document.createElement("li");
    const left = document.createElement("span");
    left.textContent = item.qty + " x " + item.name + " (" + item.size + " / " + item.colour + ")";
    const right = document.createElement("span");
    right.textContent = formatEUR(item.price * item.qty);
    li.appendChild(left);
    li.appendChild(right);
    list.appendChild(li);
  });

  document.getElementById("c-subtotal").textContent = formatEUR(order.subtotal);
  document.getElementById("c-shipping").textContent = order.shipping === 0 ? "Free" : formatEUR(order.shipping);
  document.getElementById("c-total").textContent = formatEUR(order.total);
}