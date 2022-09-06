const form = document.getElementById("registerForm");
const loginBtn = document.getElementById("loginButton");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
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
    .then((json) => console.log(json))
    .then(() => window.location.replace("/login"));
});

loginBtn.addEventListener("click", () => {
  window.location.replace("/login");
});
