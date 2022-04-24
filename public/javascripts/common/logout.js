const { cookies } = brownies;

async function ejectUser(message) {
  window.alert(`${message}. You will be redirected to the index page soon`);
  const { userId } = cookies;
  try {
    const response = await fetch(`/users/${userId}/offline`, {
      method: "put",
      headers: {
        Authorization: `Bearer ${cookies.jwtToken}`,
      },
    });
    window.location.href = "/";
  } catch (error) {
    console.log(error);
  }
  setTimeout(() => {}, 2000);
  window.location.href = "/";
}

export default ejectUser;
