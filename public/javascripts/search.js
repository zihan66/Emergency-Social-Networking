const { cookies } = brownies;
const sendMsg = document.getElementById("sendMsg-button");
const deleteMsg = document.getElementById("deleteMsg-button");
const searchResult = document.querySelector(".searchResultList");
const pathname = document.URL.split("/");
const username = pathname[6];
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
const hint = document.querySelector(".hint");
const searchTitle = document.querySelector(".searchTitle");

const searchResultIsEmpty = () => {
  hint.innerHTML = "There is no matching result";
  searchResult.innerHTML = "";
};
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
    if (usernameInfo.length == 0) {
      searchResultIsEmpty();
      return;
    }
    searchResult.innerHTML = `<div class="online"> online </div> <hr/>
                                       <div class="onlineUsers"> </div> 
                                       <div class="offline"> offline </div> <hr/>
                                      <div class="offlineUsers"> </div>`;
    const onlineUser = document.querySelector(".onlineUsers");
    const offlineUser = document.querySelector(".offlineUsers");
    for (let i = 0; i < usernameInfo.length; i++) {
      const userStatus = statusImage(usernameInfo[i].lastStatusCode);
      const item = document.createElement("li");
      item.className = "userSearchResult";
      item.innerHTML = `<span class="directoryUsername">${usernameInfo[i].username}</span>
                                    <span class="directoryStatus">Status:</span>
                                    <span><img src="../images/${userStatus}.png">${usernameInfo[i].lastStatusCode}</span>`;

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
    if (
      searchContent == "OK" ||
      searchContent == "HELP" ||
      searchContent == "EMERGENCY"
    ) {
      const response = await fetch(`/search/users?status=${searchContent}`, {
        method: "get",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      });
      const usernameInfo = await response.json();
      console.log("usernameInfo", usernameInfo);
      if (usernameInfo.length == 0) {
        searchResultIsEmpty();
        return;
      }
      const userStatus = statusImage(searchContent);
      searchResult.innerHTML = "";
      searchResult.innerHTML = `<div class="searchStatus"> Citizens with status <span><img src="../images/${userStatus}.png">${searchContent}</span> </div>
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
    } else {
      hint.innerHTML =
        'Input is not valid. Please enter "OK" or "HTLP" or "EMERGENCY"';
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
    const publicMessageResponse = await response.json();
    const publicMessageInfo = publicMessageResponse.result;
    const moreResult = publicMessageResponse.moreResult;
    if (publicMessageInfo.length == 0) {
      searchResultIsEmpty();
      return;
    }
    // const publicMessageInfo =  await response.json();
    // const moreResult = false;
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
                                        <span class="MsgUsername">Sent by ${
                                          author === cookies.username
                                            ? "you"
                                            : author
                                        } </span>`;
      const p = document.createElement("p");
      p.innerHTML = `<span class="MsgStatus">${author}'s status: <img src="../images/${userStatus}.png"> ${deliveryStatus}</span>`;
      item.appendChild(p);
      item.innerHTML += `<span class="MsgTimestamp">${moment(postedAt).format(
        "MMM Do YY, h:mm:ss"
      )}</span>`;
      searchResult.appendChild(item);
    }
    if (moreResult === true) {
      const label = document.createElement("div");
      label.innerHTML = `<center><button onclick="viewMorePublicMsg()" id="viewMore" class="ui inverted button compact">
                                    View More </button></center>`;
      searchResult.appendChild(label);
    }
  } catch (error) {
    console.log(error);
  }
};

const searchPrivateMessage = async (searchContent) => {
  try {
    searchResult.innerHTML = "";
    const response = await fetch(
      `/search/privateMessage?q=${searchContent}&chatId=${chatID}&page=${page}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      }
    );
    const privateMessageResponse = await response.json();
    const privateMessageInfo = privateMessageResponse.result;
    const moreResult = privateMessageResponse.moreResult;
    console.log("privateMessageInfo", privateMessageInfo);
    if (privateMessageInfo.length == 0) {
      searchResultIsEmpty();
      return;
    }
    for (let i = 0; i < privateMessageInfo.length; i++) {
      const item = document.createElement("li");
      const author = privateMessageInfo[i].author;
      const content = privateMessageInfo[i].content;
      const deliveryStatus = privateMessageInfo[i].deliveryStatus;
      const postedAt = privateMessageInfo[i].postedAt;
      const userStatus = statusImage(deliveryStatus);

      if (author === cookies.username) item.className = "self-message";
      else item.className = "other-message";
      item.innerHTML = `${content}
                                          <span class="MsgUsername">Sent by ${
                                            author === cookies.username
                                              ? "you"
                                              : author
                                          } </span>`;
      const p = document.createElement("p");
      p.innerHTML = `<span class="MsgStatus">${author}'s status: <img src="../../../images/${userStatus}.png"> ${deliveryStatus}</span>`;
      item.appendChild(p);
      item.innerHTML += `<span class="MsgTimestamp">${moment(postedAt).format(
        "MMM Do YY, h:mm:ss"
      )}</span>`;
      searchResult.appendChild(item);
    }
    if (moreResult === true) {
      const label = document.createElement("div");
      label.innerHTML = `<center><button onclick="viewMorePrivateMsg()" id="viewMore" class="ui inverted button compact">
                                        View More </button></center>`;
      searchResult.appendChild(label);
    }
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
    const statusChangeResponse = await response.json();
    const statusChangeInfo = statusChangeResponse.result;
    const moreResult = statusChangeResponse.moreResult;
    if (statusChangeInfo.length == 0) {
      searchResultIsEmpty();
      return;
    }
    searchResult.innerHTML = `<div class="statusChangeTitle"> ${statusChangeInfo[0].username} status changes: </div>`;
    for (let i = 0; i < statusChangeInfo.length; i++) {
      const item = document.createElement("li");
      item.className = "statusChangeList";
      const updatedAt = statusChangeInfo[i].updatedAt;
      const status = statusChangeInfo[i].statusCode;
      const userStatus = statusImage(status);
      item.innerHTML = `<span class="statusChange"><img src="../../../images/${userStatus}.png">${status}</span> <span class="statusChangeTime">${moment(
        updatedAt
      ).format("MMM Do YY, h:mm:ss")}</span>`;
      searchResult.appendChild(item);
    }
    if (moreResult) {
      const label = document.createElement("div");
      label.innerHTML = `<center><button onclick="viewMoreStatusChanges()" id="viewMore" class="ui inverted button compact">
                                      View More </button></center>`;
      searchResult.appendChild(label);
    }
  } catch (error) {
    console.log(error);
  }
};

const searchAnnouncement = async (searchContent) => {
  try {
    searchResult.innerHTML = "";
    const response = await fetch(
      `/search/announcement?q=${searchContent}&page=${page}`,
      {
        method: "get",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      }
    );
    const announcementResponse = await response.json();
    const announcementInfo = announcementResponse.result;
    const moreResult = announcementResponse.moreResult;
    console.log("announcementInfo", announcementInfo);
    if (announcementInfo.length == 0) {
      searchResultIsEmpty();
      return;
    }
    for (let i = 0; i < announcementInfo.length; i++) {
      const item = document.createElement("li");
      const author = announcementInfo[i].author;
      const content = announcementInfo[i].content;
      const postedAt = announcementInfo[i].postedAt;
      if (author === cookies.username) item.className = "self-message";
      else item.className = "other-message";
      item.innerHTML = `${content}
                                          <span class="MsgUsername">Sent by ${
                                            author === cookies.username
                                              ? "you"
                                              : author
                                          } </span>`;
      item.innerHTML += `<span class="MsgTimestamp">${moment(postedAt).format(
        "MMM Do YY, h:mm:ss"
      )}</span>`;
      searchResult.appendChild(item);
    }
    if (moreResult === true) {
      const label = document.createElement("div");
      label.innerHTML = `<center><button onclick="viewMoreAnnouncement()" id="viewMore" class="ui inverted button compact">
                                        View More </button></center>`;
      searchResult.appendChild(label);
    }
  } catch (error) {
    console.log(error);
  }
};

const viewMorePublicMsg = () => {
  const searchContent = searchInput.value;
  page = page + 1;
  searchPublicMessage(searchContent);
};
const viewMorePrivateMsg = () => {
  const searchContent = searchInput.value;
  page = page + 1;
  searchPrivateMessage(searchContent);
};
const viewMoreStatusChanges = () => {
  const searchContent = searchInput.value;
  page = page + 1;
  searchStatusChange();
};
const viewMoreAnnouncement = () => {
  const searchContent = searchInput.value;
  page = page + 1;
  searchAnnouncement(searchContent);
};
window.addEventListener("load", () => {
  if (criteria === "user") {
    hint.innerHTML =
      "<span>Please enter an existing username (or part of a username)</span>";
    searchTitle.innerHTML = "Search Citizens by Username";
  }

  if (criteria === "status") {
    hint.innerHTML = '<span>Please enter "OK" or "HTLP" or "EMERGENCY"</span>';
    searchTitle.innerHTML = "Search Citizens by Status";
  }

  if (criteria === "publicMessage") {
    hint.innerHTML = "<span>Please enter search content";
    searchTitle.innerHTML = "Search Public Messages";
  }

  if (criteria === "privateMessage") {
    hint.innerHTML = "<span>Please enter search content";
    searchTitle.innerHTML = "Search Private Messages";
  }
  if (criteria === "announcement") {
    searchTitle.innerHTML = "Search Announcements";
  }
});

sendMsg.addEventListener("click", async () => {
  const searchContent = searchInput.value;
  hint.innerHTML = "";
  if (!searchContent) {
    hint.innerHTML = "<span>Input can not be empty</span>";
    searchResult.innerHTML = "";
    return;
  }
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
    searchAnnouncement(searchContent);
  }
  if (criteria === "privateMessage") {
    if (searchContent === "status") {
      searchStatusChange(searchContent);
    } else {
      searchPrivateMessage(searchContent);
    }
  }
});

deleteMsg.addEventListener("click", () => {
  searchInput.value = "";
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
    window.location.href = `/chats/${chatID}/${username}`;
  } else if (criteria === "announcement") {
    window.location.href = "/announcement";
  }
});
