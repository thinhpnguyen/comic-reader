export class SideNav {
    constructor(d) {
        this.navCtrBtn = document.querySelector(".navCtrlBtn");
        this.nav = document.getElementById("side-nav");
        this.layoutButton = document.getElementById("mode-button");
        this.dirButton = document.getElementById("dir-button");
        this.display = d;
        this.bindUIActions();
    }
    bindUIActions() {
        // nav open/close button
        this.navCtrBtn.addEventListener("click", () => {
            if (!this.nav.classList.contains("navOpen")) {
                this.nav.classList.add("navOpen");
                this.navCtrBtn.classList.add("navCtrlBtn-Open");
            }
            else {
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
            if (layout === "continuous")
                return;
            const dir = this.display.dir;
            if (dir === "rtl") {
                this.dirButton.innerText = "left-to-right";
            }
            else {
                this.dirButton.innerText = "right-to-left";
            }
            this.display.changeReadingDir();
        });
    }
}
