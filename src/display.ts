type Layout = "double" | "continuous";
type Dir = "ltr" | "rtl"; //reading direction for manga or comic

export class Display {
  layout: Layout;
  container: HTMLElement;
  dir: Dir;
  pages: HTMLElement[];

  constructor() {
    this.layout = "continuous";
    this.container = document.querySelector(".pages") as HTMLElement;
    this.dir = "rtl";
    this.pages = [];
  }

  display(imgs: HTMLElement[]) {
    this.pages = imgs;
    if (this.layout === "double") this.displayDoubly();
    else if (this.layout === "continuous") this.displayContinuously();
  }

  displayDoubly() {}

  /**
   * This function style the image container in continous layout and add it to the container
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
        img.onload = () => {
          if (img.width > img.height) {
            div.classList.add("doubled"); // make double page more impactful
          }
        };
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
