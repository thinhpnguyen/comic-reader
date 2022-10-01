type Layout = "double" | "continuous";
type Dir = "ltr" | "rtl"; //reading direction for manga or comic

export class Display {
  layout: Layout;
  container: HTMLElement; //the main container, it can be in contiuous mode(flex-col) or double page mode(flex-row)
  length: number; // length of comic 0-index
  pages: HTMLElement[];
  comicOpened: boolean; // check if there is a comic opened

  //double page variables
  dir: Dir;
  pagesIndex: number[][];
  pagesIndexWithCover: number[][];
  pagesIndexNoCover: number[][];
  index: number;
  hasCover: boolean; // let user choose if there is a cover

  constructor() {
    this.layout = "continuous";
    this.container = document.querySelector(".pages") as HTMLElement;
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
  async display(imgs: HTMLElement[]) {
    this.pages = imgs;
    this.comicOpened = true;
    if (this.layout === "double") {
      await this.indexPages();
      this.displayDoubly();
    } else if (this.layout === "continuous") this.displayContinuously();
  }

  /**
   * This function must clear the prev pages everytime it is called
   * @returns
   */
  displayDoubly(): void {
    this.container.innerHTML = "";
    let curr = this.pagesIndex[this.index];

    if (curr.length === 1) {
      const div = this.pages[curr[0]];
      const img = div.firstChild as HTMLImageElement;
      //merged page
      if (img.width > img.height) {
        this.showPage(div, "mergedPageContainer");
      } else {
        this.showPage(div, "doublePageContainer");
      }
      return;
    }

    //two separate pages
    const right = this.pages[curr[0]];
    const left = this.pages[curr[1]];

    if (this.dir === "rtl") {
      this.showPage(left, "doublePageContainer");
      this.showPage(right, "doublePageContainer");
    } else {
      this.showPage(right, "doublePageContainer");
      this.showPage(left, "doublePageContainer");
    }
  }

  /**
   * This function style the image pages stored in this class in continous layout and add them to the container
   * For an doubled page image, it will change its width to 80% to make it more impactful
   */
  displayContinuously(): void {
    // continuous scroll
    this.pages.map((div) => {
      div.className = ""; //clear the styles from the previous layout
      const img = div.firstChild as HTMLImageElement;

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

  async switchLayout(): Promise<void> {
    if (this.layout === "continuous") {
      this.layout = "double";
      this.container.innerHTML = "";
      this.container.classList.replace("conti-mode", "double-mode");
      if (!this.comicOpened) return;
      if (this.pagesIndex.length === 0) {
        await this.indexPages();
      }
      this.displayDoubly();
    } else {
      this.layout = "continuous";
      this.container.innerHTML = "";
      this.container.classList.replace("double-mode", "conti-mode");
      if (!this.comicOpened) return;
      this.displayContinuously();
    }
  }

  /******************* DOUBLE PAGE LAYOUT FUNCTIONS *******************/

  bindArrowKeys(): void {
    document.onkeydown = (e) => {
      this.navigateActions(e.key);
    };
  }

  bindMouseEvents(): void {
    const containerStart = this.container.getBoundingClientRect().x;
    const containerEnd = this.container.getBoundingClientRect().right;

    const clickableArea = Math.floor((containerEnd - containerStart) / 3);

    this.container.addEventListener("mousemove", (e) => {
      if (!this.comicOpened || this.layout !== "double") return;

      //since this event is for the container, don't need to check if the pointer is outside container

      //left side
      if (e.pageX < containerStart + clickableArea) {
        this.container.style.cursor = "pointer";
      }
      //right side
      else if (e.pageX > containerEnd - clickableArea) {
        this.container.style.cursor = "pointer";
      } else this.container.style.cursor = "default";
    });

    this.container.addEventListener("click", (e) => {
      if (!this.comicOpened || this.layout !== "double") return;

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
  navigateActions(key: string) {
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
    } else {
      callback = {
        ArrowLeft: () => {
          this.previousPage();
        },
        ArrowRight: () => {
          this.nextPage();
        },
      }[key];
    }

    callback?.();
  }

  /**
   * This function is used to index pages for the 2-page layout
   * since some page is merged together, so they need to be displayed alone
   * ! Should be valided by caller so will not repeat
   */
  indexPages(): Promise<void> {
    //wait for all images to be loaded
    const promiseArray: Promise<void>[] = [];
    for (const div of this.pages) {
      const img = div.firstChild as HTMLImageElement;
      this.styleImage(img);
      promiseArray.push(
        new Promise((resolve) => {
          //.complete doesn't work so have to check dimension to make sure
          if (img.complete && img.width && img.height) {
            resolve();
          } else {
            img.addEventListener("load", () => {
              resolve();
            });
          }
        })
      );
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
        const img = div.firstChild as HTMLImageElement;

        // If there is cover then add it by itself
        if (this.hasCover && this.pagesIndex.length === 0) {
          this.pagesIndex.push([i]);
          lastIsDone = true;
        } else if (img.naturalWidth < img.naturalHeight) {
          //check we can still add to last
          if (!lastIsDone && this.pagesIndex.length > 0) {
            this.pagesIndex[this.pagesIndex.length - 1].push(i);
            lastIsDone = true;
          } else {
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

  nextPage(): void {
    if (
      !this.comicOpened ||
      this.layout === "continuous" ||
      this.index >= this.pagesIndex.length - 1 //for when changing hasCover
    )
      return;

    //console.log("clicked");
    ++this.index;
    this.displayDoubly();
  }

  previousPage(): void {
    if (!this.comicOpened || this.layout === "continuous" || this.index === 0)
      return;

    --this.index;
    this.displayDoubly();
  }

  /**
   * This function is validated by the caller
   */
  changeReadingDir() {
    if (this.dir === "rtl") this.dir = "ltr";
    else this.dir = "rtl";
    this.displayDoubly();
  }

  async switchCoverState() {
    this.hasCover = !this.hasCover;
    if (this.hasCover) this.pagesIndex = this.pagesIndexWithCover;
    else this.pagesIndex = this.pagesIndexNoCover;

    if (this.pagesIndex.length === 0) {
      await this.indexPages();
    }

    if (this.layout === "continuous") return;

    //the length of index with cover vs no cover may differ
    if (this.index > this.pagesIndex.length - 1)
      this.index = this.pagesIndex.length - 1;
    this.displayDoubly();
  }
  /*********************** HELPER FUNCTIONS ****************************/

  showPage(div: HTMLElement, className: string) {
    div.className = "";
    div.classList.add(className);
    this.container.append(div);
  }

  styleImage(img: HTMLImageElement) {
    img.className = "page";
    img.draggable = false;
  }
}
