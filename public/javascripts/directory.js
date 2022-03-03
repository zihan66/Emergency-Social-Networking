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
