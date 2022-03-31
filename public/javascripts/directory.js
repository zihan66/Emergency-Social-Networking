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
      window.location.href = `/chatRoom/${chatID}/${username2}`;
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
    // const unreadMsgs = await fetch(
    //   `/messages/private/unread?username=${cookies.username}`,
    //   {
    //     method: "get",
    //     headers: {
    //       Authorization: `Bearer ${cookies.jwtToken}`,
    //     },
    //   }
    // );
    // const unreadMsgsData = await unreadMsgs.json();
    
    //let msgNum = 0;
    // for (let i = 0; i < unreadMsgsData.length; i += 1) {
    //   unreadMsgMap.set(unreadMsgsData[i].username, unreadMsgsData[i].chatID);
    //   calculateMsgNum(unreadMsgsData[i].username);
    //   // if(msgNumMap.has(unreadMsgsData[i].username)){
    //   //   msgNum++;
    //   //   msgNumMap.set(unreadMsgsData[i].username, msgNum);
    //   // }else{
    //   //   msgNumMap.set(unreadMsgsData[i].username, 1);
    //   // }
    // }
    // console.log("unreadMsgMap",unreadMsgMap);
    // console.log("msgNumMap", msgNumMap);
    // // const clickUnreadMsgBlock = () => {
    //   const unreadMsgBlock = document.querySelector(".unreadMsgBlock");
    //   if (unreadMsgBlock.style.display === "block") {
    //     unreadMsgBlock.style.display = "";
    //   } else {
    //     unreadMsgBlock.style.display = "block";
    //   }
    // };
    // if (unreadMsgsData) {
    //   const unreadButton = document.querySelector(".unreadMsgs");
    //   unreadButton.innerHTML =
    //     '<button id="unread" class="ui inverted button compact">Unread Messages</button>';
    //   unreadButton.innerHTML +=
    //     '<div class="unreadMsgBlock"><ul class="unreadMsgList"></ul></div>';
    //   const unreadMsgList = document.querySelector(".unreadMsgList");

      // for (let i = 0; i < unreadMsgsData.length; i += 1) {
      //   const item = document.createElement("li");
      //   item.id = `${unreadMsgsData[i].username}`;
      //   // const msgNum = 0;
      //   // if({unreadMsgsData[i].username)
      //   item.innerHTML = `<span> ${unreadMsgsData[i].username}</span><span class="msgNum"></span>`;
      //   unreadMsgList.appendChild(item);
      //   // eslint-disable-next-line no-loop-func
      //   item.addEventListener("click", function (e) {
      //     e.preventDefault();
      //     const username2 = this.id;
      //     const chatID = unreadMsgMap.get(username2);
      //     window.location.href = `/chatRoom/${chatID}/${username2}`;
      //   });
      // }

      // const addUnreadMsg = () => {
      //   msgNumMap.forEach(function(value, key ,map){
      //     const item = document.createElement("li");
      //     item.id = `${key}`;
      //     item.innerHTML = `<span> ${key}</span><span class="msgNum">${value}</span>`;
      //     unreadMsgList.appendChild(item);
      //     item.addEventListener("click", function (e) {
      //       e.preventDefault();
      //       const username2 = this.id;
      //       const chatID = unreadMsgMap.get(username2);
      //       window.location.href = `/chatRoom/${chatID}/${username2}`;
      //     });
      //   })
      // }

      // msgNumMap.forEach(function(value, key ,map){
      //   const item = document.createElement("li");
      //   item.id = `${key}`;
      //   item.innerHTML = `<span> ${key}</span><span class="msgNum">${value}</span>`;
      //   unreadMsgList.appendChild(item);
      //   item.addEventListener("click", function (e) {
      //     e.preventDefault();
      //     const username2 = this.id;
      //     const chatID = unreadMsgMap.get(username2);
      //     window.location.href = `/chatRoom/${chatID}/${username2}`;
      //   });
      // })
      
      // const unread = document.getElementById("unread");
      // unread.addEventListener("click", clickUnreadMsgBlock);
    //}
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
  if(msgNumMap.has(username)){
    msgNum++;
    msgNumMap.set(username, msgNum);
  }else{
    msgNumMap.set(username, 1);
  }
}
const unread = document.getElementById("unread");
unread.addEventListener("click", async() => {
  //clickUnreadMsgBlock();
  const unreadMsgBlock = document.querySelector(".unreadMsgBlock");
  if (unreadMsgBlock.style.display === "block") {
    unreadMsgBlock.style.display = "";
  } else {
    unreadMsgBlock.style.display = "block";
  }
  //alert(unreadMsgBlock.style.display);
  
  if(unreadMsgBlock.style.display === "block" ){
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
      console.log("unreadMsgsData",unreadMsgsData);
      let msgNum = 0;
      for (let i = 0; i < unreadMsgsData.length; i += 1) {
        unreadMsgMap.set(unreadMsgsData[i].username, unreadMsgsData[i].chatID);
        if(msgNumMap.has(unreadMsgsData[i].username)){
          msgNum++;
          msgNumMap.set(unreadMsgsData[i].username, msgNum);
        }else{
          msgNum = 1
          msgNumMap.set(unreadMsgsData[i].username, msgNum);
        }
        //calculateMsgNum(unreadMsgsData[i].username);
      }
      console.log("unreadMsgMap",unreadMsgMap);
      console.log("msgNumMap", msgNumMap);
      const unreadMsgList = document.querySelector(".unreadMsgList");
      unreadMsgList.innerHTML = ""
      msgNumMap.forEach(function(value, key ,map){
        const item = document.createElement("li");
        item.id = `${key}`;
    
        item.innerHTML = `<span> ${key}</span><span class="msgNum">${value}</span>`;
        unreadMsgList.appendChild(item);
        item.addEventListener("click", function (e) {
          e.preventDefault();
          const username2 = this.id;
          const chatID = unreadMsgMap.get(username2);
          window.location.href = `/chatRoom/${chatID}/${username2}`;
        });
      });
      
    } catch (error) {
      
    }
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
search.addEventListener("click",clickSearch);
const searchUsername = document.querySelector("#searchUsername");
const searchStatus = document.querySelector("#searchStatus");
searchUsername.addEventListener("click", (e) => {
  e.preventDefault();
  const criteria = "user"
  window.location.href = `/searchPage/${criteria}`;
});
searchStatus.addEventListener("click", (e) => {
  e.preventDefault();
  const criteria = "status"
  window.location.href = `/searchPage/${criteria}`;
});