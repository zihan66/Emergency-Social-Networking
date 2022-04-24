const directoryContainer = document.querySelector(".directory-container");
const userList = document.querySelector(".user-list");
const userprofile = document.querySelector("user-directory-profile");
import ejectUser from "../javascripts/common/logout.js";
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io({ URL: "http://localhost:3000", autoConnect: false });
const userChatMap = new Map();

const myModal = new bootstrap.Modal(document.getElementById("myModal"));
const myModal2 = new bootstrap.Modal(document.getElementById("myModal2"));
myModal.show();

const bloodTypes = ["AB", "A", "B", "O"];

let bloodType = cookies.bloodType;
let cacheBloodType;
let isDonor = "";
// inform user of force injection
socket.on("ejectOneUser", async (message) => {
  ejectUser(message);
});

const initSelect = (curBloodType = bloodType) => {
  let str = "";
  console.log("bloodType", bloodType);
  for (let index = 0; index < bloodTypes.length; index++) {
    const v = bloodTypes[index];
    const item = `<option  ${
      curBloodType == v ? "selected" : ""
    } value="${v}">${v}</option>`;
    str = str + item;
  }

  bloodTypeSelect.innerHTML = str;
};

const statusImage = (lastStatusCode) => {
  let userStatus = "";
  if (lastStatusCode === "OK") userStatus = "green";
  else if (lastStatusCode === "HELP") userStatus = "yellow";
  else if (lastStatusCode === "EMERGENCY") userStatus = "red";
  else userStatus = "grey";
  return userStatus;
};

const sendNeedBlooldMsg = async (another, chatID) => {
  const { username } = cookies;
  const msgContent = `${username} NEEDS BlOOD FROM YOU!`;
  const requestBody = {
    author: username,
    content: msgContent,
    target: another,
    chatID,
    isToDonor: window.location.search.includes("isToDonor=true"),
  };
  try {
    const response = await fetch(`/messages/private`, {
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
};

const addSingleUser = (user) => {
  const { username, lastStatusCode, isLogin, bloodType } = user;
  const item = document.createElement("li");
  item.addEventListener("click", async function (e) {
    e.preventDefault();
    const username2 = this.id;
    const chatID = userChatMap.get(this.id);
    const isMath =
      bloodType == "O" ||
      cookies.bloodType == "AB" ||
      cookies.bloodType === bloodType;

    if (!isMath) {
      alert("bloodType mismatch!");
      return;
    }
    if (userChatMap.has(username2)) {
      await sendNeedBlooldMsg(username2, chatID);
      window.location.href = `/chats/${chatID}/${username2}?isToDonor=true`;
    } else {
      const username1 = cookies.username;
      const data = { username1, username2 };
      const jsonData = JSON.stringify(data);

      try {
        const response = await fetch("/chats", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.status === 201) {
          window.location.href = response.headers.get("Location");
        }
      } catch (error) {
        console.log(error);
      }
    }
  });

  item.className = "user";
  item.id = `${username}`;
  item.innerHTML = ` 
  
  <div>
    <span class="username">${username}</span>
    <div class="username"">
      <span>Blood Type:</span>
      <span>${bloodType}</span>
    </div>
  </div>`;
  userList.appendChild(item);
};

const userBonorList = ({ userDonors = [] }) => {
  const { username } = cookies;
  const _users = userDonors.filter((e) => e && e.username !== username);
  _users.map(addSingleUser);
};

socket.on("donorList", (users) => {
  userList.innerHTML = "";

  const allUSer = userBonorList({ userDonors: users });
  directoryContainer.scrollTop = 0;
});

window.addEventListener("load", async () => {
  try {
    socket.auth = { username: cookies.username };
    socket.connect();
    const allUser = await fetch("/users/donors", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const allUserData = await allUser.json();
    userBonorList(allUserData);

    const chatPrivateInfo = await fetch(`/chats?username=${cookies.username}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const chatPrivateData = await chatPrivateInfo.json();
    const chats = chatPrivateData.chats;
    for (let i = 0; i < chats.length; i++) {
      userChatMap.set(chats[i].username, chats[i].chatID);
    }
  } catch (err) {
    console.log(err);
  }
});

const bloodTypeSelect = document.querySelector("#BloodTypeSelect");

bloodTypeSelect.addEventListener("change", (e) => {
  let value = e.target.value;

  if (value !== bloodType) {
    cacheBloodType = value;
    myModal2.show();
  }
});

initSelect();

const becomeDonnorBt = document.querySelector("#becomeDonnorBt");
const cancellDonnorBt = document.querySelector("#cancellDonnorBt");

const modalConfirm = document.querySelector("#modal-confirm");
const modalConfirm2 = document.querySelector("#modal-confirm2");

const modalBack2 = document.querySelector("#modal-Back2");

modalConfirm.addEventListener("click", async (e) => {
  let body = {
    bloodType: cacheBloodType,
  };
  bloodType = cacheBloodType;
  cookies.bloodType = cacheBloodType;
  const res = await fetch(`/users/${cookies.username}/updateBloodType`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.jwtToken}`,
    },
    body: JSON.stringify(body),
  });

  myModal.hide();
});

modalBack2.addEventListener("click", async (e) => {
  myModal2.hide();
  initSelect();
});

modalConfirm2.addEventListener("click", async (e) => {
  myModal2.hide();
});
