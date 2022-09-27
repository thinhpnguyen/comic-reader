export class FileDropZone {
    constructor() {
        const inputRef = document.querySelector('input[type="file"]');
        const dropAreaRef = document.getElementById("drop-zone");
        this.input = inputRef;
        if (inputRef === null)
            console.error("Can't locate input");
        this.dropArea = dropAreaRef;
        if (dropAreaRef === null)
            console.error("Can't locate drop-area");
    }
    /*
    These eventListeners will set the FileList in App to the file dropped in
    */
    bindUIActions(onInput) {
        this.input.addEventListener("change", (e) => {
            if (this.input.files != null)
                onInput(this.input.files);
        }, false);
        this.dropArea.addEventListener("dragover", function (e) {
            e.preventDefault();
            e.stopPropagation();
        }, false);
        this.dropArea.addEventListener("drop", function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.dataTransfer) {
                onInput(e.dataTransfer.files);
            }
        }, false);
    }
}
