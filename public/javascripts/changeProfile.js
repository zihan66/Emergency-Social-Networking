import reservedUsernameList from "../javascripts/common/constants.js";
const { cookies } = brownies;

const sendButton = document.getElementById("edit-button");
sendButton.addEventListener("click", async (e) => {
  const msgInput = document.getElementById("editUsername");
  const msgInput2 = document.getElementById("editPassword");
  const msgInput3 = document.getElementById("editPrivilege");
  const msgInput4 = document.getElementById("editAccountStatus");
  const username = msgInput.value;
  const password = msgInput2.value;
  var privilege = msgInput3.options[msgInput3.selectedIndex].text;
  var accountStatus = msgInput4.options[msgInput4.selectedIndex].text;
  // const { username } = cookies;
  e.preventDefault();
  e.stopPropagation();
  //if (!msgContent) return;
  // msgInput.value = "";

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

  if (password.length < 4 && password.length > 0) {
    const eleP = document.querySelector("#password-hint");
    eleP.innerHTML = "Password should have minimum four characters";
    return;
  }

  const requestBody = {
    username: username,
    password: password,
    privilege: privilege,
    accountStatus: accountStatus,
  };
  console.log("username:", username);
  console.log("password:", password);
  console.log("privilege:", privilege);
  console.log("accountStatus:", accountStatus);
  // const requestBody = { username:username, password:password, privilege:privilege};
  // console.log("picture:",requestBody.picture);
  try {
    const response = await fetch(`/users/${cookies.username}`, {
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
