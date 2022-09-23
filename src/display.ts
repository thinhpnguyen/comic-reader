type Layout = "double" | "continuous";
export class Display {
  layout: Layout;

  constructor() {
    this.layout = "continuous";
  }

  display(imgs: HTMLImageElement[]) {
    if (this.layout === "double") this.displayDoubly(imgs);
    else if (this.layout === "continuous") this.displayContinuously(imgs);
  }

  displayDoubly(imgs: HTMLImageElement[]) {}
  displayContinuously(imgs: HTMLImageElement[]) {
    // continuous scroll
    //code credit: https://github.com/dduponchel
    imgs.map((img) => {
      const div = this.intializeImageContainer("continousPageContainer", "rtl"); // place holder div
      this.styleImage(img);
      //If image has been loaded
      if (!img.width && !img.height) {
        img.onload = () => {
          if (img.width > img.height) {
            div.setAttribute("style", "width:80%"); // make double page more impactful
            div.style.width = "80%"; // cross-browser compatibility
          }
        };
      }

      //for when switching, image should be loaded
      if (img.width > img.height) {
        div.setAttribute("style", "width:80%"); // make double page more impactful
        div.style.width = "80%"; // cross-browser compatibility
      }
      div.append(img);
    });
  }
  intializeImageContainer(className: string, dir: string) {
    let div = document.createElement("div");
    div.className = className;
    if (dir === "ltr") {
      document.querySelector(".pages")?.prepend(div);
    } else {
      document.querySelector(".pages")?.append(div);
    }

    return div;
  }

  styleImage(img: HTMLImageElement) {
    img.className = "page";
    img.draggable = false;
  }
}
