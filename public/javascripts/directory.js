const directoryContainer = document.querySelector(".directory-container");
const userList = document.querySelector(".user-list");
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io();
const userChatMap = new Map();

const getAllUsers = async () => {};

const addSingleUser = (user) => {
  const { username, lastStatusCode, isLogin } = user;
  const item = document.createElement("li");
  item.onclick = async () => {
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
  };
  let userStatus = "";
  if (lastStatusCode === "OK") userStatus = "green";
  else if (lastStatusCode === "HELP") userStatus = "yellow";
  else if (lastStatusCode === "EMERGENCY") userStatus = "red";
  else userStatus = "grey";
  item.className = "user";
  item.id = `${username}`;
  item.innerHTML = ` <div><span class="avat">
  <i class="address card icon"></i>
    </span>
    <span class="username">${username}</span>
    <span class="online">${isLogin ? "online" : "offline"}</span>
    <span class="status">
    Status:
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

socket.on("updateStatus", (user) => {
  const id = `${user.username}Status`;
  console.log("id", id);
  const updateStatus = document.getElementById(`${id}`);
  updateStatus.innerHTML = "kkkkk";
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
    for(let i = 0; i < chatPrivateData.length; i++) {
      userChatMap.set(chatPrivateData[i].username, chatPrivateData[i].chatID);
    }
    console.log("map", userChatMap);
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

const list = userList.getElementsByTagName("li");
console.log("list", list);
console.log("length", list.length);
// for (let i = 0; i < list.length; i++){
//   alert("aaa");
// };

// userList.onmouseover = () => {
//   userList.style.backgroundColor = "white";
// };

// const changeBkColor = (obj) => {
//   obj.onmouseover = () => { this.className = "over"; };//鼠标悬停事件
//   obj.onmouseout = () => { this.className = "out"; };//鼠标离开事件
// };
// changeBkColor(userList);
// window.onload = function() {
//   let list = document.getElementsByTagName("li");
//   console.log("list", list);
//   console.log("list0", list.length);
// };

// eslint-disable-next-line no-plusplus
// for (let i = 0; i < list.length; i++) {
//   list[i].onclick = function () {
//     alert("aaaa");
//     window.location.href = "/chatPrivate";
//   };
// }
