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

const joinCommunity = document.getElementById("link-signup");
joinCommunity.addEventListener("click", () => {
  window.location.href = "/signup";
});
