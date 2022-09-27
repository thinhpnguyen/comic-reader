var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function unZip(files) {
    return __awaiter(this, void 0, void 0, function* () {
        // @ts-ignore
        const zip = JSZip();
        return zip.loadAsync(files[0]).then((zip) => {
            return getComicPages(zip.files);
        });
    });
}
/**
 * This function return each image wrapped inside a div. I just feel like wrapping them in a div
 * @param files
 * @returns
 */
function getComicPages(files) {
    let re = /(.jpg|.png|.gif|.ps|.jpeg)$/;
    return Object.keys(files)
        .sort()
        .filter((fileName) => {
        // don't consider non image files
        return re.test(fileName.toLowerCase());
    })
        .map((key) => {
        let img = new Image();
        let div = document.createElement("div");
        div.append(img);
        files[key].async("blob").then(
        // get file data as a blob
        function (blob) {
            img.src = URL.createObjectURL(blob);
        }, function (err) {
            console.log(err);
        });
        return div;
    });
}
