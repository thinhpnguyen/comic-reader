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
        this.comicOpened = false;
        this.dir = "rtl";
        this.pagesIndexWithCover = [];
        this.pagesIndexNoCover = [];
        this.pagesIndex = this.pagesIndexWithCover; //should only be mutated by indexPages()
        this.index = 0;
        this.hasCover = true;
        this.bindArrowKeys();
        this.bindMouseEvents();
    }
    /**
     * This function should only be called when a new file is dropped in by App()
     * @param imgs passed in from App()
     */
    display(imgs) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pages = imgs;
            this.comicOpened = true;
            if (this.layout === "double") {
                yield this.indexPages();
                this.displayDoubly();
            }
            else if (this.layout === "continuous")
                this.displayContinuously();
        });
    }
    /**
     * This function must clear the prev pages everytime it is called
     * @returns
     */
    displayDoubly() {
        this.container.innerHTML = "";
        let curr = this.pagesIndex[this.index];
        //merged page
        if (curr.length === 1) {
            const div = this.pages[curr[0]];
            const img = div.firstChild;
            if (img.width > img.height) {
                this.showPage(div, "mergedPageContainer");
            }
            else {
                this.showPage(div, "doublePageContainer center");
            }
            return;
        }
        //two separate pages
        const first = this.pages[curr[0]];
        const second = this.pages[curr[1]];
        if (this.dir === "rtl") {
            this.showPage(second, "doublePageContainer toRight");
            this.showPage(first, "doublePageContainer toLeft");
        }
        else {
            this.showPage(first, "doublePageContainer toRight");
            this.showPage(second, "doublePageContainer toLeft");
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
            this.showPage(div, "continousPageContainer");
            //for when switching, image should be loaded
            if (img.width > img.height) {
                div.classList.add("doubled");
            }
        });
    }
    switchLayout() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.layout === "continuous") {
                this.layout = "double";
                this.container.innerHTML = "";
                this.container.classList.replace("conti-mode", "double-mode");
                if (!this.comicOpened)
                    return;
                if (this.pagesIndex.length === 0) {
                    yield this.indexPages();
                }
                this.displayDoubly();
            }
            else {
                this.layout = "continuous";
                this.container.innerHTML = "";
                this.container.classList.replace("double-mode", "conti-mode");
                if (!this.comicOpened)
                    return;
                this.displayContinuously();
            }
        });
    }
    /******************* DOUBLE PAGE LAYOUT FUNCTIONS *******************/
    bindArrowKeys() {
        document.onkeydown = (e) => {
            this.navigateActions(e.key);
        };
    }
    bindMouseEvents() {
        this.container.addEventListener("mousemove", (e) => {
            if (!this.comicOpened || this.layout !== "double")
                return;
            //have to do it here since the user can resize their browser
            const containerStart = this.container.getBoundingClientRect().x;
            const containerEnd = this.container.getBoundingClientRect().right;
            const clickableArea = Math.floor((containerEnd - containerStart) / 3);
            //since this event is for the container, don't need to check if the pointer is outside container
            //left side
            if (e.pageX < containerStart + clickableArea) {
                this.container.style.cursor = "pointer";
            }
            //right side
            else if (e.pageX > containerEnd - clickableArea) {
                this.container.style.cursor = "pointer";
            }
            else
                this.container.style.cursor = "default";
        });
        this.container.addEventListener("click", (e) => {
            if (!this.comicOpened || this.layout !== "double")
                return;
            const containerStart = this.container.getBoundingClientRect().x;
            const containerEnd = this.container.getBoundingClientRect().right;
            const clickableArea = Math.floor((containerEnd - containerStart) / 3);
            //since this event is for the container, don't need to check if the pointer is outside container
            //left side
            if (e.pageX < containerStart + clickableArea) {
                this.navigateActions("ArrowLeft");
            }
            //right side
            else if (e.pageX > containerEnd - clickableArea) {
                this.navigateActions("ArrowRight");
            }
        });
    }
    /**
     * By doing this, you don't have to rebind them when switching readding direction
     */
    navigateActions(key) {
        let callback = null;
        if (this.dir === "rtl") {
            callback = {
                ArrowLeft: () => {
                    this.nextPage();
                },
                ArrowRight: () => {
                    this.previousPage();
                },
            }[key];
        }
        else {
            callback = {
                ArrowLeft: () => {
                    this.previousPage();
                },
                ArrowRight: () => {
                    this.nextPage();
                },
            }[key];
        }
        callback === null || callback === void 0 ? void 0 : callback();
    }
    /**
     * This function is used to index pages for the 2-page layout
     * since some page is merged together, so they need to be displayed alone
     * ! Should be valided by caller so will not repeat
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
        /*
         the pages index is an array of array
         ex: [[0], [1,2], [3], [4,5], ...]
         the inner arrays will display 1 or 2 pages
         we only need to traverse the outer array one by one to know what will be displayed
        */
        return Promise.all(promiseArray).then(() => {
            let lastIsDone = false;
            for (let i = 0; i < this.pages.length; ++i) {
                const div = this.pages[i];
                const img = div.firstChild;
                // If there is cover then add it by itself
                if (this.hasCover && this.pagesIndex.length === 0) {
                    this.pagesIndex.push([i]);
                    lastIsDone = true;
                }
                else if (img.naturalWidth < img.naturalHeight) {
                    //check we can still add to last
                    if (!lastIsDone && this.pagesIndex.length > 0) {
                        this.pagesIndex[this.pagesIndex.length - 1].push(i);
                        lastIsDone = true;
                    }
                    else {
                        // this page belongs to a new pair
                        this.pagesIndex.push([i]);
                        lastIsDone = false;
                    }
                }
                // merged page
                else {
                    this.pagesIndex.push([i]);
                    lastIsDone = true;
                }
                ++this.length;
            }
            //console.log(this.pagesIndex);
        });
    }
    nextPage() {
        if (!this.comicOpened ||
            this.layout === "continuous" ||
            this.index >= this.pagesIndex.length - 1 //for when changing hasCover
        )
            return;
        //console.log("clicked");
        ++this.index;
        this.displayDoubly();
    }
    previousPage() {
        if (!this.comicOpened || this.layout === "continuous" || this.index === 0)
            return;
        --this.index;
        this.displayDoubly();
    }
    /**
     * This function is validated by the caller
     */
    changeReadingDir() {
        if (this.dir === "rtl")
            this.dir = "ltr";
        else
            this.dir = "rtl";
        this.displayDoubly();
    }
    switchCoverState() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hasCover = !this.hasCover;
            if (this.hasCover)
                this.pagesIndex = this.pagesIndexWithCover;
            else
                this.pagesIndex = this.pagesIndexNoCover;
            if (this.pagesIndex.length === 0) {
                yield this.indexPages();
            }
            if (this.layout === "continuous")
                return;
            //the length of index with cover vs no cover may differ
            if (this.index > this.pagesIndex.length - 1)
                this.index = this.pagesIndex.length - 1;
            this.displayDoubly();
        });
    }
    /*********************** HELPER FUNCTIONS ****************************/
    showPage(div, className) {
        div.className = "";
        div.className += className;
        this.container.append(div);
    }
    styleImage(img) {
        img.className = "page";
        img.draggable = false;
    }
}
