export class SideNav {
  navCtrBtn: HTMLElement;
  nav: HTMLElement;
  constructor() {
    this.navCtrBtn = document.querySelector(".navCtrlBtn") as HTMLElement;
    this.nav = document.getElementById("side-nav") as HTMLElement;

    this.bindUIActions();
  }

  bindUIActions() {
    this.navCtrBtn.addEventListener("click", () => {
      let nav = document.querySelector(".sideNav");
      if (!this.nav.classList.contains("navOpen")) {
        this.nav.classList.add("navOpen");
        this.navCtrBtn.classList.add("navCtrlBtn-Open");
      } else {
        this.nav.classList.remove("navOpen");
        this.navCtrBtn.classList.remove("navCtrlBtn-Open");
      }
    });
  }
}
