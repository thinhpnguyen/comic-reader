import { FileDropZone } from "./file-drop-zone.js";
import { unZip } from "./utilities/file-processors.js";
/*
  App will hold:
    - The files passed in. May support images too, not just cbz, so need to hold a file list
*/
(function App() {
  let files: FileList;
  async function onFileInput(f: FileList) {
    files = f;
    //reset();
    //(files);
    //handleFiles(files);

    // unZip(files).then((val) => {
    //   console.log(val);
    // });

    const imgs = await unZip(files);
    console.log(imgs);
  }

  const fileInput = new FileDropZone();
  fileInput.bindUIActions(onFileInput);
})();
