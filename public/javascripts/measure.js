let intervalPostID;
let intervalGetID;
let duration;
let interval;
let countOfPost = 0;
let countOfGet = 0;
let numberOfPostPerSec = -1;
let numberOfGetPerSec = -1;
let testInProgress = false;
const { cookies } = brownies;

const sendOneTestMessage = async () => {
  const { username } = cookies;
  console.log(username);
  const testBody = { username: username, content: "qwertyuiopasdfghjklz" };
  try {
    const response = await fetch("/messages/public", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      body: JSON.stringify(testBody),
    });

    countOfPost += 1;
  } catch (err) {
    console.error(err);
    // return false;
  }
};

const getAllTestMessages = async () => {
  try {
    const response = await fetch("/messages/public", {
      method: "get",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    countOfGet += 1;
  } catch (err) {
    console.error(err);
  }
};

const stopPost = async () => {
  // clearInterval(intervalGetID);
  clearInterval(intervalPostID);
  numberOfPostPerSec = countOfPost / (duration / 2);
  console.log("counterOfPost", countOfPost);
  setTimeout(stopGet, (duration * 1000) / 2);
  intervalGetID = setInterval(getAllTestMessages, interval);
};

const stopGet = async () => {
  clearInterval(intervalGetID);
  // clearInterval(intervalPostID);
  console.log("counterOfGet", countOfGet);
  numberOfGetPerSec = countOfGet / (duration / 2);
  testInProgress = false;
  appendResult();
};

const appendResult = function () {
  const resultContainer = document.querySelector("#result");
  resultContainer.innerHTML = "";
  const postResult = document.createElement("p");
  const getResult = document.createElement("p");
  postResult.innerHTML =
    "The number of POST request per second: " + numberOfPostPerSec;
  getResult.innerHTML =
    "The number of GET request per second: " + numberOfGetPerSec;
  resultContainer.appendChild(postResult);
  resultContainer.appendChild(getResult);
};

const stopMeasure = document.querySelector("#stop");

stopMeasure.addEventListener("click", async (e) => {
  if (!testInProgress) {
    return;
  }

  clearInterval(intervalPostID);
  clearInterval(intervalGetID);
  testInProgress = false;

  try {
    const response = await fetch(`/performances`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error);
  }
});

const getMeasureData = document.querySelector("#start");

getMeasureData.addEventListener("click", async (e) => {
  if (testInProgress) {
    return;
  }
  const eleDuration = document.querySelector("#duration-hint");
  eleDuration.innerHTML = "";
  const eleInterval = document.querySelector("#interval-hint");
  eleInterval.innerHTML = "";
  e.preventDefault();
  duration = document.querySelectorAll("input")[0].value;
  interval = document.querySelectorAll("input")[1].value;

  if (duration > 300 || duration < 10) {
    eleDuration.innerHTML = "Duration should be at least 10s and at most 300s";
    return;
  }

  if (interval < duration || interval >= duration * 1000) {
    eleInterval.innerHTML =
      "Interval cannot less than duration/1000 and no greater than duration";
    return;
  }

  testInProgress = true;

  const data = { testDuration: duration };

  try {
    const response = await fetch(`/performances`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // const expectedPostCount = (duration * 1000) / interval;

    if (response.status === 200) {
      setTimeout(stopPost, (duration * 1000) / 2);
      intervalPostID = setInterval(sendOneTestMessage, interval);
    }
  } catch (error) {
    console.log(error);
  }

  // testInProgress = false;
});
