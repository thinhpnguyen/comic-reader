(function () {
  const input = document.querySelector('input[type="file"]');
  const dropArea = document.getElementById("drop-zone");
  // const sw = document.querySelector(".switchButton");
  const pages = document.querySelector(".pages");
  const previousButton = document.querySelector(".previousButton");
  const modeButton = document.getElementById("mode-button");

  let prevEn = 0;
  let images; //hold images so they remain the same when switching modes
  let currentPage = 0; //keep track of current page in double page mode
  // let mode = modeButton.dataset.mode;
  let files;
  let pageOrder = [];
  let firstPage = true;
  function reset() {
    firstPage = true;
    currentPage = files.length - 1; // initialize current page for every new files read in
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
    console.log(file);
    let res = [];
    let re = /(.jpg|.png|.gif|.ps|.jpeg)$/;
    Object.keys(file)
      .sort()
      .filter(function (fileName) {
        // don't consider non image files
        return re.test(fileName.toLowerCase());
      })
      .map((key) => {
        let img = new Image();
        res.push(img);
        let f = file[key];
        f.async("blob").then(
          // get file data as a blob
          function (blob) {
            img.src = URL.createObjectURL(blob);
          },
          function (err) {
            console.log(err);
          }
        );
      });
    return res;
  }

  function handleFiles(files) {
    const inputContainer = document.querySelector(".inputContainer");
    inputContainer.setAttribute("style", "display:none");
    inputContainer.style.display = "none";
    let zip = new JSZip();
    zip.loadAsync(files[0]).then(
      function (zip) {
        images = getValidImageKeys(zip.files); //get keys of valid images to be display
        //console.log(images);
        display(
          modeButton.dataset.mode,
          currentPage,
          incrementCurrentPage,
          images
        );
      },
      function (e) {
        console.log(e);
      }
    );
  }
  //display a page as single

  function incrementCurrentPage() {
    ++currentPage;
  }
  function flip() {
    if (
      modeButton.dataset.mode !== "double" &&
      modeButton.dataset.mode !== "single"
    )
      return;
    const container = document.querySelector(".pages");
    if (container) {
      prevEn += 1;
      container.innerHTML = "";
      display(
        modeButton.dataset.mode,
        currentPage,
        incrementCurrentPage,
        images
      );
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
      currentPage -= 4;
      if (currentPage < 0) reset();
      prevEn -= 1;
      container.innerHTML = "";
      display(mode, currentPage, incrementCurrentPage, images);
    }
  }

  //NEW FILE | START HERE
  input.addEventListener(
    "change",
    function (e) {
      files = input.files;
      reset();
      //(files);
      handleFiles(files);
    },
    false
  );

  // sw.addEventListener("click", function (e) {
  //   switchPages();
  // });

  pages.addEventListener("click", function (e) {
    if (currentPage < 0) return;
    if (modeButton.dataset.mode == "conti") return;
    flip();
  });

  previousButton.addEventListener("click", function (e) {
    if (prevEn <= 0) return;
    previous();
  });

  modeButton.addEventListener("click", function (e) {
    let mode = modeButton.dataset.mode;
    switch (mode) {
      case "double":
        modeButton.dataset.mode = "conti";
        modeButton.innerText = "2-page layout";
        break;
      case "conti":
        modeButton.dataset.mode = "double";
        modeButton.innerText = "continous layout";
        break;
      default:
        console.log("some thing is wrong with the mode");
    }
    reset();
    display(modeButton.dataset.mode, currentPage, incrementCurrentPage, images);
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

      files = e.dataTransfer.files;
      reset();
      //console.log(files);
      handleFiles(files);
    },
    false
  );
})();
