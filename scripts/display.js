function display(mode, files) {
  switch (mode) {
    case "single":
      break;
    case "double":
      break;
    case "conti":
      displayContinuously(files);
      break;
    default:
      console.log(mode);
  }
}

function intializeImageContainer() {
  let div = document.createElement("div");
  div.className = "continousPageContainer";
  document.querySelector(".pages").append(div);
  return div;
}

function addImage(src, div) {
  let img = new Image();
  img.className = "page";
  img.draggable = "false";
  img.onload = function () {
    if (img.width > img.height) {
      div.setAttribute("style", "width:90%"); // make double page more impactful
    }
  };
  img.src = URL.createObjectURL(src);

  return img;
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
      const div = intializeImageContainer(); // place holder div
      // the images loaded asynchronously will be place to their respective divs, so they will be in order
      let file = files[fileName];
      file.async("blob").then(
        // get file data as a blob
        function (blob) {
          const img = addImage(blob, div);
          div.appendChild(img);
        },
        function (err) {
          console.log(err);
        }
      );
    });
}
