import { AbstractControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordValidation {
  
  static NotMatching(control: AbstractControl) {
    const password = control.get('newPass_word').value;
    const confirmPassword = control.get('confirmPassword').value;
    if (password !== confirmPassword) {
      control.get('confirmPassword').setErrors({ NotMatching: true })
    } else {
      return null
    }
  }

  constructor() {
  }
}
