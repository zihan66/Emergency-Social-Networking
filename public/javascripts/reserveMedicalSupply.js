const { cookies } = brownies;
const sendMsg = document.getElementById("sendMsg-button");
const deleteMsg = document.getElementById("deleteMsg-button");
const allMedicalSupply = document.querySelector(".allMedicalSupplyList");
const notReserved = document.querySelector(".notReserved");
const userReservation = document.querySelector(".userReservation");
const reserved = document.querySelector(".reserved");

const searchInput = document.getElementById("searchInput");
const hint = document.querySelector(".hint");
const searchTitle = document.querySelector(".searchTitle");
const socket = io({ URL: "http://localhost:3000", autoConnect: false });
let reserveNum = 0;
socket.on("postNewMedicalSupply", (medicalSupply) => {
  appendMedicalSupply(medicalSupply);
});
socket.on("deleteMedicalSupply", (data) => {
  const deletedMedicalSupply = document.getElementById(data.id);
  deletedMedicalSupply.innerHTML = '<div class="deleteMedicalSupply"> deleted <div>';
});
socket.on("reserved", (medicalSupply) => {
  const reservedMedicalSupply = document.getElementById(medicalSupply.id);
  reservedMedicalSupply.innerHTML = '<div class="reservedLabel"> reserved <div>'; 
});
socket.on("cancelReservation", (data) => {
  const MedicalSupplyCancelReser = document.getElementById(data.id);
  MedicalSupplyCancelReser.innerHTML = `<button class="ui inverted button compact">
                                reserve </button>`;
});

window.addEventListener("load", async () => {
  socket.auth = { username: cookies.username };
  socket.connect();
  hint.innerHTML = "<span>Please enter your search content";
  searchTitle.innerHTML = "Reserve Medical Supplies";
  try {
    const response = await fetch("/medicalSupplies", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const allMedicalSupply = await response.json();
    for (let i = 0; i < allMedicalSupply.length; i++) {
      // const medicalSupplyName = allMedicalSupply[i].name;
      // const id = allMedicalSupply[i]._id;
      // const isReserved = allMedicalSupply[i].isReserved;
      //appendMedicalSupply(id, medicalSupplyName, isReserved);
      appendMedicalSupply(allMedicalSupply[i]);
    }
  } catch (error) {
    console.log(error);
  }
});
const clear = () => {
  notReserved.innerHTML = "";
  userReservation.innerHTML = "";
  reserved.innerHTML = "";
};
const appendMedicalSupply = (medicalSupply) => {
  const medicalSupplyName = medicalSupply.name;
  const id = medicalSupply._id;
  const isReserved = medicalSupply.isReserved;
  const provider = medicalSupply.provider;
  const receiver = medicalSupply.receiver;
  const item = document.createElement("div");
  item.className = "allMedicalSupplies";
  if (provider != cookies.username && !isReserved) {
    item.innerHTML = `<div class="medicalSupplyName">${medicalSupplyName}</div>
  
      <div id="${id}" class="reserve">
        <button class="ui inverted button compact">
        reserve
        </button>
      </div>
      <div class="provider">provider: ${provider}</div>`;
    notReserved.appendChild(item);
    buttonClick(id);
  } else if (
    provider != cookies.username &&
    isReserved &&
    receiver === cookies.username
  ) {
    item.innerHTML = `<div class="medicalSupplyName">${medicalSupplyName}</div>
        <div id="${id}" class="cancel">
          <button class="ui inverted button compact">
          cancel
          </button>
        </div> 
        <div class="provider">provider: ${provider}</div>`;
    userReservation.appendChild(item);
    reserveNum++;
    console.log("reserveNum", reserveNum);
    buttonClick(id);
  } else if (
    provider != cookies.username &&
    isReserved &&
    receiver != cookies.username
  ) {
    item.innerHTML = `<div class="medicalSupplyName">${medicalSupplyName}</div>
        <div class="reservedLabel" id="${id}">  reserved </div>`;
    item.innerHTML += `<div class="provider">provider: ${provider}</div>`;
    reserved.appendChild(item);
  }
};
// const appendMedicalSupply = (id, medicalSupplyName, isReserved) => {
//   const item = document.createElement("li");
//   item.className = "allMedicalSupplies";
//   if (isReserved) {
//     item.innerHTML = `<span class="medicalSupplyName">${medicalSupplyName}</span>
//         <span id="${id}" class="cancel">
//           <button class="ui inverted button compact">
//           cancel
//           </button>
//         </span>`;
//   } else if (!isReserved) {
//     item.innerHTML = `<span class="medicalSupplyName">${medicalSupplyName}</span>
//         <span id="${id}" class="reserve">
//           <button class="ui inverted button compact">
//           reserve
//           </button>
//         </span>`;
//   }
//   allMedicalSupply.appendChild(item);
//   buttonClick(id);
// };
const reserveMedicalSupply = async (id) => {
  const operationButton = document.getElementById(id);
  try {
    //const isReserved = false;
    //const data = {isReserved};

    const response = await fetch(`/medicalSupplies/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isReserved: true, username: cookies.username }),
    });
    if (response.status === 204) {
      operationButton.className = "cancel";
      operationButton.innerHTML = `<button class="ui inverted button compact">
        cancel
        </button>`;
    }
  } catch (error) {}
};
const cancelReservation = async (id) => {
  const operationButton = document.getElementById(id);
  try {
    const response = await fetch(`/medicalSupplies/${id}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isReserved: false }),
    });
    if (response.status === 204) {
      operationButton.className = "reserve";
      operationButton.innerHTML = `
      <button class="ui inverted button compact">
      reserve
      </button>`;
    }
  } catch (error) {}
};
const buttonClick = (id) => {
  const operationButton = document.getElementById(id);
  operationButton.addEventListener("click", async function () {
    console.log("operation", this.className);
    console.log("id", this.id);
    //const medicalSupplyID = this.id;
    const operation = this.className;
    if (operation === "reserve") {
      if (reserveNum < 10) {
        if (confirm("Are you sure to reserve this medical supply?")) {
          reserveNum++;
          console.log("reserveNum", reserveNum);
          reserveMedicalSupply(id);
        }
      } else {
        alert("You can reserve at most 10 medical supplies");
      }
      //cancelReservation(id);
    } else {
      if (confirm("Are you sure to cancel reservation?")) {
        reserveNum--;
        console.log("reserveNum", reserveNum);
        cancelReservation(id);
      }
    }
  });
};

const searchMedicalSupply = async (searchContent) => {
  try {
    clear();
    const response = await fetch(`/search/medicalSupplies?q=${searchContent}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const medicalSupplyMatched = await response.json();
    console.log("medicalSupplyMatched", medicalSupplyMatched);
    if (medicalSupplyMatched.length == 0) {
      hint.innerHTML = "There is no matching result";
      clear;
      return;
    }
    for (let i = 0; i < medicalSupplyMatched.length; i++) {
      appendMedicalSupply(medicalSupplyMatched[i]);
    }
    // allMedicalSupply.innerHTML = `<div class="online"> online </div> <hr/>
    //                                    <div class="onlineUsers"> </div>
    //                                    <div class="offline"> offline </div> <hr/>
    //                                   <div class="offlineUsers"> </div>`;
    // const onlineUser = document.querySelector(".onlineUsers");
    // const offlineUser = document.querySelector(".offlineUsers");
    // for (let i = 0; i < usernameInfo.length; i++) {
    //   const userStatus = statusImage(usernameInfo[i].lastStatusCode);
    //   const item = document.createElement("li");
    //   item.className = "userSearchResult";
    //   item.innerHTML = `<span class="directoryUsername">${usernameInfo[i].username}</span>
    //                                 <span class="directoryStatus">Status:</span>
    //                                 <span><img src="../images/${userStatus}.png">${usernameInfo[i].lastStatusCode}</span>`;

    //   if (usernameInfo[i].isLogin === true) {
    //     onlineUser.appendChild(item);
    //   } else if (usernameInfo[i].isLogin === false) {
    //     offlineUser.appendChild(item);
    //   }
    // }
  } catch (error) {
    console.log(error);
  }
};

sendMsg.addEventListener("click", async () => {
  const searchContent = searchInput.value;
  hint.innerHTML = "";
  if (!searchContent) {
    hint.innerHTML = "<span>Input can not be empty</span>";
    clear();
    return;
  }

  searchMedicalSupply(searchContent);
});

deleteMsg.addEventListener("click", () => {
  searchInput.value = "";
});

const leave = document.querySelector("#leave");
leave.addEventListener("click", (e) => {
  window.location.href = "/provideMedicalSupply";
});
