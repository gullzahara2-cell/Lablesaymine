const cForm = document.getElementById("contact-form");
const cMsg = document.getElementById("contact-msg");

function cError(id, message) {
  document.getElementById("err-" + id).textContent = message;
  document.getElementById(id).setAttribute("aria-invalid", message ? "true" : "false");
}

cForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("c-name").value.trim();
  const email = document.getElementById("c-email").value.trim();
  const message = document.getElementById("c-message").value.trim();

  const nameErr = name ? "" : "Please enter your name.";
  const emailErr = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Please enter a valid email address.";
  const msgErr = message.length >= 10 ? "" : "Please write a message of at least 10 characters.";

  cError("c-name", nameErr);
  cError("c-email", emailErr);
  cError("c-message", msgErr);

  if (nameErr || emailErr || msgErr) {
    cMsg.textContent = "Please fix the marked fields.";
    cMsg.className = "form-error";
    return; // typed data stays in the form
  }

  // Honeypot: if a bot filled the hidden field, pretend success and do nothing.
  // Demo: nothing is sent. The real form will post to the backend later.
  cMsg.textContent = "Demo only: your message was not sent. The real reply time will be shown here.";
  cMsg.className = "form-ok";
  cForm.reset();
});