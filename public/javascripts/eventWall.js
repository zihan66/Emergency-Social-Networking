const socket = io({ URL: "http://localhost:3000", autoConnect: false });
const { cookies } = brownies;
const eventList = document.querySelector("ul");
const myEventButton = document.querySelector("#my-event");
myEventButton.addEventListener("click", () => {
  window.location.href = "/myEvent";
});

const leave = document.querySelector("#leave");
leave.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  window.location.href = "/directory";
});

const join = async (eventId) => {
  try {
    const response = await fetch(
      `/events/${eventId}/join?username=${cookies.username}`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 403) {
      const message = await response.json();
      window.alert(message.error);
    }
  } catch (error) {
    console.log(error);
  }
};

const unjoin = async (eventId) => {
  try {
    const response = await fetch(
      `/events/${eventId}/unjoin?username=${cookies.username}`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 403) {
      const message = await response.json();
      window.alert(message.error);
    }
  } catch (error) {
    console.log(error);
  }
};

const createCard = (
  title,
  startTime,
  location,
  host,
  type,
  details,
  participants
) => {
  const participantsString = participants.join(",");
  console.log(participantsString);
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
  const isGoing =
    cookies.username === host || participants.includes(cookies.username)
      ? true
      : false;
  const buttonText = isGoing ? "Unjoin" : "Join";
  if (isGoing) {
    button.addEventListener("click", async () => await unjoin(eventId));
  } else {
    button.addEventListener("click", async () => await join(eventId));
  }
  const iconText = isGoing ? "minus" : "plus";
  button.innerHTML = `<i class="icon ${iconText}"></i>${buttonText}`;
  const extraContent = document.createElement("div");
  extraContent.className = "extra content";
  extraContent.innerText = isGoing ? "You are going to this event" : "";
  extraContent.appendChild(button);
  const card = createCard(
    title,
    startTime,
    location,
    host,
    type,
    details,
    participants
  );
  card.appendChild(extraContent);
  item.appendChild(card);
  eventList.appendChild(item);
};

socket.on("eventDelete", (event) => {
  const { eventId } = event;
  const item = document.getElementById(`${eventId}`);
  if (item) item.remove();
});

socket.on("newEvent", (event) => {
  appendSingleEvent(event);
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
  const li = document.getElementById(eventId);
  if (!li) {
    return;
  }
  const card = createCard(
    title,
    startTime,
    location,
    host,
    type,
    details,
    participants
  );
  li.innerHTML = "";
  li.appendChild(card);
  const button = document.createElement("button");
  button.className = "circular ui icon button";
  const isGoing =
    cookies.username === host || participants.includes(cookies.username)
      ? true
      : false;
  const buttonText = isGoing ? "Unjoin" : "Join";
  if (isGoing) {
    button.addEventListener("click", async () => await unjoin(eventId));
  } else {
    button.addEventListener("click", async () => await join(eventId));
  }
  const iconText = isGoing ? "minus" : "plus";
  button.innerHTML = `<i class="icon ${iconText}"></i>${buttonText}`;
  const extraContent = document.createElement("div");
  extraContent.className = "extra content";
  extraContent.innerText = isGoing ? "You are going to this event" : "";
  extraContent.appendChild(button);
  card.appendChild(extraContent);
});

window.addEventListener("load", async () => {
  socket.auth = { username: cookies.username };
  socket.connect();
  try {
    const allEvent = await fetch("/events", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    const allEventData = await allEvent.json();
    allEventData.map(appendSingleEvent);
  } catch (error) {}
});
