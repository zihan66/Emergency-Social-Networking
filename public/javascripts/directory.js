const directoryContainer = document.querySelector(".directory-container");
const userList = document.querySelector(".user-list");
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io();

const getAllUsers = async () => {
  try {
    const response = await fetch("/users", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const addSingleUser = (user, before) => {
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
  if (before === false) userList.appendChild(item);
  else userList.insertBefore(item, directoryContainer.firstChild);
};

const appendAllUsers = (users) => {
  users.map(addSingleUser, true);
};

socket.on("userList", (users) => {
  userList.innerHTML = "";
  appendAllUsers(users);
  directoryContainer.scrollTop = 0;
});

window.addEventListener("load", () => {
  appendAllUsers(getAllUsers());
});
