const msgContainer = document.querySelector(".message-container");
const msgList = document.querySelector(".message-list");
const infScroll = new InfiniteScroll(msgList);
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io();

const addSingleMessage = (message, before) => {
  const { content, author, deliveryStatus, postedAt } = message;

  const item = document.createElement("li");
  let recStatus = "";
  if (deliveryStatus === "OK") recStatus = "green";
  else if (deliveryStatus === "Help") recStatus = "yellow";
  else if (deliveryStatus === "Emergency") recStatus = "red";
  if (author === cookies.username) item.className = "self-message";
  else item.className = "other-message";
  item.innerHTML = `${content}
  <span class="username">Sent by ${
    author === cookies.username ? "you" : author
  } </span>`;
  const p = document.createElement("p");
  p.innerHTML = `${author}'s status is ${deliveryStatus}
  <span class="${recStatus}"></span>`;
  item.appendChild(p);
  item.innerHTML += `<span class="time-stamp">${moment(postedAt).format(
    "MMM Do YY, h:mm:ss"
  )}</span>`;
  if (before === false) msgList.appendChild(item);
  else msgList.insertBefore(item, msgList.firstChild);
};

const appendPreviousMessages = (messages) => {
  messages.map(addSingleMessage, true);
};

socket.on("publicMessage", (message) => {
  addSingleMessage(message, true);
  msgContainer.scrollTop = 0;
});

socket.on("privateMessage", (message, author) => {
  window.alert("You recieved a new message from " + author);
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
