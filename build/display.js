var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class Display {
    constructor() {
        this.layout = "continuous";
        this.container = document.querySelector(".pages");
        this.length = 0;
        this.pages = [];
        this.dir = "rtl";
        this.pagesIndex = [];
        this.index = 0;
        this.hasCover = true;
        this.isOpened = false;
        this.bindArrowKeys();
    }
    bindArrowKeys() {
        document.onkeydown = (e) => {
            let callback = null;
            if (this.dir === "rtl") {
                callback = {
                    ArrowLeft: () => {
                        this.nextPage();
                    },
                    ArrowRight: () => {
                        this.previousPage();
                    },
                    // "ArrowUp"    : upHandler,
                    // "ArrowDown"  : downHandler,
                }[e.key];
            }
            else {
                callback = {
                    ArrowLeft: () => {
                        this.previousPage();
                    },
                    ArrowRight: () => {
                        this.nextPage();
                    },
                    // "ArrowUp"    : upHandler,
                    // "ArrowDown"  : downHandler,
                }[e.key];
            }
            callback === null || callback === void 0 ? void 0 : callback();
        };
    }
    /**
     * This function is used to index pages for the 2-page layout
     * since some page is merged together, so they need to be displayed alone
     */
    indexPages() {
        //wait for all images to be loaded
        const promiseArray = [];
        for (const div of this.pages) {
            const img = div.firstChild;
            this.styleImage(img);
            promiseArray.push(new Promise((resolve) => {
                //.complete doesn't work so have to check dimension to make sure
                if (img.complete && img.width && img.height) {
                    resolve();
                }
                else {
                    img.addEventListener("load", () => {
                        resolve();
                    });
                }
            }));
        }
        // the pages index is an array of array
        // ex: [[0], [1,2], [3], [4,5], ...]
        // the inner arrays will display 1 or 2 pages
        // we only need to traverse the outer array one by one to know what will be displayed
        return Promise.all(promiseArray).then(() => {
            let lastIsDone = false;
            for (let i = 0; i < this.pages.length; ++i) {
                const div = this.pages[i];
                const img = div.firstChild;
                if (this.hasCover && this.length === 0) {
                    this.pagesIndex.push([i]);
                    lastIsDone = true;
                }
                // merged page
                else if (img.naturalWidth < img.naturalHeight) {
                    //check we can still add to last
                    if (!lastIsDone) {
                        this.pagesIndex[this.pagesIndex.length - 1].push(i);
                        lastIsDone = true;
                    }
                    else {
                        // this page belongs to a new pair
                        this.pagesIndex.push([i]);
                        lastIsDone = false;
                    }
                }
                else {
                    this.pagesIndex.push([i]);
                    lastIsDone = true;
                }
                ++this.length;
            }
            //console.log(this.pagesIndex);
        });
    }
    /**
     * This function should only be called when a new file is dropped in by App()
     * @param imgs passed in from App()
     */
    display(imgs) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pages = imgs;
            this.isOpened = true;
            if (this.layout === "double") {
                yield this.indexPages();
                this.displayDoubly();
            }
            else if (this.layout === "continuous")
                this.displayContinuously();
        });
    }
    nextPage() {
        if (!this.isOpened ||
            this.layout === "continuous" ||
            this.index === this.pagesIndex.length - 1)
            return;
        //console.log("clicked");
        ++this.index;
        this.displayDoubly();
    }
    previousPage() {
        if (!this.isOpened || this.layout === "continuous" || this.index === 0)
            return;
        --this.index;
        this.displayDoubly();
    }
    displayDoubly() {
        //wait for the indexing to be done first
        // while (this.indexPages.length === 0);
        this.container.innerHTML = "";
        let curr = this.pagesIndex[this.index];
        //merged page
        if (curr.length === 1) {
            const div = this.pages[curr[0]];
            div.addEventListener("click", () => {
                this.nextPage();
            });
            this.showPage(div, "mergedPageContainer");
            return;
        }
        const right = this.pages[curr[0]];
        const left = this.pages[curr[1]];
        // left.onclick = () => {
        //   this.nextPage();
        // };
        // right.onclick = () => {
        //   this.nextPage();
        // };
        if (this.dir === "rtl") {
            this.showPage(left, "doublePageContainer");
            this.showPage(right, "doublePageContainer");
        }
        else {
            this.showPage(right, "doublePageContainer");
            this.showPage(left, "doublePageContainer");
        }
    }
    /**
     * This function style the image pages stored in this class in continous layout and add them to the container
     * For an doubled page image, it will change its width to 80% to make it more impactful
     */
    displayContinuously() {
        // continuous scroll
        this.pages.map((div) => {
            div.className = ""; //clear the styles from the previous layout
            const img = div.firstChild;
            this.styleImage(img);
            //If image has not been loaded
            if (img.width === 0 || img.height === 0) {
                img.addEventListener("load", () => {
                    if (img.width > img.height) {
                        div.classList.add("doubled"); // make double page more impactful
                    }
                });
            }
            //for when switching, image should be loaded
            if (img.width > img.height) {
                div.classList.add("doubled");
            }
            this.showPage(div, "continousPageContainer");
        });
    }
    switchLayout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.layout === "continuous") {
                this.layout = "double";
                this.container.innerHTML = "";
                this.container.classList.replace("conti-mode", "double-mode");
                if (this.pagesIndex.length == 0) {
                    yield this.indexPages();
                }
                this.displayDoubly();
            }
            else {
                this.layout = "continuous";
                this.container.innerHTML = "";
                this.container.classList.replace("double-mode", "conti-mode");
                this.displayContinuously();
            }
        });
    }
    showPage(div, className) {
        div.classList.add(className);
        this.container.append(div);
    }
    styleImage(img) {
        img.className = "page";
        img.draggable = false;
    }
}
