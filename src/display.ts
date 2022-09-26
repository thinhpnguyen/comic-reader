type Layout = "double" | "continuous";
type Dir = "ltr" | "rtl"; //reading direction for manga or comic

export class Display {
  layout: Layout;
  container: HTMLElement;
  dir: Dir;
  pages: HTMLElement[];
  pagesIndex: number[][];
  index: number;
  hasCover: boolean; // let user choose if there is a cover
  length: number; // length of comic 0-index
  isOpened: boolean; // check if there is a comic opened
  constructor() {
    this.layout = "double";
    this.container = document.querySelector(".pages") as HTMLElement;
    this.dir = "rtl";
    this.pages = [];
    this.pagesIndex = [];
    this.index = 0;
    this.hasCover = true;
    this.length = 0;
    this.isOpened = false;
    this.bindArrowKeys();
  }

  bindArrowKeys(): void {
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
      } else {
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

      callback?.();
    };
  }
  /**
   * This function is used to index pages for the 2-page layout
   * since some page is merged together, so they need to be displayed alone
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
    // the pages index is an array of array
    // ex: [[0], [1,2], [3], [4,5], ...]
    // the inner arrays will display 1 or 2 pages
    // we only need to traverse the outer array one by one to know what will be displayed
    return Promise.all(promiseArray).then(() => {
      let lastIsDone = false;
      for (let i = 0; i < this.pages.length; ++i) {
        const div = this.pages[i];
        const img = div.firstChild as HTMLImageElement;

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
          } else {
            // this page belongs to a new pair
            this.pagesIndex.push([i]);
            lastIsDone = false;
          }
        } else {
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
  async display(imgs: HTMLElement[]) {
    this.pages = imgs;
    this.isOpened = true;
    if (this.layout === "double") {
      await this.indexPages();
      this.displayDoubly();
    } else if (this.layout === "continuous") this.displayContinuously();
  }

  nextPage(): void {
    if (
      !this.isOpened ||
      this.layout === "continuous" ||
      this.index === this.pagesIndex.length - 1
    )
      return;

    console.log("clicked");
    ++this.index;
    this.displayDoubly();
  }
  previousPage(): void {
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

    left.onclick = () => {
      this.nextPage();
    };
    right.onclick = () => {
      this.nextPage();
    };
    this.showPage(right, "doublePageContainer");
    this.showPage(left, "doublePageContainer");
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

  showPage(div: HTMLElement, className: string) {
    div.classList.add(className);
    if (this.dir === "rtl") {
      this.container.prepend(div);
    } else {
      this.container.append(div);
    }

    return div;
  }

  styleImage(img: HTMLImageElement) {
    img.className = "page";
    img.draggable = false;
  }
}
