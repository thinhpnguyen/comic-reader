export class SideNav {
    constructor(d) {
        this.navCtrBtn = document.querySelector(".navCtrlBtn");
        this.nav = document.getElementById("side-nav");
        this.layoutButton = document.getElementById("mode-button");
        this.display = d;
        this.bindUIActions();
    }
    bindUIActions() {
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
            let mode = this.display.layout;
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
    }
}
