var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { FileDropZone } from "./file-drop-zone.js";
import { Display } from "./display.js";
import { unZip } from "./utilities/file-processors.js";
import { SideNav } from "./side-nav.js";
(function App() {
    const display = new Display();
    const fileInput = new FileDropZone();
    const sideNav = new SideNav(display);
    const dropZoneContainer = document.querySelector(".inputContainer");
    function onFileInput(f) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!display.comicOpened) {
                document.body.removeChild(dropZoneContainer);
            }
            const imgs = yield unZip(f);
            display.display(imgs);
        });
    }
    fileInput.bindUIActions(onFileInput);
})();
