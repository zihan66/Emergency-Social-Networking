import ejectUser from "../javascripts/common/logout.js";
const directoryContainer = document.querySelector(".directory-container");
const userList = document.querySelector(".user-list");
const userprofile = document.querySelector("user-directory-profile");
const { cookies } = brownies;
// eslint-disable-next-line no-undef
const socket = io({ URL: "http://localhost:3000", autoConnect: false });
const userChatMap = new Map();

const myModal = new bootstrap.Modal(document.getElementById("myModal"));
myModal.show();

let bloodType = "AB";
let isDonor = "";

const getAllUsers = async () => {};

const statusImage = (lastStatusCode) => {
  let userStatus = "";
  if (lastStatusCode === "OK") userStatus = "green";
  else if (lastStatusCode === "HELP") userStatus = "yellow";
  else if (lastStatusCode === "EMERGENCY") userStatus = "red";
  else userStatus = "grey";
  return userStatus;
};

const addSingleUser = (user) => {
  const { username, lastStatusCode, isLogin, bloodType } = user;
  const item = document.createElement("li");

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
  // eslint-disable-next-line no-underscore-dangle
  // const _users = users.filter((e) => e.username !== username);
  userDonors.map(addSingleUser);
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
  } catch (err) {
    console.log(err);
  }
});

const bloodTypeSelect = document.querySelector("#BloodTypeSelect");

bloodTypeSelect.addEventListener("change", (e) => {
  let value = e.target.value;
  bloodType = value;
});

const becomeDonnorBt = document.querySelector("#becomeDonnorBt");
const cancellDonnorBt = document.querySelector("#cancellDonnorBt");

const DonnorBt = document.querySelector("#DonnorBt");

DonnorBt.addEventListener("click", async (e) => {
  const id = e.target.id;
  console.log("id", id);
  if (id == "becomeDonnorBt") {
    cancellDonnorBt.classList.remove("btn-outline-dark-active");
    becomeDonnorBt.classList.add("btn-outline-dark-active");
    isDonor = true;
  } else if (id == "cancellDonnorBt") {
    becomeDonnorBt.classList.remove("btn-outline-dark-active");
    cancellDonnorBt.classList.add("btn-outline-dark-active");
    isDonor = false;
  }
});

const modalConfirm = document.querySelector("#modal-confirm");

modalConfirm.addEventListener("click", async (e) => {
  let body = {
    isDonor: isDonor,
    bloodType: bloodType,
  };
  const res = await fetch(`/users/${cookies.username}/isDonor`, {
    method: "put",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cookies.jwtToken}`,
    },
    body: JSON.stringify(body),
  });

  myModal.hide();
});

const BecomeDonnor = document.querySelector("#BecomeDonnor");
BecomeDonnor.addEventListener("click", () => myModal.show());
