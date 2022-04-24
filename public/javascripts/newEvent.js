$("#standard_calendar").calendar();
import ejectUser from "../javascripts/common/logout.js";
const { cookies } = brownies;
const submitButton = document.querySelector("#create");

submitButton.addEventListener("click", async (event) => {
  event.preventDefault();
  const title = document.querySelector("#eventTitle");
  const titleValue = title.value;
  const address = document.querySelector("#street-address");
  const addressValue = address.value;
  const state = document.querySelector("#stateOption");
  const stateValue = state.value;
  const zipCode = document.querySelector("#zipCodeInput");
  const zipCodeValue = zipCode.value;
  const datePicker = document.querySelector("#datepicker");
  const datePickerValue = datePicker.value;
  const city = document.querySelector("#cityInput").value;
  const eventType = document.querySelector("#event-type").value;
  const aptValue = document.querySelector("#apt").value;
  const detailsValue = document.querySelector("#details").value;
  const hint = document.querySelector("#hint");
  if (titleValue.length === 0) {
    hint.innerText = "Event title cannot be empty";
    return;
  }
  if (titleValue.length > 75) {
    hint.innerText = "Event title should be limited to 75 characters";
    return;
  }
  if (addressValue.length === 0) {
    hint.innerText = "Event address cannot be empty";
    return;
  }
  if (city.length === 0) {
    hint.innerText = "Please enter the correct city";
  }
  if (stateValue.length === 0) {
    hint.innerText = "Please select your state";
    return;
  }
  if (zipCodeValue.length !== 5) {
    hint.innerText = "Please enter the correct Zip Code";
    return;
  }
  if (datePickerValue.length === 0) {
    hint.innerText = "Please enter a start time of your event";
    return;
  }
  if (eventType.length === 0) {
    hint.innerText = "Please select a event type";
    return;
  }
  const TwoHourLater = moment().add(2, "hours").format();
  if (moment(datePickerValue).isSameOrBefore(TwoHourLater)) {
    hint.innerText =
      "The start time should be at least two hours after the present time";
    return;
  }
  const requestBody = {
    title: titleValue,
    startTime: datePickerValue,
    location: `${addressValue} ${aptValue}, ${city}, ${stateValue}, ${zipCodeValue}`,
    host: cookies.username,
    type: eventType,
    details: detailsValue,
  };

  try {
    const response = await fetch("/events", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
      body: JSON.stringify(requestBody),
    });
    if (response.status === 201) {
      window.location.href = response.headers.get("Location");
    }
  } catch (error) {
    console.error(error);
  }
});
