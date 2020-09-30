export class Preferences {
    firstName: string;
    lastName: string;
    password: string;
    passwordConfirm?: string;
    email: string;
    phone: string;
   
     constructor(firstName?: string, lastName?: string, password?: string, passwordConfirm?: string, email?: string, phone?: string) {
       this.firstName = firstName || undefined;
       this.lastName = lastName || undefined;
       this.password = password || undefined;
       this.passwordConfirm = passwordConfirm || undefined;
       this.email = email || undefined;
       this.phone = phone || undefined;
     }
   }
   