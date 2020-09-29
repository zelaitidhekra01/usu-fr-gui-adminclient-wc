import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsuThemingService } from '@usu/angular-components';

@Component({
  selector: 'app-root',
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {

  ngOnInit(): void{
    console.log("====> App Component");
  }
 
}
