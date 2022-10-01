export class SideNav {
    constructor(d) {
        this.navCtrBtn = document.querySelector(".navCtrlBtn");
        this.nav = document.getElementById("side-nav");
        this.layoutBtn = document.getElementById("mode-button");
        this.dirBtn = document.getElementById("dir-button");
        this.hasCoverBtn = this.hasCoverBtn = document.getElementById("has-cover-button");
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
        this.layoutBtn.addEventListener("click", () => {
            const mode = this.display.layout;
            // user can change the layout before opening commic
            switch (mode) {
                case "double":
                    this.layoutBtn.innerText = "2-page layout";
                    break;
                case "continuous":
                    this.layoutBtn.innerText = "Continous layout";
                    break;
                default:
                    console.log("some thing is wrong with the mode");
            }
            this.display.switchLayout();
        });
        // dir button
        this.dirBtn.addEventListener("click", () => {
            const layout = this.display.layout;
            const comicOpened = this.display.comicOpened;
            if (!comicOpened || layout === "continuous")
                return;
            const dir = this.display.dir;
            if (dir === "rtl") {
                this.dirBtn.innerText = "Right-to-left";
            }
            else {
                this.dirBtn.innerText = "Left-to-right";
            }
            this.display.changeReadingDir();
        });
        // has cover button
        this.hasCoverBtn.addEventListener("click", () => {
            const hasCover = this.display.hasCover;
            //currently has cover => change to not hasCover mode
            if (hasCover) {
                this.hasCoverBtn.classList.remove("hasCover");
            }
            else {
                this.hasCoverBtn.classList.add("hasCover");
            }
            this.display.switchCoverState();
        });
    }
}
