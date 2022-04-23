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

const statusImage = (lastStatusCode) => {
  let userStatus = "";
  if (lastStatusCode === "OK") userStatus = "green";
  else if (lastStatusCode === "HELP") userStatus = "yellow";
  else if (lastStatusCode === "EMERGENCY") userStatus = "red";
  else userStatus = "grey";
  return userStatus;
};

const addSingleUser = (user) => {
  const { username, lastStatusCode, isLogin, priviledge, active } = user;
  const item = document.createElement("li");
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
    <span class="username">${username}</span>
    <span class="online">${isLogin ? "online" : "offline"}</span>
    <span class="status">
    <span id="${username}Status" class=${userStatus}><img src="../images/${userStatus}.png"> </span>
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

socket.on("userList", (users) => {
  userList.innerHTML = "";
  const allUSer = appendAllUsers(users);
  directoryContainer.scrollTop = 0;
});

socket.on("updateStatus", (user) => {
  const id = `${user.username}Status`;
  const statusUpdated = user.lastStatusCode;
  console.log("debug_statusUpdated", statusUpdated);
  cookies.lastStatusCode = statusUpdated;
  const userStatus = statusImage(statusUpdated);

  const updateStatus = document.getElementById(`${id}`);

  updateStatus.innerHTML = `<img src="../images/${userStatus}.png"> ${statusUpdated}`;
});

socket.on("privateMessage", (message) => {
  console.log("I am in");
  const { target, author } = message;
  if (target === cookies.username)
    window.alert("You received a new message from " + author);
  // const unreadMsgList = document.querySelector(".unreadMsgList");
  // const item = document.createElement("li");
  // item.id = `${message.author}`;
  // calculateMsgNum(message.author);
  // msgNumMap.forEach(function(value,key){
  //   unreadMsgList.appendChild(item);
  // })
  // document.querySelector(".msgNum").innerHTML = `${msgNumMap.get(message.author)}`;
  //addUnreadMsg(message.author);
});

// const addUnreadMsg = (username) => {
//   const unreadMsgList = document.querySelector(".unreadMsgList");
//   const item = document.createElement("li");
//   item.id = `${username}`;
//   item.innerHTML = `<span> ${username}</span><span class="msgNum"></span>`;
//   unreadMsgList.appendChild(item);
// }

window.addEventListener("load", async () => {
  try {
    // const myPrivilege = req.cookies.privilege
    // if(myPrivilege == "Administrator" || myPrivilege == "administrator"){
    socket.auth = { username: cookies.username };
    socket.connect();
    const allUser = await fetch("/users", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const allUserData = await allUser.json();
    appendAllUsers(allUserData);
  } catch (err) {
    console.log(err);
  }
});

const clickUnreadMsgBlock = () => {
  const unreadMsgBlock = document.querySelector(".unreadMsgBlock");
  if (unreadMsgBlock.style.display === "block") {
    unreadMsgBlock.style.display = "";
  } else {
    unreadMsgBlock.style.display = "block";
  }
};

const calculateMsgNum = (username) => {
  if (msgNumMap.has(username)) {
    msgNum++;
    msgNumMap.set(username, msgNum);
  } else {
    msgNumMap.set(username, 1);
  }
};

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

const setGreyButton = document.querySelector("#setGreyButton");
setGreyButton.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { username } = cookies;
  const lastStatusCode = "UNKNOWN";
  try {
    const response = await fetch(
      `/users/${username}/status/${lastStatusCode}`,
      {
        method: "put",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
});

const setRedButton = document.querySelector("#setRedButton");
setRedButton.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { username } = cookies;
  const lastStatusCode = "EMERGENCY";
  try {
    const response = await fetch(
      `/users/${username}/status/${lastStatusCode}`,
      {
        method: "put",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
});

const setGreenButton = document.querySelector("#setGreenButton");
setGreenButton.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { username } = cookies;
  const lastStatusCode = "OK";
  try {
    const response = await fetch(
      `/users/${username}/status/${lastStatusCode}`,
      {
        method: "put",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
});

const setYellowButton = document.querySelector("#setYellowButton");
setYellowButton.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { username } = cookies;
  const lastStatusCode = "HELP";
  try {
    const response = await fetch(
      `/users/${username}/status/${lastStatusCode}`,
      {
        method: "put",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
});

const becomeDonnorBt = document.querySelector("#BecomeDonnor");

becomeDonnorBt.addEventListener("click", () => {
  if (cookies.lastStatusCode == "OK") {
    window.location.href = "/newDonor";
  } else {
    alert("You are not eligible to be a donor due to your current status");
  }
});

const askforBloodBt = document.querySelector("#AskforBlood");

askforBloodBt.addEventListener("click", () => {
  if (cookies.lastStatusCode == "EMERGENCY") {
    window.location.href = "/askForDonor";
  } else {
    alert("You are not eligible to ask for blood due to your current status");
  }
});
$(".ui.sidebar").sidebar("attach events", "#bar");
