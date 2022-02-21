const fakeData = [
  {
    content: "lareom laroeam",
    username: "Zihan",
    status: "OK",
    timeStamp: "Jan 16th 22, 8:56:05 ",
  },
];

const msgContainer = document.querySelector(".message-container");
const { cookies } = brownies;
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

const appendSingleMessage = (message) => {
  const { content, username, status, timeStamp } = message;

  const item = document.createElement("li");
  const recStatus =
    status === "OK" ? "green" : status === "Help" ? "yellow" : "red";
  if (username === cookies.username) item.className = "self-message";
  else item.className = "other-message";
  item.innerHTML = `${content}
  <span class="username">Sent by ${
    username === cookies.username ? "you" : username
  } </span>`;
  const p = document.createElement("p");
  p.innerHTML = ` in
  <span class="${recStatus}"></span>
  situation`;
  item.appendChild(p);
  item.innerHTML += `<span class="time-stamp">${timeStamp}</span>`;
  msgContainer.appendChild(item);
};

const appendPreviousMessages = (messages) => {
  messages.map(appendSingleMessage);
};

window.addEventListener("load", () => {
  appendPreviousMessages(fakeData);
});
