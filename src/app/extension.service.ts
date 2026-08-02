import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class ExtensionService {

  constructor() { }


    onFileChange(event: any):Promise<boolean> {
    const file = event.target.files[0];

    var finalBool:Promise<boolean> = this.onFileSelected(file);
    return finalBool
  }
 
  async onFileSelected(file: File) {
    //console.log('onFileSelected called');
    var isallowed:boolean = await this.readFileContent(file)
      .then((arrayBuffer) => {
        const fileType = this.checkFileSignature(arrayBuffer);
        //console.log('Detected file type:', fileType);
        return fileType
      })
      .catch((error) => {
        console.error('Error reading file:', error);
        return false

      });
      return isallowed

  }

  async readFileContent(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(new Uint8Array(event.target.result));
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  }

  checkFileSignature(array: Uint8Array): boolean {
    const fileSignatures: { [key: string]: string } = {
      '89504E47': 'image/png',
      '25504446': 'application/pdf',
      'FFD8FFDB': 'image/jpeg',
      'FFD8FFE0': 'image/jpeg',
      'FFD8FFE1': 'image/jpeg',
      '00000018': 'image/heic',
      '66747970': 'image/heif'
    };

    const hexString = array.slice(0, 4).reduce((acc, byte) => acc + byte.toString(16).padStart(2, '0').toUpperCase(), '');
    //console.log("hexString",hexString)
    if (fileSignatures[hexString]) {
      //console.log('Detected file type:', fileSignatures[hexString]);
      return true
    } else {
      //console.log('Unknown file type.');
      return false
    }
  }

  
}
