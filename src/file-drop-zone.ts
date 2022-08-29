const input = document.querySelector('input[type="file"]');
const dropArea = document.getElementById("drop-zone");

input &&
  input.addEventListener(
    "change",
    function (e) {
      files = input.files;
      reset();
      //(files);
      handleFiles(files);
    },
    false
  );

dropArea &&
  dropArea.addEventListener(
    "dragover",
    function (e) {
      e.preventDefault();
      e.stopPropagation();
    },
    false
  );

dropArea &&
  dropArea.addEventListener(
    "drop",
    function (e) {
      e.preventDefault();
      e.stopPropagation();

      files = e.dataTransfer.files;
      reset();
      //console.log(files);
      handleFiles(files);
    },
    false
  );
