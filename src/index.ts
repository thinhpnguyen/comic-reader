import { FileDropZone } from "./file-drop-zone.js";

(function App() {
  let files: FileList;

  const fileInput = new FileDropZone();

  function onFileInput(f: FileList) {
    files = f;
    //reset();
    //(files);
    //handleFiles(files);
    console.log(files);
  }

  fileInput.bindUIActions(onFileInput);
})();
