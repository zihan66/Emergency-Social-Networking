const askDonorModal = new bootstrap.Modal(
  document.getElementById("askDonorModal")
);

socket.on("askForDonorMessage", ({ user, target, url }) => {
  
    if (target == cookies.username) {
      document.querySelector("#askDonorModal .modal-body").innerHTML = `
            <div>
                <div>${user} needs blood from you</div>
                <a href="${url}">go to see</a>
            </div>
        `;
      askDonorModal.show();
    }
});
