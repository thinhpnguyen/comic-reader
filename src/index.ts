import { FileDropZone } from "./file-drop-zone.js";
import { Display } from "./display.js";
import { unZip } from "./utilities/file-processors.js";

(function App() {
  const display = new Display();
  const fileInput = new FileDropZone();

  async function onFileInput(f: FileList) {
    const imgs = await unZip(f);
    display.display(imgs);
  }

  fileInput.bindUIActions(onFileInput);
})();
