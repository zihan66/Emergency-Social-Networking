const { cookies } = brownies;
const sendMsg = document.getElementById("sendMsg-button");
const deleteMsg = document.getElementById("deleteMsg-button");
const yourMedicalSupplies = document.querySelector(".yourMedicalSuppliesList");
const input = document.getElementById("input");

const socket = io({ URL: "http://localhost:3000", autoConnect: false });
socket.on("", (users) => {
  
});
const appendMedicalSupply = (id, medicalSupplyName) => {
  const item = document.createElement("li");
  item.className = "yourMedicalSupplies";
  item.innerHTML = `<span class="medicalSupplyName">${medicalSupplyName}</span> 
      <button id="${id}" class="ui inverted button compact">
      delete
      </button>`;
  yourMedicalSupplies.appendChild(item);
  deleteMedicalSupply(id);
  // const deleteMedicalSupply = document.getElementById(id);
  // deleteMedicalSupply.addEventListener("click", async function () {
  //   console.log("delete", this.id);
  //   const medicalSupplyID = this.id;
  //   const response = await fetch(`/medicalSupply/${medicalSupplyID}`, {
  //     method: "delete",
  //     headers: {
  //       Authorization: `Bearer ${cookies.jwtToken}`,
  //     },
  //   });
  //   if (response.status === 200) {
  //     yourMedicalSupplies.innerHTML = "";
  //     getUserMedicalSupply();
  //   }
  // });
};
const deleteMedicalSupply = (id) => {
  const deleteMedicalSupply = document.getElementById(id);
  deleteMedicalSupply.addEventListener("click", async function () {
    console.log("delete", this.id);
    const medicalSupplyID = this.id;
    const response = await fetch(`/medicalSupplies/${medicalSupplyID}`, {
      method: "delete",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    if (response.status === 200) {
      yourMedicalSupplies.innerHTML = "";
      getUserMedicalSupply();
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
      const medicalSupplyName = data[i].name;
      const id = data[i]._id;
      appendMedicalSupply(id, medicalSupplyName);
    }
  } catch (err) {
    console.error(err);
  }
};
window.addEventListener("load", () => {
  socket.auth = { username: cookies.username };
  socket.connect();
  getUserMedicalSupply();
});

sendMsg.addEventListener("click", async (e) => {
  e.preventDefault();
  const name = input.value;
  input.value = "";
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
      const id = responseData.newMedicalSupply._id;
      const medicalSupplyName = responseData.newMedicalSupply.name;
      console.log("medicalSupplyName", medicalSupplyName);
      appendMedicalSupply(id, medicalSupplyName);
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
