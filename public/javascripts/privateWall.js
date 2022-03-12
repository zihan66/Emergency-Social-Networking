const msgContainer = document.querySelector(".message-container");

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
  if (before === false) msgContainer.appendChild(item);
  else msgContainer.insertBefore(item, msgContainer.firstChild);
};

const appendPreviousMessages = (messages) => {
  msgContainer.innerHTML = "";
  messages.map(addSingleMessage, true);
};

socket.on("privateMessage", (messages) => {
  msgContainer.innerHTML = "";
  appendPreviousMessages(messages);
  msgContainer.scrollTop = 0;
});

const sendButton = document.getElementById("msg-button");

sendButton.addEventListener("click", async (e) => {
  const { search } = window.location;
  const msgInput = document.getElementById("msg");
  const msgContent = msgInput.value;
  const { username } = cookies;
  // eslint-disable-next-line camelcase
  const chat_id = search.split("?chat_id=")[1].split("&")[0];
  const username2 = search.split("username2=")[1];
  e.preventDefault();
  e.stopPropagation();
  if (!msgContent) return;
  msgInput.value = "";
  const requestBody = {
    sendignUserName: username,
    receivingUserName: username2,
    content: msgContent,
    conversationId: chat_id,
  };
  try {
    const response = await fetch("/messages/private", {
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
    const { search } = window.location;
    const chat_id = search.split("?chat_id=")[1].split("&")[0]
    const username2 = search.split("username2=")[1];
    const response = await fetch(`/messages/private?chat_id${chat_id}&username2=${username2}`, {
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
