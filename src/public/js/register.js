const form = document.getElementById("registerForm");
const loginBtn = document.getElementById("loginButton");
const errorMessages = document.getElementById("error-messages");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  errorMessages.setAttribute("style", "display: none;");
  let data = new FormData(form);
  let obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/register", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then(() => window.location.replace("/login"))
    .catch((e) => {
      errorMessages.setAttribute(
        "style",
        "display: block; color:red; margin:0.5rem; padding:0.5rem; border: 1px solid red; border-radius: 0.5rem; background-color: mistyrose;"
      );
      errorMessages.innerText = "Usuario ya registrado";
    });
});

loginBtn.addEventListener("click", () => {
  window.location.replace("/login");
});
