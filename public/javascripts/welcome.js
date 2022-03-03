const acknowledge = document.querySelector("button");
const { cookies } = brownies;
acknowledge.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const username = cookies.username;
    console.log("username", username);
    const response = await fetch(`/users/${username}/acknowledgement`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      window.location.href = response.headers.get("Location");
    }
  } catch (error) {
    console.log(error);
  }
});
