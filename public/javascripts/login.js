const login = document.querySelector(".button");
login.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.forms[0].querySelectorAll("input")[0].value;
  const password = document.forms[0].querySelectorAll("input")[1].value;
  const data = { username, password };
  try {
    const response = await fetch(`/users/${username}/online`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 404) {
      const ele = document.querySelector("#password-hint");
      ele.innerHTML = "user does not exist or password is incorrect";
      return;
    }
    if (response.status === 200) {
      window.location.href = response.headers.get("Location");
    }
  } catch (error) {
    console.log(error);
  }
});
