import { FileDropZone } from "./file-drop-zone";

let files: FileList;

const fileInput = new FileDropZone();

function onInput(f: FileList) {
  files = f;
  reset();
  //(files);
  handleFiles(files);
}

fileInput.bindUIActions(onInput);
