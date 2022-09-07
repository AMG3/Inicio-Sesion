function getUserName() {
  const name = document.getElementById("name-title");
  if (!name.textContent) {
    fetch("/current", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => (name.textContent = "Bienvenido " + res.email));
  }
}

getUserName();

const logout = document.getElementById("logoutButton");

logout.addEventListener("click", (evt) => {
  fetch("/logout", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(() => {
      document.cookie =
        "login=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    })
    .then(() => window.location.replace("/logout"));
});
