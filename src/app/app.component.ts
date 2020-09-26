import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UsuThemingService } from '@usu/angular-components';

@Component({
  selector: 'app-root',
  templateUrl:'./app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  names: string[] = [];
  currentName = '';

  orangeThemeControl = new FormControl(false);

  constructor(private themingService: UsuThemingService) {
    this.themingService.enableTheme('more-u-theme');
    this.themingService.enableTheme('more-u-orange-theme');
    this.themingService.useTheme('more-u-theme');

    this.orangeThemeControl.valueChanges.subscribe((orangeActive) => {
      if (orangeActive) {
        this.themingService.useTheme('more-u-orange-theme');
      } else {
        this.themingService.useTheme('more-u-theme');
      }
    });
  }


  public addName(): void {
    this.names.push(this.currentName);
    this.currentName = '';
  }
}
