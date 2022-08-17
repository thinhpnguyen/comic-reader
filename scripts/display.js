function display(mode, currentPage, incrementCurrentPage, files) {
  switch (mode) {
    case "single":
      break;
    case "double":
      displayDoubly(currentPage, incrementCurrentPage, files);
      break;
    case "conti":
      displayContinuously(files);
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

function styleImage(img) {
  img.className = "page";
  img.draggable = "false";
}
// async function loadImage(elem, file) {
//   //synchronous function
//   //synchronously
//   return new Promise((resolve, reject) => {
//     file.async("blob").then(
//       // get file data as a blob
//       function (blob) {
//         elem.onload = () => resolve(elem);
//         elem.onerror = reject;
//         elem.className = "page";
//         elem.draggable = "false";
//         elem.src = URL.createObjectURL(blob);
//       },
//       function (err) {
//         console.log(err);
//       }
//     );
//   });
// }
function displayContinuously(files) {
  // continuous scroll
  //code credit: https://github.com/dduponchel
  files.map((img) => {
    const div = intializeImageContainer("continousPageContainer", "rtl"); // place holder div
    styleImage(img, div);
    if (img.width > img.height) {
      div.setAttribute("style", "width:90%"); // make double page more impactful
      div.style.width = "90%"; // cross-browser compatibility
    }
    div.append(img);
  });
}
/*********** CALCUALTE CURRENT PAGE PAIR ************
 * Precompute the page pair to see if a page is paired with another page or alone vector<vector<int>> page_order
 * when switch from continuous to double page mode
 * use binary search to find the pair that contains the current page id since the page_order must be increasing
 * go in back and forth between page is also easier because the order is already precomputed
 *
 *
 */

/*
This function should take in the current index in the page order then display it
*/
function displayDoubly(currentPage, incrementCurrentPage, files) {
  // double page

  //only display 1 page for the cover
  //and if the last page is odd then only display 1 page
  let k = currentPage === files.length - 1 || currentPage === 0 ? 0 : 1;

  let startPoint = currentPage;
  for (let i = 0; i <= k; i++) {
    if (startPoint < 0) return; // handle the case when cover is the only page left
    let div = intializeImageContainer("doublePageContainer", "ltr");
    // the images loaded synchronously to check if first image is double page, if so then only load one;
    let img = files[startPoint + i];
    //console.log(img);
    styleImage(img);
    //if this is doubled page but is a second page, then not display
    if (img.width > img.height && i === 1) {
      break;
    } else if (img.width > img.height) {
      div.className = "singlePageContainer";
      div.append(img);
      incrementCurrentPage();
      break;
    } else {
      div.append(img);
      incrementCurrentPage();
    }
  }
}
