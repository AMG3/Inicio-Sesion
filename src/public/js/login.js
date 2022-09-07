const form = document.getElementById("loginForm");
const registerBtn = document.getElementById("registerButton");
const errorMessages = document.getElementById("error-messages");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  errorMessages.innerText = "";
  let data = new FormData(form);
  let obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((json) => window.location.replace("/"))
    .catch((e) => {
      errorMessages.setAttribute("style", "color:red;");
      errorMessages.innerText = "Usuario o contraseña no válidos";
    });
});

registerBtn.addEventListener("click", () => {
  window.location.replace("/register");
});
