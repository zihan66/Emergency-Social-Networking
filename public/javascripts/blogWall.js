const msgContainer = document.querySelector(".blog-container");
const msgList = document.querySelector(".blog-list");
//const infScroll = new InfiniteScroll(msgList);
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
  const { content, author, deliveryStatus, postedAt, picture,likeCount, _id} = blog;

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
  item.innerHTML = `<span class="username">${content}</span>`;
  const p1 = document.createElement("p");
  p1.innerHTML = `<span class="picture"><img src="../images/${picture}.jpg"></span>`;
  item.appendChild(p1);
  const p = document.createElement("p");
  p.innerHTML = `<span class="status">By: ${author} <img src="../images/${userStatus}.png"></span>`;
  item.appendChild(p);
  item.innerHTML += `<div class="ui labeled button" tabindex="0">
  <div class="ui red button">
    <i class="heart icon"></i> Like
  </div>
  <a class="ui basic red left pointing label">
    ${likeCount}
  </a>
</div>`;
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

socket.on("blog", (blog) => {
  addSingleBlog(blog, true);
  msgContainer.scrollTop = msgContainer.scrollHeight;
});

socket.on("privateBlog", (blog) => {
  const { target, author } = blog;
  if (target === cookies.username)
    window.alert("You received a new blog from " + author);
});

// const sendButton = document.getElementById("msg-button");
// sendButton.addEventListener("click", async (e) => {
//   const msgInput = document.getElementById("msg");
//   const msgContent = msgInput.value;
//   const { username } = cookies;
//   e.preventDefault();
//   e.stopPropagation();
//   //if (!msgContent) return;
//   msgInput.value = "";
//   const requestBody = { username, content: msgContent };
//   try {
//     const response = await fetch("/blog", {
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

window.addEventListener("load", async () => {
  try {
    socket.auth = { username: cookies.username };
    socket.connect();
    const response = await fetch("/blog", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = await response.json();
    appendPreviousBlogs(data);
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

const search = document.querySelector("#newBlog");
search.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = `/blog/newBlog`;
});
