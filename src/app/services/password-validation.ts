import {AbstractControl} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PasswordValidation {

  

  static NotMatching(control: AbstractControl) {
    console.log("=====>PasswordValidation");
    const password = control.get('newPass_word').value;
    const confirmPassword = control.get('confirmPassword').value;
    console.log("=====>confirmPassword", confirmPassword);

    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({NotMatching: true})
    } else {
      return null
    }
  }

  constructor() {
  }
}
