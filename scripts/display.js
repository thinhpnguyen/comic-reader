function display(mode, currentPage, keys, files) {
  switch (mode) {
    case "single":
      break;
    case "double":
      displayDoubly(currentPage, keys, files);
      break;
    case "conti":
      displayContinuously(keys, files);
      break;
    default:
      console.log(mode);
  }
}

function intializeImageContainer(className, dir) {
  let div = document.createElement("div");
  div.className = className;
  if (dir === "ltr") {
    document.querySelector(".pages").prepend(div);
  } else {
    document.querySelector(".pages").append(div);
  }

  return div;
}

// function addImage(blob, div) {
//   let img = new Image();
//   img.className = "page";
//   img.draggable = "false";
//   img.onload = function () {
//     if (img.width > img.height) {
//       div.setAttribute("style", "width:90%"); // make double page more impactful
//       div.style.width = "90%"; // cross-browser compatibility
//     }
//   };
//   img.src = URL.createObjectURL(blob);

//   return img;
// }
async function loadImage(elem, file) {
  //synchronous function
  //synchronously
  return new Promise((resolve, reject) => {
    file.async("blob").then(
      // get file data as a blob
      function (blob) {
        elem.onload = () => resolve(elem);
        elem.onerror = reject;
        elem.className = "page";
        elem.draggable = "false";
        elem.src = URL.createObjectURL(blob);
      },
      function (err) {
        console.log(err);
      }
    );
  });
}
function displayContinuously(keys, files) {
  // continuous scroll
  //code credit: https://github.com/dduponchel
  files.map((img) => {
    const div = intializeImageContainer("continousPageContainer", "rtl"); // place holder div
    // the images loaded asynchronously will be place to their respective divs, so they will be in order
    //if convert file to blob in the filter function then we have to take care of async twice. One for blob, one for loading img
    //It would not be async in the filter array
    div.append(img);
  });
}

async function displayDoubly(currentPage, keys, files) {
  // double page

  //only display 1 page for the cover
  //and if the last page is odd then only display 1 page
  let k = currentPage.val === keys.length - 1 || currentPage.val === 0 ? 0 : 1;

  let startPoint = currentPage.val;
  for (let i = 0; i <= k; i++) {
    if (startPoint < 0) return; // handle the case when cover is the only page left
    let div = intializeImageContainer("doublePageContainer", "ltr");
    // the images loaded synchronously to check if first image is double page, if so then only load one;
    const img = new Image();
    let file = files[keys[startPoint + i]];
    await loadImage(img, file);

    //if this is doubled page but is a second page, then not display
    if (img.width > img.height && i === 1) {
      break;
    } else if (img.width > img.height) {
      div.className = "singlePageContainer";
      div.append(img);
      currentPage.val++;
      break;
    } else {
      div.append(img);
      currentPage.val++;
    }
  }
}
