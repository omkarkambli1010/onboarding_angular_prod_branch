import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as forge from 'node-forge';

@Injectable({
  providedIn: 'root'
})
export class AesService {


  constructor() { }

  encrypt(plainText: string, _key: string, _iv: string) {
    _key = (_key == undefined || _key == null) ? '' : _key
    _iv = (_iv == undefined || _iv == null) ? '' : _iv
    
    var encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(plainText), CryptoJS.enc.Utf8.parse(_key.toString().padEnd(16, '=').slice(0, 16)),
      {
        keySize: 128 / 8,
        iv: CryptoJS.enc.Utf8.parse(_iv.toString().padEnd(16, '=').slice(0, 16)),
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
    return encrypted.toString();
  }

  decrypt(cipherText: string, _key: string, _iv: string) {
    if (cipherText == null || cipherText == 'null')
      return ""
    _key = (_key == undefined || _key == null) ? '' : _key
    _iv = (_iv == undefined || _iv == null) ? '' : _iv
    
    var decrypted = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(_key.toString().padEnd(16, '=').slice(0, 16)), {
      keySize: 128 / 8,
      iv: CryptoJS.enc.Utf8.parse(_iv.toString().padEnd(16, '=').slice(0, 16)),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}
