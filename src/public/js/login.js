const form = document.getElementById("loginForm");
const registerBtn = document.getElementById("registerButton");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
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
    .then((json) => window.location.replace("/"));
});

registerBtn.addEventListener("click", () => {
  window.location.replace("/register");
});
