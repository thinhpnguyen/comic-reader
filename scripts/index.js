(function () {
  const input = document.querySelector('input[type="file"]');
  const dropArea = document.getElementById("drop-zone");
  const sw = document.querySelector(".switchButton");
  const pages = document.querySelector(".pages");
  const previousButton = document.querySelector(".previousButton");
  const modeButton = document.getElementById("mode-button");

  let prevEn = 0;
  let file; //hold file event object as global to handle later ex: changing pages, style
  let currentPage = { val: 0 }; //keep track of current page in double page mode
  let mode = "double";
  let keys;
  function reset() {
    firstPage = true;
    currentPage.val = input.files.length - 1; // initialize current page for every new files read in
    let pages = document.querySelector(".pages");
    pages.innerHTML = "";
  }
  // async function loadImage(url, elem) {
  //   //synchronously
  //   return new Promise((resolve, reject) => {
  //     elem.onload = () => resolve(elem);
  //     elem.onerror = reject;
  //     elem.src = url;
  //   });
  // }

  /*Filter Function*/
  function getValidImageKeys(file) {
    let re = /(.jpg|.png|.gif|.ps|.jpeg)$/;
    return Object.keys(file).filter(function (fileName) {
      // don't consider non image files
      return re.test(fileName.toLowerCase());
    });
  }
  async function handleFiles(files) {
    const inputContainer = document.querySelector(".inputContainer");
    inputContainer.setAttribute("style", "display:none");
    inputContainer.style.display = "none";
    {
      // continuous scroll
      /*if (mode === "continuous") {
      //choosing file in Finder from bottom up make the first file becomes last in Filelist
      //can be fixed if let user open cbz instead
      for (let i = files.length - 1; i >= 0; i--) {
        let div = document.createElement("div");
        div.className = "continousPageContainer";
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
      let k = firstPage || currentPage === 0 ? 0 : 1;

      let i = 0;
      let startPoint = currentPage;
      while (i <= k) {
        if (startPoint < 0) return; // handle the case when cover is the only page left
        let div = document.createElement("div");
        div.className = "doublePageContainer";
        document.querySelector(".pages").prepend(div); // place holder div
        // the images loaded synchronously to check if first image is double page, if so then only load one;
        let width;
        const img = new Image();
        const imgSrc = await readFileAsDataURL(files[startPoint - i]);
        await loadImage(imgSrc, img);
        img.className = "page";
        img.draggable = "false";
        width = img.width;
        if (startPoint === files.length - 1 && coverWidth === undefined) {
          coverWidth = width;
          div.appendChild(img);
          currentPage--;
          break;
        }
        //if this is doubled page but is a second page, then not display
        if (width > coverWidth + 10 && i === 1) {
          break;
        } //10 is an adjustment
        else if (width > coverWidth) {
          div.className = "singlePageContainer";
          div.appendChild(img);
          currentPage--;
          break;
        }
        div.appendChild(img);
        currentPage--;
        i++;
      }
    }*/
    }
    let zip = new JSZip();
    zip.loadAsync(files[0]).then(
      function (zip) {
        keys = getValidImageKeys(zip.files); //get keys of valid images to be display
        file = zip.files;
        display(mode, currentPage, keys, file);
      },
      function (e) {
        console.log(e);
      }
    );
    firstPage = false;
  }
  //display a page as single

  function flip() {
    console.log(mode);
    if (mode !== "double" && mode !== "single") return;
    console.log("here");
    const container = document.querySelector(".pages");
    if (container) {
      prevEn += 1;
      container.innerHTML = "";
      console.log("called");
      display(mode, currentPage, keys, file);
    }
  }

  // need to fix, may change current page to even or odd
  function switchPages() {
    // const container = document.querySelector(".pages");
    // if (container) {
    //   currentPage += 1;
    //   container.innerHTML = "";
    //   //display(mode, currentPage, keys, file);
    // }
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
    if (currentPage.val < 0) return;
    flip();
  });

  previousButton.addEventListener("click", function (e) {
    if (prevEn <= 0) return;
    previous();
  });

  modeButton.addEventListener("click", function (e) {
    switch (mode) {
      case "double":
        mode = "conti";
        break;
      case "conti":
        mode = "double";
        break;
      default:
        console.log("some thing is wrong with the mode");
    }
    reset();
    display(mode, currentPage, keys, file);
  });

  dropArea.addEventListener(
    "dragover",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );
  dropArea.addEventListener(
    "drop",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
      reset();
      handleFiles(e.dataTransfer.files);
    },
    false
  );
})();
