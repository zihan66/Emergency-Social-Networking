const { cookies } = brownies;
const sendMsg = document.getElementById("sendMsg-button");
const searchResult = document.querySelector(".searchResultList");
const pathname = document.URL.split("/");
console.log("pathname", pathname);
const criteria = pathname[4];
const chatID = pathname[5];
let page = 1;
const statusImage = (lastStatusCode) => {
  let userStatus = "";
  if (lastStatusCode === "OK") userStatus = "green";
  else if (lastStatusCode === "HELP") userStatus = "yellow";
  else if (lastStatusCode === "EMERGENCY") userStatus = "red";
  else userStatus = "grey";
  return userStatus;
};

const searchInput = document.getElementById("searchInput");

const searchUser = async (searchContent) => {
  try {
    const response = await fetch(`/search/username?q=${searchContent}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const usernameInfo = await response.json();
    console.log("usernameInfo", usernameInfo);
    searchResult.innerHTML = `<div class="online"> online </div> <hr/>
                                       <div class="onlineUsers"> </div> 
                                       <div class="offline"> offline </div> <hr/>
                                      <div class="offlineUsers"> </div>`;
    const onlineUser = document.querySelector(".onlineUsers");
    const offlineUser = document.querySelector(".offlineUsers");
    for (let i = 0; i < usernameInfo.length; i++) {
      const userStatus = statusImage(usernameInfo[i].status);
      const item = document.createElement("li");
      item.className = "userSearchResult";
      item.innerHTML = `<span class="directoryUsername">${usernameInfo[i].username}</span>
                                    <span class="directoryStatus">Status:</span>
                                    <span><img src="../images/${userStatus}.png">${usernameInfo[i].status}</span>`;

      if (usernameInfo[i].isLogin === true) {
        onlineUser.appendChild(item);
      } else if (usernameInfo[i].isLogin === false) {
        offlineUser.appendChild(item);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const searchStatus = async (searchContent) => {
  try {
    const response = await fetch(`/search/users?status=${searchContent}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const usernameInfo = await response.json();
    console.log("usernameInfo", usernameInfo);
    const userStatus = statusImage(usernameInfo[0].status);

    searchResult.innerHTML = `<div class="searchStatus"> Citizens with status <span><img src="../images/${userStatus}.png">${usernameInfo[0].status}</span> </div>
                              <div class="online"> online </div> <hr/>
                                       <div class="onlineUsers"> </div> 
                                       <div class="offline"> offline </div> <hr/>
                                      <div class="offlineUsers"> </div>`;
    const onlineUser = document.querySelector(".onlineUsers");
    const offlineUser = document.querySelector(".offlineUsers");
    for (let i = 0; i < usernameInfo.length; i++) {
      const item = document.createElement("li");
      item.className = "resultList";
      item.innerHTML = `<span class="username">${usernameInfo[i].username}</span>`;
      if (usernameInfo[i].isLogin === true) {
        onlineUser.appendChild(item);
      } else if (usernameInfo[i].isLogin === false) {
        offlineUser.appendChild(item);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const searchPublicMessage = async (searchContent) => {
  try {
    searchResult.innerHTML = "";
    const response = await fetch(
      `/search/publicMessage?q=${searchContent}&page=${page}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      }
    );
    const publicMessageInfo = await response.json();
    console.log("publicMessageInfo", publicMessageInfo);
    for (let i = 0; i < publicMessageInfo.length; i++) {
      const item = document.createElement("li");
      const author = publicMessageInfo[i].author;
      const content = publicMessageInfo[i].content;
      const deliveryStatus = publicMessageInfo[i].deliveryStatus;
      const postedAt = publicMessageInfo[i].postedAt;
      const userStatus = statusImage(deliveryStatus);

      if (author === cookies.username) item.className = "self-message";
      else item.className = "other-message";
      item.innerHTML = `${content}
                                        <span class="publicMsgUsername">Sent by ${
                                          author === cookies.username
                                            ? "you"
                                            : author
                                        } </span>`;
      const p = document.createElement("p");
      p.innerHTML = `<span class="publicMsgStatus">${author}'s status: <img src="../images/${userStatus}.png"> ${deliveryStatus}</span>`;
      item.appendChild(p);
      item.innerHTML += `<span class="publicMsgTimestamp">${moment(
        postedAt
      ).format("MMM Do YY, h:mm:ss")}</span>`;
      searchResult.appendChild(item);
    }
    const label = document.createElement("div");
    label.innerHTML = `<center><button onclick="viewMorePublicMsg()" id="viewMore" class="ui inverted button compact">
                                    View More </button></center>`;
    searchResult.appendChild(label);
  } catch (error) {
    console.log(error);
  }
};

const searchPrivateMessage = async (searchContent) => {
  try {
    searchResult.innerHTML = "";
    const response = await fetch(
      `/search/publicMessage?q=${searchContent}&chatId=${chatID}&page=${page}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      }
    );
    const publicMessageInfo = await response.json();
    console.log("publicMessageInfo", publicMessageInfo);
    for (let i = 0; i < publicMessageInfo.length; i++) {
      const item = document.createElement("li");
      const author = publicMessageInfo[i].author;
      const content = publicMessageInfo[i].content;
      const deliveryStatus = publicMessageInfo[i].deliveryStatus;
      const postedAt = publicMessageInfo[i].postedAt;
      const userStatus = statusImage(deliveryStatus);

      if (author === cookies.username) item.className = "self-message";
      else item.className = "other-message";
      item.innerHTML = `${content}
                                          <span class="publicMsgUsername">Sent by ${
                                            author === cookies.username
                                              ? "you"
                                              : author
                                          } </span>`;
      const p = document.createElement("p");
      p.innerHTML = `<span class="publicMsgStatus">${author}'s status: <img src="../images/${userStatus}.png"> ${deliveryStatus}</span>`;
      item.appendChild(p);
      item.innerHTML += `<span class="publicMsgTimestamp">${moment(
        postedAt
      ).format("MMM Do YY, h:mm:ss")}</span>`;
      searchResult.appendChild(item);
    }
    const label = document.createElement("div");
    label.innerHTML = `<center><button onclick="viewMorePublicMsg()" id="viewMore" class="ui inverted button compact">
                                      View More </button></center>`;
    searchResult.appendChild(label);
  } catch (error) {
    console.log(error);
  }
};

const searchStatusChange = async (searchContent) => {
  try {
    searchResult.innerHTML = "";
    const response = await fetch(
      `/search/status?q=${searchContent}&chatId=${chatID}&page=${page}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      }
    );
    const statusChangeInfo = await response.json();
    for (let i = 0; i < statusChangeInfo.length; i++) {
      const item = document.createElement("li");
      const updatedAt = statusChangeInfo[i].updatedAt;
      const status = statusChangeInfo[i].statusCode;
      const userStatus = statusImage(status);

      searchResult.innerHTML = `<div class="statusChangeTitle"> ${statusChangeInfo[0].username} status changes: </div>`;

      item.innerHTML = `<span class="statusChange"><img src="../images/${userStatus}.png">${status}</span> <span class="statusChangeTime">${moment(
        updatedAt
      ).format("MMM Do YY, h:mm:ss")}</span>`;
      searchResult.appendChild(item);
    }
    const label = document.createElement("div");
    label.innerHTML = `<button onclick="viewMoreStatusChanges()" id="viewMore" class="ui inverted button compact">
                                      View More </button>`;
    searchResult.appendChild(label);
  } catch (error) {
    console.log(error);
  }
};

const viewMorePublicMsg = () => {
  const searchContent = searchInput.value;
  page = page + 1;
  searchPublicMessage(searchContent);
};

const viewMoreStatusChanges = () => {
  const searchContent = searchInput.value;
  page = page + 1;
  searchStatusChange();
};

sendMsg.addEventListener("click", async () => {
  const searchContent = searchInput.value;
  if (!searchContent) return;
  if (criteria === "user") {
    searchUser(searchContent);
  }
  if (criteria === "status") {
    searchStatus(searchContent);
  }
  if (criteria === "publicMessage") {
    searchPublicMessage(searchContent);
  }
  if (criteria === "announcement") {
  }
  if (criteria === "privateMessage") {
    if (searchContent === "status") {
      searchStatusChange(searchContent);
    } else {
      searchPrivateMessage(searchContent);
    }
  }
});

const leave = document.querySelector("#leave");
leave.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (criteria === "status" || criteria === "user") {
    window.location.href = "/directory";
  } else if (criteria === "publicMessage") {
    window.location.href = "/publicWall";
  } else if (criteria === "privateMessage") {
    window.location.href = "/chatRoom";
  } else if (criteria === "privateMessage") {
    window.location.href = "/announcement";
  }
});
