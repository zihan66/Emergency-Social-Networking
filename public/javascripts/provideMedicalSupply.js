const { cookies } = brownies;
import ejectUser from "../javascripts/common/logout.js";
const sendMsg = document.getElementById("sendMsg-button");
const deleteMsg = document.getElementById("deleteMsg-button");
const yourMedicalSupplies = document.querySelector(".yourMedicalSuppliesList");
//const yourMedicalSupplies = document.querySelector(".yourMedicalSuppliesConta//iner");
const input = document.getElementById("input");
const hint = document.querySelector(".hint");
const socket = io({ URL: "http://localhost:3000", autoConnect: false });
socket.on("reserved", (data) => {
  const id = data.id;
  const receiver = data.receiver;
  console.log("emit id", id);
  console.log("emit receiver", receiver);
  const medicalSupply = document.getElementById(`${id}_hint`);
  medicalSupply.innerHTML = `reserved by ${receiver}`;
});
socket.on("cancelReservation", (data) => {
  const id = data.id;
  console.log("cancelReservation", id);
  const medicalSupply = document.getElementById(`${id}_hint`);
  medicalSupply.innerHTML = "";
});

const appendMedicalSupply = (data) => {
  const medicalSupplyName = data.name;
  const id = data._id;
  const isReserved = data.isReserved;
  const receiver = data.receiver;
  const item = document.createElement("div");
  item.className = "yourMedicalSupplies";
  item.innerHTML = `<div class="medicalSupplyName">${medicalSupplyName}</div> 
      <div class="deleteButton" id="${id}">
      <button class="ui inverted button compact">
      delete
      </button></div>`;

  if (isReserved) {
    item.innerHTML += `<div class="reservedHint" id="${id}_hint"> Reserved by ${receiver}</div>`;
  } else {
    item.innerHTML += `<div class="reservedHint" id="${id}_hint"> </div>`;
  }
  // item.innerHTML += "<hr/>"
  yourMedicalSupplies.appendChild(item);
  deleteMedicalSupply(id);
};
const deleteMedicalSupply = (id) => {
  const deleteMedicalSupply = document.getElementById(id);
  deleteMedicalSupply.addEventListener("click", async function () {
    if (confirm("Are you sure to delete it?")) {
      console.log("delete", this.id);
      const medicalSupplyID = this.id;
      const response = await fetch(`/medicalSupplies/${medicalSupplyID}`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${cookies.jwtToken}`,
        },
      });
      if (response.status === 204) {
        yourMedicalSupplies.innerHTML = "";
        getUserMedicalSupply();
      }
    } else {
    }
  });
};
const getUserMedicalSupply = async () => {
  try {
    const response = await fetch(`/medicalSupplies/${cookies.username}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const data = await response.json();
    console.log("data", data);
    for (let i = 0; i < data.length; i++) {
      appendMedicalSupply(data[i]);
    }
  } catch (err) {
    console.error(err);
  }
};
window.addEventListener("load", () => {
  socket.auth = { username: cookies.username };
  socket.connect();
  hint.innerHTML = `please enter a medical supply`;
  getUserMedicalSupply();
});

sendMsg.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = input.value;
  input.value = "";
  hint.innerHTML = "please enter a medical supply";
  if (!name) {
    hint.innerHTML = "<span>Input can not be empty</span>";
    return;
  }

  const provider = cookies.username;
  const data = { provider, name };
  try {
    const response = await fetch("/medicalSupplies", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = await response.json();
    console.log("Data", response);
    console.log("responseData", responseData);
    if (response.status === 201) {
      appendMedicalSupply(responseData.newMedicalSupply);
    }
  } catch (err) {
    console.error(err);
  }
});

deleteMsg.addEventListener("click", () => {
  input.value = "";
});

const leave = document.querySelector("#leave");
leave.addEventListener("click", (e) => {
  window.location.href = "/directory";
});

const reserve = document.querySelector("#reserve");
reserve.addEventListener("click", (e) => {
  window.location.href = "/reserveMedicalSupply";
});
