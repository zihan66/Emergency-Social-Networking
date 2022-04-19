const msgContainer = document.querySelector(".blog-container");
const msgList = document.querySelector(".blog-list");
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io({ URL: "http://localhost:3000", autoConnect: false });

const getAllBlogs = async () => {
  try {
    const response = await fetch("/blog", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = response.json();
    console.log("blogdata", data);
  } catch (err) {
    console.error(err);
  }
};

const addSingleBlog = (blog, before) => {
  const { content, author, deliveryStatus, postedAt, _id} = blog;

  const item = document.createElement("li");
  item.addEventListener("click", async function (e) {
    e.preventDefault();
    const the_id = _id;
    window.location.href = `/blog/${the_id}`;
  });
  let userStatus = "";
  if (deliveryStatus === "OK") userStatus = "green";
  else if (deliveryStatus === "HELP") userStatus = "yellow";
  else if (deliveryStatus === "EMERGENCY") userStatus = "red";
  else userStatus = "grey";
  if (author === cookies.username) item.className = "self-blog";
  else item.className = "other-blog";
  item.innerHTML = `${content}
  <span class="username">Sent by ${
    author === cookies.username ? "you" : author
  } </span>`;
  item.innerHTML = `${content}
  <span> - ID: ${_id}</span>`;
  const p = document.createElement("p");
  p.innerHTML = `<span class="status">${author}'s status: <img src="../images/${userStatus}.png"> ${deliveryStatus}</span>`;
  item.appendChild(p);
  item.innerHTML += `<span class="time-stamp">${moment(postedAt).format(
    "MMM Do YY, h:mm:ss"
  )}</span>`;
  if (before === false) msgContainer.appendChild(item);
  else msgContainer.insertBefore(item, msgContainer.lastChild);
};

const appendPreviousBlogs = (blogs) => {
  blogs.map(addSingleBlog, true);
  msgContainer.scrollTop = msgContainer.scrollHeight;
};





const sendButton = document.getElementById("msg-button");

sendButton.addEventListener("click", async (e) => {
  const msgInput = document.getElementById("msg");
  var msgInput2 = document.getElementById("pictureSelect");
  const msgInput3 = document.getElementById("blogText");
  const msgContent = msgInput.value;
  var pictureSelect = msgInput2.options[msgInput2.selectedIndex].text;
  const text = msgInput3.value;
  const { username } = cookies;
  e.preventDefault();
  e.stopPropagation();
  msgInput.value = "";
  const requestBody = { username, content: msgContent, picture: pictureSelect, text: text};
  console.log("picture:",requestBody.picture);
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


const leave = document.querySelector("#leave");
leave.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = "/directory";
});

const backToBlogWall = document.querySelector("#backToBlogWall");
backToBlogWall.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = `/blogWall`;
});
