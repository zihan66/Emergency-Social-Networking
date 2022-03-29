// Get the modal
const {static, response} = require("express");
const modal = document.querySelector(".modal-wrapper");

// Get the <span> element that closes the modal
const span = document.getElementsByClassName("close")[0];

const confirmButton = document.querySelector(".confirm");

// When the user clicks on <span> (x), close the modal
span.onclick = () => {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = (event) => {
    if (event.target === modal) {
        modal.style.display = "none";
    }
};


let intervalPostID;
let intervalGetID;
let duration;
let interval;
let countOfPost = 0;
let countOfGet = 0;
let numberOfPostPerSec = -1;
let numberOfGetPerSec = -1;
let testInProgress = false;


const sendOneTestMessage = async () => {
    const { username } = cookies;
    const testBody = { username, content: "qwertyuiopasdfghjklz" };
    try {
        const response = await fetch("/messages/public", {
            method: "post",
            headers: {
                Authorization: `Bearer ${cookies.jwtToken}`,
            },
            body: JSON.stringify(testBody),
        });
        // const data = response.json();
        console.log("messagedata", testBody);
    } catch (err) {
        console.error(err);
        // return false;
    }

    if (response.status === 201) {
        countOfPost += 1;
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
        // const data = response.json();
        // console.log("messagedata", data);
    } catch (err) {
        console.error(err);
    }

    if (response.status === 200) {
        countOfGet += 1;
    }
};



const stopPost = async () => {
    // clearInterval(intervalGetID);
    clearInterval(intervalPostID);
    numberOfPostPerSec = countOfPost / (duration / 2);
    setTimeout(stopGet, duration / 2);
    intervalGetID = setInterval(getAllTestMessages, interval);
}



const stopGet = async () => {
    clearInterval(intervalGetID);
    // clearInterval(intervalPostID);
    numberOfGetPerSec = countOfGet / (duration / 2);
    testInProgress = false;
    appendResult();
}



const appendResult = function () {
    const resultContainer = document.querySelector("#result");
    const postResult = document.createElement("p");
    const getResult = document.createElement("p")
    postResult.innerHTML = "The number of POST request per second: " + numberOfPostPerSec;
    getResult.innerHTML = "The number of GET request per second: " + numberOfGetPerSec;
    resultContainer.appendChild(postResult);
    resultContainer.appendChild(getResult);
}




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
            }
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

    testInProgress = true;

    e.preventDefault();
    duration = document.forms[0].querySelectorAll("input")[0].value;
    interval = document.forms[0].querySelectorAll("input")[1].value;

    if (duration > 300 || duration < 10) {
        const ele = document.querySelector("#duration-hint");
        ele.innerHTML = "Duration should be at least 10s and at most 300s";
        return;
    }

    // if (reservedUsernameList.includes(username)) {
    //     const ele = document.querySelector("#username-hint");
    //     ele.innerHTML = "Username is reserved, please choose another one";
    //     return;
    // }

    const ele = document.querySelector("#username-hint");
    ele.innerHTML = "";


    if (interval < duration || interval >= duration * 1000) {
        const eleP = document.querySelector("#interval-hint");
        eleP.innerHTML = "Interval cannot less than duration/1000 and no greater than duration";
        return;
    }

    const eleP = document.querySelector("#password-hint");
    eleP.innerHTML = "";

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
            setTimeout(stopPost, duration / 2);
            intervalPostID = setInterval(sendOneTestMessage, interval);
            // setTimeout(stopGet, duration / 2);
            // intervalGetID = setInterval(getAllTestMessages, interval);

            if (testInProgress) {
                appendResult();
            }
        }

    } catch (error) {
        console.log(error);
    }

    // testInProgress = false;
});






































