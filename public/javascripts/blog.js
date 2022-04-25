import ejectUser from "../javascripts/common/logout.js";
const msgContainer = document.querySelector(".message-container");
const msgList = document.querySelector(".message-list");
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io({ URL: "http://localhost:3000", autoConnect: false });
const pathname = document.URL.split("/");
const chatID = pathname[pathname.length - 2];
const another = pathname[pathname.length - 1];
console.log(`/messages/private?chatID=${chatID}`);

const getCorrectStatusSpan = (deliveryStatus) => {
  let recStatus = "";
  if (deliveryStatus === "OK") recStatus = "green";
  else if (deliveryStatus === "Help") recStatus = "yellow";
  else if (deliveryStatus === "Emergency") recStatus = "red";
  else recStatus = "grey";
  return recStatus;
};
// inform user of force injection
socket.on("ejectOneUser", async (message) => {
  ejectUser(message);
});

const getAllMessages = async () => {
  try {
    const response = await fetch(`/messages/private?chatID=${chatID}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (err) {
    console.error(err);
  }
};

const getUserStatus = async (username) => {
  try {
    const response = await fetch(`/users/${userName}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = await response.json();
    return data.lastStatusCode;
  } catch (error) {
    console.error(error);
  }
};

const getChatInfo = async () => {
  try {
    const response = await fetch(`/chats/${chatId}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = await response.json();
  } catch (err) {
    console.err(err);
  }
};

const addSingleMessage = (message) => {
  const { content, author, deliveryStatus, postedAt } = message;
  const item = document.createElement("div");
  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.innerHTML = `<i class="user circle ${
    author !== cookies.username && "outline"
  } icon"></i>
  <span class="username">${author}</span>`;
  item.appendChild(avatar);
  const paragraph = document.createElement("p");
  paragraph.innerHTML = `${content}`;
  if (author === cookies.username) {
    item.className = "self-message";
    paragraph.className = "self-content";
  } else {
    item.className = "other-message";
    paragraph.className = "other-content";
  }
  const timeStamp = document.createElement("div");
  timeStamp.className = "time-stamp";
  timeStamp.innerHTML = `sent at ${moment(postedAt).format(
    "MMM Do YY, h:mm:ss"
  )}
  <span class="message-status">
    the user was
    <img class="status" src="../../images/${getCorrectStatusSpan(
      deliveryStatus
    )}.png"></span>
  </span>`;
  item.appendChild(paragraph);
  item.appendChild(timeStamp);
  msgList.appendChild(item);
};

const appendPreviousMessages = (messages) => {
  messages.map(addSingleMessage, true);
};

socket.on("privateMessage", async (message) => {
  console.log(message);
  addSingleMessage(message);
  msgContainer.scrollTop = msgContainer.scrollHeight;
  await readMessage(message._id);
});

socket.on("updateStatus", (user) => {
  if (user.username === another) {
    const header1 = document.querySelector(".header1");
    header1.innerHTML = `${another}'s <span class="current-status">current status</span>
    <img  src="../../images/${getCorrectStatusSpan(user.lastStatusCode)}.png">`;
  }
});

const sendButton = document.getElementById("delete-button");
sendButton.addEventListener("click", async (e) => {
  // const msgInput = document.getElementById("msg");
  // const msgContent = msgInput.value;
  // const { username } = cookies;
  e.preventDefault();
  e.stopPropagation();
  // if (!msgContent) return;
  // msgInput.value = "";
  const msgInput = document.getElementById("blogID");
  const blogID = msgInput.value;
  if (!blogID) return;
  // const requestBody = {
  //   author: username,
  //   content: msgContent,
  //   target: another,
  //   chatID,
  // };
  try {
    const response = await fetch(`/blog/delete/${blogID}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      // body: JSON.stringify(requestBody),
    });
    window.location.href = "/blogWall";
  } catch (error) {
    console.error(error);
  }
  msgInput.focus();
});

window.addEventListener("load", async () => {
  try {
    // const status = await getUserStatus(username);
    socket.auth = { username: cookies.username };
    socket.connect();
    const repsonse = await fetch(`/users/${another}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const status = await repsonse.json();
    const header1 = document.querySelector(".header1");
    header1.innerHTML = `${another}'s <span class="current-status">current status</span>
    <img  src="../../images/${getCorrectStatusSpan(
      status.userLastStatus
    )}.png">`;
    const data = await getAllMessages();
    if (data.messages) appendPreviousMessages(data.messages);
  } catch (err) {
    console.error(err);
  }
});

const leave = document.querySelector("#leave");
leave.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = "/directory";
});

const search = document.querySelector("#backToBlogWall");
search.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = "/blogWall";
}); // TO-DO: remove

// const sendButton = document.getElementById("newBlog-button");
// sendButton.addEventListener("click", async (e) => {
//   const msgInput = document.getElementById("msg");
//   const msgContent = msgInput.value;
//   const { username } = cookies;
//   e.preventDefault();
//   e.stopPropagation();
//   if (!msgContent) return;
//   msgInput.value = "";
//   const requestBody = {
//     author: username,
//     content: msgContent,
//     target: another,
//     chatID,
//   };
//   try {
//     const response = await fetch("/messages/private", {
//       method: "post",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${cookies.jwtToken}`,
//       },
//       body: JSON.stringify(requestBody),
//     });
//   } catch (error) {
//     console.error(error);
//   }
//   msgInput.focus();
// });

const likeButton = document.getElementById("like-button");
likeButton.addEventListener("click", async (e) => {
  const likeButton = document.querySelector(".likeButtonDiv");
  const dislikeButton = document.querySelector(".dislikeButtonDiv");
  const plusHeart = document.querySelector(".plusHeart");
  // if (likeButton.style.display === "block") {
  //   likeButton.style.display = "";
  // } else {
  //   likeButton.style.display = "block";
  // }
  likeButton.style.display = "none";
  dislikeButton.style.display = "block";
  plusHeart.style.display = "block";
  e.preventDefault();
  e.stopPropagation();
  const msgInput = document.getElementById("blogID");
  const blogID = msgInput.value;
  if (!blogID) return;
  try {
    const response = await fetch(`/blog/like/${blogID}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      // body: JSON.stringify(requestBody),
    });
    // window.location.href = "/blogWall";
  } catch (error) {
    console.error(error);
  }
});
// const likeButton = document.getElementById("like-button");
// likeButton.addEventListener("click", clickLikeButton);

const dislikeButton = document.getElementById("dislike-button");
dislikeButton.addEventListener("click", async (e) => {
  const likeButton = document.querySelector(".likeButtonDiv");
  const dislikeButton = document.querySelector(".dislikeButtonDiv");
  const plusHeart = document.querySelector(".plusHeart");
  // if (likeButton.style.display === "block") {
  //   likeButton.style.display = "";
  // } else {
  //   likeButton.style.display = "block";
  // }
  likeButton.style.display = "block";
  dislikeButton.style.display = "none";
  plusHeart.style.display = "none";
  e.preventDefault();
  e.stopPropagation();
  const msgInput = document.getElementById("blogID");
  const blogID = msgInput.value;
  if (!blogID) return;
  try {
    const response = await fetch(`/blog/dislike/${blogID}`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      // body: JSON.stringify(requestBody),
    });
    // window.location.href = "/blogWall";
  } catch (error) {
    console.error(error);
  }
});
// const dislikeButton = document.getElementById("dislike-button");
// dislikeButton.addEventListener("click", clickDislikeButton);

const editButton = document.getElementById("edit-button");
editButton.addEventListener("click", async (e) => {
  const msgInput = document.getElementById("editBlogContent");
  var msgInput2 = document.getElementById("editBlogPicture");
  const msgInput3 = document.getElementById("editBlogText");
  // console.log("msgInput2: ",msgInput2);
  const msgContent = msgInput.value;
  var pictureSelect = msgInput2.value;
  // console.log("pictureSelect: ",pictureSelect);
  const text = msgInput3.value;
  const { username } = cookies;
  e.preventDefault();
  e.stopPropagation();
  //if (!msgContent) return;
  // msgInput.value = "";
  const requestBody = {
    username,
    content: msgContent,
    picture: pictureSelect,
    text: text,
  };
  console.log("picture:", requestBody.picture);
  try {
    const response = await fetch("/blog", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    window.location.href = `/blogWall`;
  } catch (error) {
    console.error(error);
  }
  msgInput.focus();
});
