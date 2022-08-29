export class FileDropZone {
  readonly input: HTMLInputElement;
  readonly dropArea: HTMLElement;

  constructor() {
    const inputRef = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    const dropAreaRef = document.getElementById("drop-zone")!;

    this.input = inputRef;
    if (inputRef === null) console.error("Can't locate input");

    this.dropArea = dropAreaRef;
    if (dropAreaRef === null) console.error("Can't locate drop-area");
  }

  bindUIActions(onInput: (a: FileList) => void) {
    this.input.addEventListener(
      "change",
      (e) => {
        if (this.input.files != null) onInput(this.input.files);
      },
      false
    );

    this.dropArea.addEventListener(
      "dragover",
      function (e) {
        e.preventDefault();
        e.stopPropagation();
      },
      false
    );

    this.dropArea.addEventListener(
      "drop",
      function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer) {
          onInput(e.dataTransfer.files);
        }
      },
      false
    );
  }
}
