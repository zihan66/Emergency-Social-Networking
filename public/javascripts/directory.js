const directoryContainer = document.querySelector(".directory-container");
const userList = document.querySelector(".user-list");
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

const addSingleUser = (user) => {
  const { username, lastStatusCode, isLogin } = user;
  const item = document.createElement("li");
  item.addEventListener("click", async function(e) {
    e.preventDefault();
    const chatObject = this.id;
    console.log("chatObject", chatObject);
    console.log("ifexist", userChatMap.has(chatObject));
    const chatID = userChatMap.get(this.id);
    console.log("chatid", chatID);
    if (userChatMap.has(chatObject)) {
      window.location.href = `/chatRoom/${chatID}/${chatObject}`;
    } else {
      const currentUser = cookies.username;
      const data = { currentUser, chatObject };
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
  users.map(addSingleUser);
};

socket.on("userList", (users) => {
  userList.innerHTML = "";
  const allUSer = appendAllUsers(users);
  console.log("allusers", allUSer);
  directoryContainer.scrollTop = 0;
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

    const chatPrivateInfo = await fetch(`/chats/${cookies.username}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    //const chatPrivateData = await chatPrivateInfo.json();
    const chatPrivateData = await chatPrivateInfo.json();
    console.log("chatPrivate", chatPrivateData);
    console.log("chatPrivate", chatPrivateData.length);
    for (let i = 0; i < chatPrivateData.length; i++) {
      userChatMap.set(chatPrivateData[i].username, chatPrivateData[i].chatID);
    }
    console.log("userChatMap", userChatMap);

    const unreadMsgs = await fetch(`/messages/private/unread/${cookies.username}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
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
      unreadButton.innerHTML = '<button id="unread" class="ui inverted button compact">Unread Messages</button>';
      unreadButton.innerHTML += '<div class="unreadMsgBlock"><ul class="unreadMsgList"></ul></div>';
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
          const chatObject = this.id;
          const chatID = unreadMsgMap.get(chatObject);
          window.location.href = `/chatRoom/${chatID}/${chatObject}`;
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

// const list = userList.getElementsByTagName("li");
// console.log("list", list);
// console.log("length", list.length);
