const msgContainer = document.querySelector(".message-container");
const msgList = document.querySelector(".message-list");
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io();
const pathname = document.URL.split("/");
const chatID = pathname[pathname.length - 1];
const another = pathname[pathname.length - 2];
console.log(`/messages/private?chat_id=${chatID}`);

const getCorrectStatusSpan = (deliveryStatus) => {
  let recStatus = "";
  if (deliveryStatus === "OK") recStatus = "green";
  else if (deliveryStatus === "Help") recStatus = "yellow";
  else if (deliveryStatus === "Emergency") recStatus = "red";
  return recStatus;
};

const getAllMessages = async () => {
  try {
    const response = await fetch(`/messages/private?chat_id=${chatID}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = response.json();
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
    const data = response.json();
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
    const data = response.json();
  } catch (err) {
    console.err(err);
  }
};

const fakeData = [
  {
    content:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore voluptatibus repellat, nihil quas voluptate eligendi modi",
    author: "dihan",
    target: "zihan",
    messageID: "12344",
    deliveryStatus: "OK",
    postedAt: "2022-03-11T14:03:16-08:00",
  },
  {
    content:
      "Hello Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore voluptatibus repellat, nihil quas voluptate eligendi modi",
    author: "zihan",
    target: "Pinzhi",
    messageID: "12344",
    deliveryStatus: "OK",
    postedAt: "2022-03-11T14:03:16-08:00",
  },
];

{
  /* <div class="self-message">
  <div class="avatar">
    <i class="user circle outline icon"></i>
    <span class="username">Pinzhi</span>
    <span class="current-status">current status</span>
    <span class="red"></span>
  </div>
  <p class="content">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur dolore
    voluptatibus repellat, nihil quas voluptate eligendi modi recusandae!
    Delectus totam odio suscipit esse, sit iusto? A modi sapiente ea aliquid?
    <div class="time-stamp">
      Sent at 20111.12..12,
      <span class="message-status">
        the user was
        <span class="red"></span>
      </span>
    </div>
  </p>
</div>; */
}

const readMessage = async (messageId) => {
  try {
    const response = await fetch(`/messages/private/${messageId}/read`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
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
    <span class=${getCorrectStatusSpan(deliveryStatus)}></span>
  </span>`;
  item.appendChild(paragraph);
  item.appendChild(timeStamp);
  msgList.appendChild(item);
};

const appendPreviousMessages = (messages) => {
  messages.map(addSingleMessage, true);
};

socket.on("privateMessage", async (message) => {
  addSingleMessage(message);
  msgContainer.scrollTop = msgContainer.scrollHeight;
  await readMessage(message.id);
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
  const requestBody = {
    author: username,
    content: msgContent,
    target: another,
    chatID,
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
    // const status = await getUserStatus(username);
    const status = "OK";
    const header1 = document.querySelector(".header1");
    header1.innerHTML = `${another}'s <span class="current-status">current status</span>
    <span class=${getCorrectStatusSpan(status)}></span>`;
    requestBody = { username1: "zihan", username2: "pinzhi" };
    const response = await fetch("/chats", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    const data = await getAllMessages();
    appendPreviousMessages(fakeData);
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
