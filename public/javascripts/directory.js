const directoryContainer = document.querySelector(".directory-container");
const userList = document.querySelector(".user-list");
// const userprofile
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io();
const userChatMap = new Map();

const getAllUsers = async () => {};

const statusImage = (lastStatusCode) => {
  let userStatus = "";
  if (lastStatusCode === "OK") userStatus = "green";
  else if (lastStatusCode === "HELP") userStatus = "yellow";
  else if (lastStatusCode === "EMERGENCY") userStatus = "red";
  else userStatus = "grey";
  return userStatus;
};

// const statusID = (lastStatusCode) =>{
//   let status = "";
// };

const addSingleUser = (user) => {
  const { username, lastStatusCode, isLogin } = user;
  const item = document.createElement("li");
  item.addEventListener("click", async function (e) {
    e.preventDefault();
    const username2 = this.id;
    console.log("username2", username2);
    console.log("status:", lastStatusCode);
    console.log("ifexist", userChatMap.has(username2));
    const chatID = userChatMap.get(this.id);
    console.log("chatid", chatID);
    if (userChatMap.has(username2)) {
      window.location.href = `/chatRoom/${chatID}/${username2}`;
    } else {
      const username1 = cookies.username;
      const data = { username1, username2 };
      const jsonData = JSON.stringify(data);
      console.log("user12", data);
      console.log("jsonData", jsonData);
      try {
        const response = await fetch("/chats", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        console.log(response);
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
  console.log(users);
  const { username } = cookies;
  // eslint-disable-next-line no-underscore-dangle
  // const _users = users.filter((e) => e.username !== username);
  users.map(addSingleUser);
};

socket.on("userList", (users) => {
  userList.innerHTML = "";
  const allUSer = appendAllUsers(users);
  console.log("allusers", allUSer);
  directoryContainer.scrollTop = 0;
});

socket.on("updateStatus", (user) => {
  // console.log("updateStatus called");
  // console.log("updateStatus user&status:",user,updated_status);
  const id = `${user.username}Status`;
  const statusUpdated = user.lastStatusCode;
  const userStatus = statusImage(statusUpdated);
  console.log("id", id);
  const updateStatus = document.getElementById(`${id}`);
  updateStatus.innerHTML = `<img src="../images/${userStatus}.png"> ${statusUpdated}`;
});

socket.on("updateDirectoryProfile", (user,status) => {
  console.log("updateDirectoryProfile called");

});

window.addEventListener("load", async () => {
  try {
    const allUser = await fetch("/users", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const allUserData = await allUser.json();
    //console.log("allUSer", allUser);
    console.log("allUserjson", allUserData);
    appendAllUsers(allUserData);

    const chatPrivateInfo = await fetch(`/chats?username=${cookies.username}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    //const chatPrivateData = await chatPrivateInfo.json();
    const chatPrivateData = await chatPrivateInfo.json();
    const chats = chatPrivateData.chats;
    console.log("chatPrivate", chats);
    // console.log("chatPrivate", chatPrivateData.length);
    for (let i = 0; i < chats.length; i++) {
      userChatMap.set(chats[i].username, chats[i].chatID);
    }
    console.log("userChatMap", userChatMap);

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
    const unreadMsgMap = new Map();
    for (let i = 0; i < unreadMsgsData.length; i += 1) {
      unreadMsgMap.set(unreadMsgsData[i].username, unreadMsgsData[i].chatID);
    }
    console.log("unreadMsgMap", unreadMsgMap);
    console.log("unreadMsgsData", unreadMsgsData);
    const clickUnreadMsgBlock = () => {
      const unreadMsgBlock = document.querySelector(".unreadMsgBlock");
      if (unreadMsgBlock.style.display === "block") {
        unreadMsgBlock.style.display = "";
      } else {
        unreadMsgBlock.style.display = "block";
      }
    };
    if (unreadMsgsData) {
      const unreadButton = document.querySelector(".unreadMsgs");
      unreadButton.innerHTML =
        '<button id="unread" class="ui inverted button compact">Unread Messages</button>';
      unreadButton.innerHTML +=
        '<div class="unreadMsgBlock"><ul class="unreadMsgList"></ul></div>';
      const unreadMsgList = document.querySelector(".unreadMsgList");
      console.log("unreadMsgList", unreadMsgList);
      for (let i = 0; i < unreadMsgsData.length; i += 1) {
        const item = document.createElement("li");
        item.id = `${unreadMsgsData[i].username}`;
        item.innerHTML = `<span> ${unreadMsgsData[i].username}</span>`;
        unreadMsgList.appendChild(item);
        // eslint-disable-next-line no-loop-func
        item.addEventListener("click", function (e) {
          e.preventDefault();
          const username2 = this.id;
          const chatID = unreadMsgMap.get(username2);
          window.location.href = `/chatRoom/${chatID}/${username2}`;
        });
      }
      const unread = document.getElementById("unread");
      unread.addEventListener("click", clickUnreadMsgBlock);
    }
  } catch (err) {
    console.log(err);
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
    // window.location.href = "/directory";
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
    // window.location.href = "/directory";
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
    // window.location.href = "/directory";
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
    // window.location.href = "/directory";
  } catch (error) {
    console.log(error);
  }
});
