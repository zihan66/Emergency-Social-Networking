import reservedUsernameList from "../javascripts/common/constants.js";
import ejectUser from "../javascripts/common/logout.js";
const { cookies } = brownies;
const socket = io({ URL: "http://localhost:3000", autoConnect: false });
socket.auth = { username: cookies.username };
socket.connect();
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
  e.preventDefault();
  e.stopPropagation();
  //if (!msgContent) return;
  // msgInput.value = "";
  const oldUserNameInput = document.getElementById("oldUserName");
  const oldUserName = oldUserNameInput.value;
  if (!oldUserName) return;

  if (username.length <= 3) {
    const ele = document.querySelector("#username-hint");
    ele.innerHTML = "Username need to have at least 3 characters";
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
    console.log("response:", response);

    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    ) {
      window.location.href = `/users/edit/${username}`;
    } else {
      const result = await response.json();
      if (result.error === "at least one administrator") {
        alert("at least one administrator!");
        return;
      } else if (result.error === "this username has existed") {
        alert("this username has existed!");
        return;
      } else {
        alert("unknown error");
        return;
      }
    }
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
    });
    console.log("response:", response);
    if (cookies.username === oldUserName) {
      ejectUser("The information of your account has been updated");
    }
    window.location.href = `/users/edit/${oldUserName}`;
  } catch (error) {
    console.error(error);
  }
});

const inactiveButton = document.getElementById("inactive-button");
inactiveButton.addEventListener("click", async (e) => {
  const activeButton = document.querySelector(".activeButtonDiv");
  const inactiveButton = document.querySelector(".inactiveButtonDiv");
  activeButton.style.display = "block";
  inactiveButton.style.display = "none";
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
    if (
      response.status === 200 ||
      response.status === 201 ||
      response.status === 204
    ) {
      if (cookies.username === oldUserName) {
        ejectUser("The information of your account has been updated");
      }
      window.location.href = `/users/edit/${oldUserName}`;
      return;
    } else {
      const result = await response.json();
      if (result.error === "at least one administrator") {
        alert("at least one active administrator!");
        return;
      } else {
        //
        alert("unknown error");
        return;
      }
    }
  } catch (error) {
    console.error(error);
  }
});
