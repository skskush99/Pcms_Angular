import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WordsRestrictService {

  constructor() { }


  
  limitInputLength(event: any , len : number) {
    const input = event.target as HTMLInputElement;
    if (input.value.length > len) {
      input.value = input.value.slice(0, len);
    }
  }

  onlyNumber(event: any) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 45 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57;
  }


  numberWithoutDash(event: any) {
    return (event.charCode == 8 || event.charCode == 0 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57;
  }


  restrictAtRate(event: any) {
    if(event.charCode == 64 || event.charCode == 35 || event.charCode == 62 || event.charCode == 60)return false
    return true
    // return (event.charCode == 8 || event.charCode == 0 || event.charCode == 45 || event.charCode == 13) ? null : event.charCode >= 48 && event.charCode <= 57;
  }


  onlyAlphabets(event: any) {
    // Allow backspace (8), delete (0), and enter (13)
    if (event.charCode == 8 || event.charCode == 0 || event.charCode == 13 || event.charCode == 32 || event.charCode == 40 || event.charCode == 41 || event.charCode == 46 || event.charCode == 40 || event.charCode == 41) {
      return true;  // Allow these keys to work
    }

    // Check if the key pressed is a letter (A-Z or a-z)
    return (event.charCode >= 65 && event.charCode <= 90) || (event.charCode >= 97 && event.charCode <= 122);
  }



  onlyAlphanumeric(event: any) {
    // Allow backspace, delete, enter, space, hyphen, and underscore
    if (event.charCode == 8 || event.charCode == 47 || event.charCode == 46 || event.charCode == 0 || event.charCode == 13 || event.charCode == 32 || event.charCode == 45 || event.charCode == 95 || event.charCode == 40 || event.charCode == 41 ) {
      return true;
    }

    // Allow digits and letters (uppercase and lowercase)
    return (event.charCode >= 48 && event.charCode <= 57) ||
           (event.charCode >= 65 && event.charCode <= 90) ||
           (event.charCode >= 97 && event.charCode <= 122);
  }


  alphanumericWithoutSpecialChar(event: any) {
    // Allow backspace, delete, enter, space, hyphen, and underscore
    if (event.charCode == 8 ||event.charCode == 0 || event.charCode == 13 ) {
      return true;
    }

    // Allow digits and letters (uppercase and lowercase)
    return (event.charCode >= 48 && event.charCode <= 57) ||
           (event.charCode >= 65 && event.charCode <= 90) ||
           (event.charCode >= 97 && event.charCode <= 122);
  }




  emailFormat(event: any) {
      // Allow backspace, delete, enter, space, '@', and '.' characters
  if (event.charCode == 8 || event.charCode == 46 || event.charCode == 0 || event.charCode == 13 || event.charCode == 32 || event.charCode == 64 || event.charCode == 46) {
    return true;
  }

  // Allow digits and letters (uppercase and lowercase)
  return (event.charCode >= 48 && event.charCode <= 57) ||
         (event.charCode >= 65 && event.charCode <= 90) ||
         (event.charCode >= 97 && event.charCode <= 122);
  }



  dateFormat(event: any): boolean {
    const charCode = event.charCode;
  
    // Allow: digits (0-9), slash (/), dash (-), comma (,), space, period (.)
    if (
      charCode === 8 ||  // backspace
      charCode === 0 ||  // null
      charCode === 13 || // enter
      (charCode >= 48 && charCode <= 57) || // digits 0-9
      charCode === 47 || // slash "/"
      charCode === 45 || // dash "-"
      charCode === 44 || // comma ","
      charCode === 32 
    ) {
      return true;
    }
  
    return false;
  }


}
