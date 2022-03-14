const msgContainer = document.querySelector(".message-container");

const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io();

const addSingleMessage = (message, before) => {
  const {
    content, author, deliveryStatus, postedAt,
  } = message;

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
    "MMM Do YY, h:mm:ss",
  )}</span>`;
  if (before === false) msgContainer.appendChild(item);
  else msgContainer.insertBefore(item, msgContainer.firstChild);
};

const appendPreviousMessages = (messages) => {
  messages.map(addSingleMessage, true);
};

// socket.on("unreadMessage", (message) => {
//   addSingleMessage(message, true);
//   msgContainer.scrollTop = 0;
// });

window.addEventListener("load", async () => {
  const { username } = cookies;
  console.log("username", username);
  try {
    const response = await fetch(`/messages/private/unread?username=${username}`, {
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
