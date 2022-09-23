// @ts-ignore
export async function unZip(files: FileList): Promise<HTMLElement[]> {
  // @ts-ignore
  const zip = JSZip();
  let res: HTMLElement[] = [];

  return zip.loadAsync(files[0]).then((zip: any) => {
    return getValidImageKeys(zip.files);
  });
}

function getValidImageKeys(files: any): HTMLElement[] {
  let re = /(.jpg|.png|.gif|.ps|.jpeg)$/;

  return Object.keys(files)
    .sort()
    .filter((fileName) => {
      // don't consider non image files
      return re.test(fileName.toLowerCase());
    })
    .map((key: string) => {
      let img = new Image();
      let f: any = files[key];
      f.async("blob").then(
        // get file data as a blob
        function (blob: Blob) {
          img.src = URL.createObjectURL(blob);
        },
        function (err: Error) {
          console.log(err);
        }
      );
      return img;
    });
}
