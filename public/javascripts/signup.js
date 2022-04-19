const { reservedUsernameList } = require('./common/constants');

const joinCommunity = document.querySelector(".button");
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

confirmButton.addEventListener("click", async (e) => {
  e.preventDefault();
  const username = document.forms[0].querySelectorAll("input")[0].value;
  const password = document.forms[0].querySelectorAll("input")[1].value;
  modal.style.display = "none";
  const data = { username, password };
  try {
    const response = await fetch("/users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 405) {
      const ele = document.querySelector("#username-hint");
      ele.innerHTML = "user has already exists";
      return;
    }
    if (response.status === 201) {
      window.location.href = response.headers.get("Location");
    }
  } catch (err) {
    console.error(err);
  }
});

joinCommunity.addEventListener("click", async (e) => {
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
  modal.style.display = "block";
});
