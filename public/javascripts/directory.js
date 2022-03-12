const directoryContainer = document.querySelector(".directory-container");
const userList = document.querySelector(".user-list");
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io();

const getAllUsers = async () => {};

const addSingleUser = (user) => {
  const { username, status, isLogin } = user;

  const item = document.createElement("li");
  let recStatus = "";
  if (status === "OK") recStatus = "green";
  else if (status === "Help") recStatus = "yellow";
  else if (status === "Emergency") recStatus = "red";
  else recStatus = "grey";
  item.className = "user";
  item.innerHTML = ` <span class="avat">
  <i class="address card icon"></i>
    </span>
    <span class="username">${username}</span>
    <span class="online">${isLogin ? "online" : "offline"}</span>
    <span class="status">
    in
    <span class=${recStatus}></span>
    situation
</span>`;
  userList.appendChild(item);
};

const appendAllUsers = (users) => {
  console.log(users);
  users.map(addSingleUser);
};

socket.on("userList", (users) => {
  userList.innerHTML = "";
  appendAllUsers(users);
  directoryContainer.scrollTop = 0;
});

window.addEventListener("load", async () => {
  try {
    const response = await fetch("/users", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = await response.json();
    appendAllUsers(data);
  } catch (err) {
    console.error(err);
  }
});

const logout = document.querySelector("#logout");
logout.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { username } = cookies;
  try {
    const response = await fetch(`/users/${username}/offline`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
});

const publicButton = document.querySelector("#go-to");
publicButton.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = "/publicWall";
});

const joinCommunity = document.getElementById("link-signup");
joinCommunity.addEventListener("click", () => {
  window.location.href = "/signup";
});

// const login = document.getElementById("link-login");
// login.addEventListener("click", () => {
//   window.location.href = "/login";
// });



const clickHamburger = () => {
  const hamburger = document.querySelector(".links");
  if (hamburger.style.display === "block") {
    hamburger.style.display = "";
  } else {
    hamburger.style.display = "block";
  }
};
const hamburger = document.getElementById("bar");
hamburger.addEventListener("click", clickHamburger);

const clickHamburger2 = () => {
  const hamburger2 = document.querySelector(".links2");
  if (hamburger2.style.display === "block") {
    hamburger2.style.display = "";
  } else {
    hamburger2.style.display = "block";
  }
};
const hamburger2 = document.getElementById("status-bar");
hamburger2.addEventListener("click", clickHamburger2);


const setStatusButton = () => {
  e.preventDefault();
  const username = document.forms[0].querySelectorAll("input")[0].value;
  const password = document.forms[0].querySelectorAll("input")[1].value;
  const lastStatusCode = document.forms[0].querySelectorAll("input")[2].value;
  const lastStatusUpdateTime = document.forms[0].querySelectorAll("input")[3].value;
  const data = { username, password, lastStatusCode, lastStatusUpdateTime };
  try {
    const response = await fetch(`/users/${userName}/status/${lastStatusCode}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (response.status === 404) {
      // const ele = document.querySelector("#password-hint");
      // ele.innerHTML = "user does not exist or password is incorrect";
      return;
    }
    if (response.status === 200) {
      window.location.href = response.headers.get("Location");
    }
  } catch (error) {
    console.log(error);
  }
  // const setRedButton = document.querySelector(".setRed");
  // if (setRedButton.style.display === "block") {
  //   setRedButton.style.display = "";
  // } else {
  //   setRedButton.style.display = "block";
  // }
};
const setStatusButton = document.getElementById("setStatusButton");
setStatusButton.addEventListener("click", setStatusButton);