export async function unZip(files: FileList): Promise<HTMLElement[]> {
  // @ts-ignore
  const zip = JSZip();

  return zip.loadAsync(files[0]).then((zip: any) => {
    return getComicPages(zip.files);
  });
}

/**
 * This function return each image wrapped inside a div. I just feel like wrapping them in a div
 * @param files
 * @returns
 */
function getComicPages(files: any): HTMLElement[] {
  let re = /(.jpg|.png|.gif|.ps|.jpeg)$/;

  return Object.keys(files)
    .sort()
    .filter((fileName) => {
      // don't consider non image files
      return re.test(fileName.toLowerCase());
    })
    .map((key: string) => {
      let img = new Image();
      let div = document.createElement("div");
      div.append(img);
      files[key].async("blob").then(
        // get file data as a blob
        function (blob: Blob) {
          img.src = URL.createObjectURL(blob);
        },
        function (err: Error) {
          console.log(err);
        }
      );
      return div;
    });
}
