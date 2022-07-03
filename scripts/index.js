(function () {
  const input = document.querySelector('input[type="file"]');
  const sw = document.querySelector(".switchButton");
  const pages = document.querySelector(".pages");
  const previousButton = document.querySelector(".previousButton");
  const style = document.querySelector(".style");
  let firstPage = true;
  let prevEn = 0;
  let files; //hold file event object as global to handle later ex: changing pages, style
  let currentPage = 0; //keep track of current page in double page mode
  let mode = "continuous";
  let coverWidth; // used to check for any combine double page to display it by itself
  function reset() {
    firstPage = true;
    currentPage = input.files.length - 1; // initialize current page for every new files read in
    let pages = document.querySelector(".pages");
    pages.innerHTML = "";
  }
  async function loadImage(url, elem) {
    //synchronously
    return new Promise((resolve, reject) => {
      elem.onload = () => resolve(elem);
      elem.onerror = reject;
      elem.src = url;
    });
  }
  async function readFileAsDataURL(file) {
    let result_base64 = await new Promise((resolve) => {
      let fileReader = new FileReader();
      fileReader.onload = (e) => resolve(fileReader.result);
      fileReader.readAsDataURL(file);
    });
    return result_base64;
  }

  function displayContinuously(files) {
    // continuous scroll
    //code credit: https://github.com/dduponchel
    let re = /(.jpg|.png|.gif|.ps|.jpeg)$/;
    Object.keys(files)
      .filter(function (fileName) {
        // don't consider non image files
        return re.test(fileName.toLowerCase());
      })
      .map(function (fileName) {
        let div = document.createElement("div");
        div.className = "continousPageContainer";
        document.querySelector(".pages").append(div); // place holder div
        // the images loaded asynchronously will be place to their respective divs, so they will be in order
        let file = files[fileName];
        file.async("blob").then(
          function (blob) {
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            img.className = "page";
            div.appendChild(img);
          },
          function (e) {
            console.log(e);
          }
        );
      });
  }
  async function handleFiles(files) {
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
        displayContinuously(zip.files);
      },
      function (e) {
        console.log(e);
      }
    );
    firstPage = false;
  }
  //display a page as single

  function flip() {
    if (mode === "continuous") return;
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
})();
