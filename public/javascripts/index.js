// $(function () {
//   $("#join_form").submit(function (event) {
//     event.preventDefault();
//     let username = $("#username").val();
//     $.ajax({
//       type: "POST",
//       url: "/users/" + username,
//       complete: function (xhr) {
//         switch (xhr.status) {
//           case 200:
//             alert(xhr.responseText);
//         }
//       },
//     });
//   });
// });
let i = 0;
const text = "A Social Network Making You Stay Connected in Any Situation";
const type = () => {
  if (i < text.length) {
    document.getElementById("type-writer").innerHTML += text.charAt(i);
    i += 1;
    setTimeout(type, 66);
  }
};
window.addEventListener("load", type);
