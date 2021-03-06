import ejectUser from "../javascripts/common/logout.js";
const directoryContainer = document.querySelector(".directory-container");
const userList = document.querySelector(".user-list");
const userprofile = document.querySelector("user-directory-profile");
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io({ URL: "http://localhost:3000", autoConnect: false });
const userChatMap = new Map();
const msgNumMap = new Map();
const unreadMsgMap = new Map();
const getAllUsers = async () => {};
// inform user of force injection
socket.on("ejectOneUser", async (message) => {
  ejectUser(message);
});
const statusImage = (lastStatusCode) => {
  let userStatus = "";
  if (lastStatusCode === "OK") userStatus = "green";
  else if (lastStatusCode === "HELP") userStatus = "yellow";
  else if (lastStatusCode === "EMERGENCY") userStatus = "red";
  else userStatus = "grey";
  return userStatus;
};

const addSingleUser = (user) => {
  const {
    username,
    lastStatusCode,
    isLogin,
    privilege,
    active,
    accountStatus,
  } = user;
  const item = document.createElement("li");
  item.addEventListener("click", async function (e) {
    e.preventDefault();
    const username2 = this.id;
    window.location.href = `/users/edit/${username2}`;
  });
  // let userStatus = "";
  // if (lastStatusCode === "OK") userStatus = "green";
  // else if (lastStatusCode === "HELP") userStatus = "yellow";
  // else if (lastStatusCode === "EMERGENCY") userStatus = "red";
  // else userStatus = "grey";
  const userStatus = statusImage(lastStatusCode);
  item.className = "user";
  item.id = `${username}`;
  item.innerHTML = ` <div><span class="avat">
  <i class="address card icon"></i>
    </span>
    <span class="username"> ${username} </span>
    <span class="online"> ${accountStatus} ${privilege}</span>
    <span class="status">
    <span id="${username}Status" class=${userStatus}> <img src="../images/${userStatus}.png"> </span>
</span></div>`;
  item.addEventListener("click", async function (e) {
    e.preventDefault();
    const username2 = this.id;
    window.location.href = `/users/edit/${username2}`;
  });
  userList.appendChild(item);
};

const appendAllUsers = (users) => {
  const { username } = cookies;
  // eslint-disable-next-line no-underscore-dangle
  // const _users = users.filter((e) => e.username !== username);
  users.map(addSingleUser);
};

socket.on("userListForAdmin", (users) => {
  userList.innerHTML = "";
  const allUSer = appendAllUsers(users);
  directoryContainer.scrollTop = 0;
});

socket.on("updateStatus", (user) => {
  const id = `${user.username}Status`;
  const statusUpdated = user.lastStatusCode;
  cookies.lastStatusCode = statusUpdated;
  const userStatus = statusImage(statusUpdated);

  const updateStatus = document.getElementById(`${id}`);

  updateStatus.innerHTML = `<img src="../images/${userStatus}.png">`;
});

socket.on("privateMessage", (message) => {
  console.log("I am in");
  const { target, author } = message;
  if (target === cookies.username)
    window.alert("You received a new message from " + author);
});

window.addEventListener("load", async () => {
  try {
    // const myPrivilege = req.cookies.privilege
    // if(myPrivilege == "Administrator" || myPrivilege == "administrator"){
    socket.auth = { username: cookies.username };
    socket.connect();
    const allUser = await fetch("/users/?mode=admin", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const allUserData = await allUser.json();
    appendAllUsers(allUserData);

    const chatPrivateInfo = await fetch(`/chats?username=${cookies.username}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const chatPrivateData = await chatPrivateInfo.json();
    const chats = chatPrivateData.chats;
    for (let i = 0; i < chats.length; i++) {
      userChatMap.set(chats[i].username, chats[i].chatID);
    }
  } catch (err) {
    console.log(err);
  }
});

const calculateMsgNum = (username) => {
  if (msgNumMap.has(username)) {
    msgNum++;
    msgNumMap.set(username, msgNum);
  } else {
    msgNumMap.set(username, 1);
  }
};

const leave = document.querySelector("#leave");
leave.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = "/directory";
});
