import reservedUsernameList from "../javascripts/common/constants.js";

// Get the modal
const modal = document.querySelector(".modal-wrapper");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

const confirmButton = document.querySelector(".confirm");

// When the user clicks on <span> (x), close the modal
span.onclick = () => {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

const loginOrSignUp = document.querySelector(".button");
loginOrSignUp.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.forms[0].querySelectorAll("input")[0].value;
  const password = document.forms[0].querySelectorAll("input")[1].value;

  if (username.length < 3) {
    const ele = document.querySelector("#username-hint");
    ele.innerHTML = "Username should have minimum three characters";
    return;
  }
  if (reservedUsernameList.includes(username)) {
    const ele = document.querySelector("#username-hint");
    ele.innerHTML = "Username is reserved, please choose another one";
    return;
  }
  const ele = document.querySelector("#username-hint");
  ele.innerHTML = "";

  if (password.length < 4) {
    const eleP = document.querySelector("#password-hint");
    eleP.innerHTML = "Password should have minimum four characters";
    return;
  }
  const eleP = document.querySelector("#password-hint");
  eleP.innerHTML = "";

  const data = { username, password };
  try {
    const response = await fetch(`/users/${username}/online`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (response.status === 404) {
      modal.style.display = "block";
      confirmButton.addEventListener("click", async (e) => {
        e.preventDefault();
        modal.style.display = "none";
        const registerResponse = await fetch("/users", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (registerResponse.status === 201) {
          window.location.href = registerResponse.headers.get("Location");
        }
      });
      return;
    }
    if (response.status === 401) {
      if (result.message === "password is wrong") {
        const ele = document.querySelector("#password-hint");
        ele.innerHTML = "user does not exist or password is incorrect";
        return;
      } else {
        const ele = document.querySelector("#password-hint");
        ele.innerHTML = "Your Account Status is inactive";
        return;
      }
    }
    if (response.status === 200) {
      window.location.href = response.headers.get("Location");
    }
  } catch (error) {
    console.log(error);
  }
});
