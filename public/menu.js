const menuButton = document.querySelector("#menuButton");
const closeMenu = document.querySelector("#closeMenu");
const sideMenu = document.querySelector("#sideMenu");
const menuOverlay = document.querySelector("#menuOverlay");

function openMenu() {
  sideMenu.classList.add("open");
  menuOverlay.classList.add("open");
}

function closeSideMenu() {
  sideMenu.classList.remove("open");
  menuOverlay.classList.remove("open");
}

menuButton.addEventListener("click", openMenu);
closeMenu.addEventListener("click", closeSideMenu);
menuOverlay.addEventListener("click", closeSideMenu);