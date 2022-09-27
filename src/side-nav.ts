import { Display } from "./display";

export class SideNav {
  navCtrBtn: HTMLElement;
  nav: HTMLElement;
  display: Display;
  layoutButton: HTMLElement;
  dirButton: HTMLElement;
  constructor(d: Display) {
    this.navCtrBtn = document.querySelector(".navCtrlBtn") as HTMLElement;
    this.nav = document.getElementById("side-nav") as HTMLElement;
    this.layoutButton = document.getElementById("mode-button") as HTMLElement;
    this.dirButton = document.getElementById("dir-button") as HTMLElement;

    this.display = d;
    this.bindUIActions();
  }

  bindUIActions() {
    // nav open/close button
    this.navCtrBtn.addEventListener("click", () => {
      if (!this.nav.classList.contains("navOpen")) {
        this.nav.classList.add("navOpen");
        this.navCtrBtn.classList.add("navCtrlBtn-Open");
      } else {
        this.nav.classList.remove("navOpen");
        this.navCtrBtn.classList.remove("navCtrlBtn-Open");
      }
    });

    //layout button
    this.layoutButton.addEventListener("click", () => {
      const mode = this.display.layout;

      switch (mode) {
        case "double":
          this.layoutButton.innerText = "2-page layout";

          break;
        case "continuous":
          this.layoutButton.innerText = "Continous layout";

          break;
        default:
          console.log("some thing is wrong with the mode");
      }

      this.display.switchLayout();
    });

    // dir button
    this.dirButton.addEventListener("click", () => {
      const layout = this.display.layout;
      if (layout === "continuous") return;

      const dir = this.display.dir;
      if (dir === "rtl") {
        this.dirButton.innerText = "Left-to-right";
      } else {
        this.dirButton.innerText = "Right-to-left";
      }

      this.display.changeReadingDir();
    });
  }
}
