const { cookies } = brownies;

async function ejectUser(message) {
  window.alert(`${message}. You will be logged out soon and please relog in`);
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
  window.location.href = "/";
}

export default ejectUser;
