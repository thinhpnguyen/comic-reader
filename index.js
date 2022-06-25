const input = document.querySelector('input[type="file"]');
const sw = document.querySelector(".switchButton");
const pages = document.querySelector(".pages");
const previousButton = document.querySelector(".previousButton");
const style = document.querySelector(".style");
let firstPage = true;
let prevEn = 0;
let files; //hold file event object as global to handle later ex: changing pages, style
let currentPage = 0; //keep track of current page in double page mode
let mode = "double";

function reset() {
  firstPage = true;
  currentPage = input.files.length - 1; // initialize current page for every new files read in
  let pages = document.querySelector(".pages");
  pages.innerHTML = "";
}

function handleFiles(files) {
  // continuous scroll
  if (mode === "continuous") {
    //choosing file in Finder from bottom up make the first file becomes last in Filelist
    //can be fixed if let user open cbz instead
    for (let i = files.length - 1; i >= 0; i--) {
      let div = document.createElement("div");
      let reader = new FileReader();
      document.querySelector(".pages").append(div); // place holder div
      // the images loaded asynchronously will be place to their respective divs, so they will be in order
      reader.onload = function () {
        const img = new Image();
        img.src = reader.result;
        img.className = "page";
        div.appendChild(img);
      };

      reader.readAsDataURL(files[i]);
    }
  } else {
    // double page

    //only display 1 page for the cover
    //and if the last page is odd then only display 1 page
    let i = firstPage || currentPage === 0 ? 0 : 1;

    while (i >= 0) {
      if (currentPage < 0) return;
      (function () {
        let div = document.createElement("div");
        div.className = "doublePageContainer";
        let reader = new FileReader();
        document.querySelector(".pages").append(div); // place holder div
        // the images loaded asynchronously will be place to their respective divs, so they will be in order
        reader.onload = function () {
          const img = new Image();
          img.src = reader.result;
          img.className = "page";
          img.draggable = "false";
          div.appendChild(img);
        };
        reader.readAsDataURL(files[currentPage - i]);
        i--;
      })();
    }
    currentPage -= firstPage ? 1 : 2;
    firstPage = false;
  }
}
//display a page as single

function flip() {
  const container = document.querySelector(".pages");
  if (container) {
    prevEn += 1;
    container.innerHTML = "";
    handleFiles(files);
  }
}

// need to fix, may change current page to even or odd
function switchPages() {
  const container = document.querySelector(".pages");
  if (container) {
    currentPage += 1;
    container.innerHTML = "";
    handleFiles(files);
  }
}

//back button
function previous() {
  const container = document.querySelector(".pages");
  if (container) {
    currentPage += 4; //add 4 because after calling handleFiles() currentPage is incremented by for;
    if (currentPage >= files.length) reset();
    prevEn -= 1;
    container.innerHTML = "";
    handleFiles(files);
  }
}

//NEW FILE | START HERE
input.addEventListener(
  "change",
  function (e) {
    reset();
    files = input.files;
    handleFiles(files);
  },
  false
);

sw.addEventListener("click", function (e) {
  switchPages();
});

pages.addEventListener("click", function (e) {
  if (currentPage < 0) return;
  flip();
});

previousButton.addEventListener("click", function (e) {
  if (prevEn <= 0) return;
  previous();
});

style.addEventListener("click", function (e) {
  switch (mode) {
    case "double":
      mode = "continuous";
      break;
    case "continuous":
      mode = "double";
      break;
  }
  reset();
  handleFiles(files);
});
document.addEventListener(
  "dragover",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
  },
  false
);
document.addEventListener(
  "drop",
  function (e) {
    e.preventDefault();
    e.stopPropagation();
    reset();
    handleFiles(e.dataTransfer.files);
  },
  false
);
