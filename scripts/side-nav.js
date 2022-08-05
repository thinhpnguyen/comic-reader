const navOpen = document.querySelector(".navCtrlBtn");
navOpen.addEventListener("click", () => {
  let nav = document.querySelector(".sideNav");
  if (!nav.classList.contains("navOpen")) {
    nav.classList.add("navOpen");
    navOpen.classList.add("navCtrlBtn-Open");
  } else {
    nav.classList.remove("navOpen");
    navOpen.classList.remove("navCtrlBtn-Open");
  }
});
