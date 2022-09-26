type Layout = "double" | "continuous";
type Dir = "ltr" | "rtl"; //reading direction for manga or comic

export class Display {
  layout: Layout;
  container: HTMLElement;
  dir: Dir;
  pages: HTMLElement[];
  pagesIndex: number[][];
  hasCover: boolean; // let user choose if there is a cover
  length: number; // length of comic 0-index
  constructor() {
    this.layout = "continuous";
    this.container = document.querySelector(".pages") as HTMLElement;
    this.dir = "rtl";
    this.pages = [];
    this.pagesIndex = [];
    this.hasCover = true;
    this.length = 0;
  }

  /**
   * This function is used to index pages for the 2-page layout
   * since some page is merged together, so they need to be displayed alone
   */
  indexPages() {
    //wait for all images to be loaded
    const promiseArray: Promise<void>[] = [];
    for (const div of this.pages) {
      const img = div.firstChild as HTMLImageElement;
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
      console.log(this.pagesIndex);
    });
  }
  /**
   * This function should only be called when a new file is dropped in by App()
   * @param imgs passed in from App()
   */
  async display(imgs: HTMLElement[]) {
    this.pages = imgs;
    this.indexPages();

    if (this.layout === "double") this.displayDoubly();
    else if (this.layout === "continuous") this.displayContinuously();
  }

  displayDoubly() {}

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
    if (this.dir === "ltr") {
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
