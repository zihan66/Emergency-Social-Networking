const msgContainer = document.querySelector(".message-container");
const msgList = document.querySelector(".message-list");
//const infScroll = new InfiniteScroll(msgList);
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io({ URL: "http://localhost:3000", autoConnect: false });

const getAllMessages = async () => {
  try {
    const response = await fetch("/messages/public", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = response.json();
    console.log("messagedata", data);
  } catch (err) {
    console.error(err);
  }
};

const addSingleMessage = (message, before) => {
  const { content, author, deliveryStatus, postedAt } = message;

  const item = document.createElement("li");
  let userStatus = "";
  if (deliveryStatus === "OK") userStatus = "green";
  else if (deliveryStatus === "HELP") userStatus = "yellow";
  else if (deliveryStatus === "EMERGENCY") userStatus = "red";
  else userStatus = "grey";
  if (author === cookies.username) item.className = "self-message";
  else item.className = "other-message";
  item.innerHTML = `${content}
  <span class="username">Sent by ${
    author === cookies.username ? "you" : author
  } </span>`;
  const p = document.createElement("p");
  p.innerHTML = `<span class="status">${author}'s status: <img src="../images/${userStatus}.png"> ${deliveryStatus}</span>`;
  item.appendChild(p);
  item.innerHTML += `<span class="time-stamp">${moment(postedAt).format(
    "MMM Do YY, h:mm:ss"
  )}</span>`;
  if (before === false) msgContainer.appendChild(item);
  else msgContainer.insertBefore(item, msgContainer.lastChild);
};

const appendPreviousMessages = (messages) => {
  messages.map(addSingleMessage, true);
  msgContainer.scrollTop = msgContainer.scrollHeight;
};

socket.on("publicMessage", (message) => {
  addSingleMessage(message, true);
  msgContainer.scrollTop = msgContainer.scrollHeight;
});

socket.on("privateMessage", (message) => {
  const { target, author } = message;
  if (target === cookies.username)
    window.alert("You received a new message from " + author);
});

const sendButton = document.getElementById("msg-button");
sendButton.addEventListener("click", async (e) => {
  const msgInput = document.getElementById("msg");
  const msgContent = msgInput.value;
  const { username } = cookies;
  e.preventDefault();
  e.stopPropagation();
  if (!msgContent) return;
  msgInput.value = "";
  const requestBody = { username, content: msgContent };
  try {
    const response = await fetch("/messages/public", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      body: JSON.stringify(requestBody),
    });
  } catch (error) {
    console.error(error);
  }
  msgInput.focus();
});

window.addEventListener("load", async () => {
  try {
    socket.auth = { username: cookies.username };
    socket.connect();
    const response = await fetch("/messages/public", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = await response.json();
    appendPreviousMessages(data);
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
