import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class AesService {

  constructor() { }

  
  private key = CryptoJS.enc.Utf8.parse('HqE4dUkwLbXzR0IG'); // 16-byte key for AES-128
  private iv = CryptoJS.enc.Utf8.parse('HqE4dUkwLbXzR0IG');  // 16-byte IV


  // Encrypts the plaintext
  encrypt(plainText: string): string {
    const encrypted = CryptoJS.AES.encrypt(plainText, this.key, {
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }

  // Decrypts the ciphertext
  decrypt(cipherText: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(cipherText, this.key, {
        iv: this.iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
      // return ''
    }
  }
}
