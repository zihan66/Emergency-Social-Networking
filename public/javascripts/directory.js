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
  const { username, lastStatusCode, isLogin } = user;
  const item = document.createElement("li");
  item.addEventListener("click", async function (e) {
    e.preventDefault();
    const username2 = this.id;
    const chatID = userChatMap.get(this.id);
    if (userChatMap.has(username2)) {
      window.location.href = `/chats/${chatID}/${username2}`;
    } else {
      const username1 = cookies.username;
      const data = { username1, username2 };
      const jsonData = JSON.stringify(data);

      try {
        const response = await fetch("/chats", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.status === 201) {
          window.location.href = response.headers.get("Location");
        }
      } catch (error) {
        console.log(error);
      }
    }
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
    <span class="username">${username}</span>
    <span class="online">${isLogin ? "online" : "offline"}</span>
    <span class="status">
    <span>Status:</span>
    <span id="${username}Status" class=${userStatus}><img src="../images/${userStatus}.png"> ${lastStatusCode}</span>
</span></div>`;
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
const unread = document.getElementById("unread");
unread.addEventListener("click", async () => {
  //clickUnreadMsgBlock();
  const unreadMsgBlock = document.querySelector(".unreadMsgBlock");
  if (unreadMsgBlock.style.display === "block") {
    unreadMsgBlock.style.display = "";
  } else {
    unreadMsgBlock.style.display = "block";
  }
  //alert(unreadMsgBlock.style.display);

  if (unreadMsgBlock.style.display === "block") {
    try {
      const unreadMsgs = await fetch(
        `/messages/private/unread?username=${cookies.username}`,
        {
          method: "get",
          headers: {
            Authorization: `Bearer ${cookies.jwtToken}`,
          },
        }
      );
      const unreadMsgsData = await unreadMsgs.json();
      console.log("unreadMsgsData", unreadMsgsData);
      let msgNum = 0;
      for (let i = 0; i < unreadMsgsData.length; i += 1) {
        unreadMsgMap.set(unreadMsgsData[i].username, unreadMsgsData[i].chatID);
        if (msgNumMap.has(unreadMsgsData[i].username)) {
          msgNum++;
          msgNumMap.set(unreadMsgsData[i].username, msgNum);
        } else {
          msgNum = 1;
          msgNumMap.set(unreadMsgsData[i].username, msgNum);
        }
        //calculateMsgNum(unreadMsgsData[i].username);
      }
      console.log("unreadMsgMap", unreadMsgMap);
      console.log("msgNumMap", msgNumMap);
      const unreadMsgList = document.querySelector(".unreadMsgList");
      unreadMsgList.innerHTML = "";
      msgNumMap.forEach(function (value, key, map) {
        const item = document.createElement("li");
        item.id = `${key}`;

        item.innerHTML = `<span> ${key}</span><span class="msgNum">${value}</span>`;
        unreadMsgList.appendChild(item);
        item.addEventListener("click", function (e) {
          e.preventDefault();
          const username2 = this.id;
          const chatID = unreadMsgMap.get(username2);
          window.location.href = `/chats/${chatID}/${username2}`;
        });
      });
    } catch (error) {}
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

const directoryForAdmin = document.querySelector("#directoryForAdmin");
directoryForAdmin.addEventListener("click", async (e) => {
  e.preventDefault();
  e.stopPropagation();
  const { username, privilege } = cookies;
  console.log("my privilege:",privilege);
  const myPrivilege = privilege;
  if(myPrivilege == "Administrator" || myPrivilege == "administrator"){
    window.location.href = "/directoryForAdmin";
  }
  else{
    alert("You are not admin!");
    window.location.href = "/directory";
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

const clickSearch = () => {
  const searchBlock = document.querySelector(".searchCriteriaBlock");
  if (searchBlock.style.display === "block") {
    searchBlock.style.display = "";
  } else {
    searchBlock.style.display = "block";
  }
};
const search = document.querySelector("#search");
search.addEventListener("click", clickSearch);
const searchUsername = document.querySelector("#searchUsername");
const searchStatus = document.querySelector("#searchStatus");
searchUsername.addEventListener("click", (e) => {
  e.preventDefault();
  const criteria = "user";
  window.location.href = `/searchPage/${criteria}`;
});
searchStatus.addEventListener("click", (e) => {
  e.preventDefault();
  const criteria = "status";
  window.location.href = `/searchPage/${criteria}`;
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
