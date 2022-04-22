const socket = io({ URL: "http://localhost:3000", autoConnect: false });
const { cookies } = brownies;
const eventList = document.querySelector("ul");
const myEventButton = document.querySelector("#new-event");
myEventButton.addEventListener("click", () => {
  window.location.href = "/myEvent/newEvent";
});

const leave = document.querySelector("#leave");
leave.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = "/eventWall";
});

const deleteEvent = async (eventId) => {
  try {
    const response = await fetch(`/events/${eventId}`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.status === 200 ? true : false;
  } catch (error) {
    console.log(error);
  }
};

const createCard = (params) => {
  const {
    title,
    startTime,
    location,
    host,
    type,
    details,
    participants,
  } = params;
  const participantsString = participants.join(",");
  const card = document.createElement("div");
  card.className = "ui card";
  card.innerHTML = ` <div class="content">
  <div class="card-header">${title}</div>
  </div>
  <div class="content">
  <h4 class="ui sub header">Hosted by</h4>
  <div class="info hostname">${host}</div>
  <h4 class="ui sub header">Event Description</h4>
  <div class="info summary">
  ${details}
  </div>
  <h4 class="ui sub header">Where</h4>
  <div class="info location">${location}</div>
  <h4 class="ui sub header">WHEN</h4>
  <div class="info start-time">${startTime}</div>
  <h4 class="ui sub header">Participants</h4>
  <div class="info participants">${participantsString}</div>
  <h4 class="ui sub header">EVENT TYPE</h4>
  <div class="info event-type">${type}</div>
  </div>`;
  return card;
};

const appendSingleEvent = (event) => {
  const {
    _id: eventId,
    title,
    startTime,
    location,
    host,
    type,
    details,
    participants,
  } = event;
  const item = document.createElement("li");
  item.className = "single-event";
  item.id = eventId;
  const button = document.createElement("button");
  button.className = "circular ui icon button";
  button.innerHTML = "delete";
  button.onclick = async () => {
    const res = await deleteEvent(eventId);
    if (res) {
      const item = document.getElementById(`${eventId}`);
      item.remove();
    }
  };
  const card = createCard({
    title,
    startTime,
    location,
    host,
    type,
    details,
    participants,
  });
  const extraContent = document.createElement("div");
  extraContent.className = "extra content";
  extraContent.innerText = "You are going to this event";
  extraContent.appendChild(button);
  card.appendChild(extraContent);
  item.appendChild(card);
  eventList.appendChild(item);
};

window.addEventListener("load", async () => {
  socket.auth = { username: cookies.username };
  socket.connect();
  try {
    const allEvent = await fetch(`/events/${cookies.username}`, {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const allEventData = await allEvent.json();
    allEventData.map(appendSingleEvent);
  } catch (error) {}
});

socket.on("eventUpdate", (event) => {
  const {
    _id: eventId,
    title,
    startTime,
    location,
    host,
    type,
    details,
    participants,
  } = event;
  if (host === cookies.username) {
    const card = createCard(
      title,
      startTime,
      location,
      host,
      type,
      details,
      participants
    );
    const button = document.createElement("button");
    button.className = "circular ui icon button";
    button.innerHTML = "delete";
    button.onclick = async () => {
      const res = await deleteEvent(eventId);
      if (res) {
        const item = document.getElementById(`${eventId}`);
        item.remove();
      }
    };
    const li = document.getElementById(eventId);
    li.innerHTML = "";
    const extraContent = document.createElement("div");
    extraContent.className = "extra content";
    extraContent.innerText = "You are going to this event";
    extraContent.appendChild(button);
    card.appendChild(extraContent);
    li.appendChild(card);
  }
});
