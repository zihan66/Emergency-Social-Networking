const fakeData = [
  {
    content: "lareom laroeam",
    username: "Zihan",
    status: "OK",
    timeStamp: "Jan 16th 22, 8:56:05 ",
  },
];

const msgContainer = document.querySelector(".message-container");
const msgList = document.querySelector(".message-list");
const infScroll = new InfiniteScroll(msgList);
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io();

const getAllMessages = async () => {
  try {
    const response = await fetch("/messages/public", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = response.json();
  } catch (err) {
    console.error(err);
  }
};

const addSingleMessage = (message, before) => {
  const { content, username, status, timeStamp } = message;

  const item = document.createElement("li");
  let recStatus = "";
  if (status === "OK") recStatus = "green";
  else if (status === "Help") recStatus = "yellow";
  else if (status === "Emergency") recStatus = "red";
  if (username === cookies.username) item.className = "self-message";
  else item.className = "other-message";
  item.innerHTML = `${content}
  <span class="username">Sent by ${
    username === cookies.username ? "you" : username
  } </span>`;
  const p = document.createElement("p");
  p.innerHTML = `${username}'s status is ${status}
  <span class="${recStatus}"></span>`;
  item.appendChild(p);
  item.innerHTML += `<span class="time-stamp">${timeStamp}</span>`;
  if (before === false) msgContainer.appendChild(item);
  else msgContainer.insertBefore(item, msgContainer.firstChild);
};

const appendPreviousMessages = (messages) => {
  messages.map(addSingleMessage, true);
};

socket.on("publicMessage", (message) => {
  addSingleMessage(message, true);
  msgContainer.scrollTop = 0;
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

window.addEventListener("load", () => {
  // appendPreviousMessages(fakeData);
  getAllMessages();
});
