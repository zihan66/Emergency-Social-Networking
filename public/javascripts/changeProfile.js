import reservedUsernameList from "../javascripts/common/constants.js";
import ejectUser from "../javascripts/common/logout.js";
const socket = io({ URL: "http://localhost:3000", autoConnect: false });
socket.auth = { username: cookies.username };
socket.connect();
const { cookies } = brownies;
// inform user of force injection
socket.on("ejectOneUser", async (message) => {
  ejectUser(message);
});

const sendButton = document.getElementById("edit-button");
sendButton.addEventListener("click", async (e) => {
  const msgInput = document.getElementById("editUsername");
  const msgInput2 = document.getElementById("editPassword");
  const msgInput3 = document.getElementById("editPrivilege");
  // const msgInput4 = document.getElementById("editAccountStatus");
  const username = msgInput.value;
  const password = msgInput2.value;
  var privilege = msgInput3.options[msgInput3.selectedIndex].text;
  // var accountStatus = msgInput4.options[msgInput4.selectedIndex].text;
  // const { username } = cookies;
  e.preventDefault();
  e.stopPropagation();
  //if (!msgContent) return;
  // msgInput.value = "";
  const oldUserNameInput = document.getElementById("oldUserName");
  const oldUserName = oldUserNameInput.value;
  if (!oldUserName) return;

  if (username.length == 0) {
    const ele = document.querySelector("#username-hint");
    ele.innerHTML = "Username cannot be empty";
    return;
  }

  if (reservedUsernameList.includes(username)) {
    const ele = document.querySelector("#username-hint");
    ele.innerHTML = "Username is reserved, please choose another one";
    return;
  }

  if (password.length < 4 && password.length != 0) {
    const eleP = document.querySelector("#password-hint");
    eleP.innerHTML = "Password should have minimum four characters";
    return;
  }

  // const requestBody = { username:username, password:password, privilege:privilege, accountStatus:accountStatus};
  const requestBody = {
    username: username,
    password: password,
    privilege: privilege,
  };
  console.log("old username:", oldUserName);
  console.log("username:", username);
  console.log("password:", password);
  console.log("privilege:", privilege);
  // console.log("accountStatus:",accountStatus);
  // const requestBody = { username:username, password:password, privilege:privilege};
  // console.log("picture:",requestBody.picture);
  try {
    const response = await fetch(`/users/${oldUserName}`, {
      // ???
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    // window.location.href = `/directoryForAdmin`;
  } catch (error) {
    console.error(error);
  }
  msgInput.focus();
});

const leave = document.querySelector("#leave");
leave.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = "/directoryForAdmin";
});

const activeButton = document.getElementById("active-button");
activeButton.addEventListener("click", async (e) => {
  const activeButton = document.querySelector(".activeButtonDiv");
  const inactiveButton = document.querySelector(".inactiveButtonDiv");
  // const plusHeart = document.querySelector(".plusHeart");
  // if (activeButton.style.display === "block") {
  //   activeButton.style.display = "";
  // } else {
  //   activeButton.style.display = "block";
  // }
  activeButton.style.display = "none";
  inactiveButton.style.display = "block";
  // plusHeart.style.display = "block";
  e.preventDefault();
  e.stopPropagation();
  const msgInput = document.getElementById("oldUserName");
  const oldUserName = msgInput.value;
  if (!oldUserName) return;
  try {
    const response = await fetch(`/users/${oldUserName}/active`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      // body: JSON.stringify(requestBody),
    });
    // window.location.href = "/userWall";
  } catch (error) {
    console.error(error);
  }
});

const inactiveButton = document.getElementById("inactive-button");
inactiveButton.addEventListener("click", async (e) => {
  const activeButton = document.querySelector(".activeButtonDiv");
  const inactiveButton = document.querySelector(".inactiveButtonDiv");
  // const plusHeart = document.querySelector(".plusHeart");
  // if (activeButton.style.display === "block") {
  //   activeButton.style.display = "";
  // } else {
  //   activeButton.style.display = "block";
  // }
  activeButton.style.display = "block";
  inactiveButton.style.display = "none";
  // plusHeart.style.display = "none";
  e.preventDefault();
  e.stopPropagation();
  const msgInput = document.getElementById("oldUserName");
  const oldUserName = msgInput.value;
  if (!oldUserName) return;
  console.log("oldUserName: ", oldUserName);
  try {
    const response = await fetch(`/users/${oldUserName}/inactive`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      // body: JSON.stringify(requestBody),
    });
    // window.location.href = "/userWall";
  } catch (error) {
    console.error(error);
  }
});
