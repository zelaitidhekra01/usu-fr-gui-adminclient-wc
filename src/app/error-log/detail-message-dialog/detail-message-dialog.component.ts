import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-detail-message-dialog',
  templateUrl: './detail-message-dialog.component.html',
  styleUrls: ['./detail-message-dialog.component.scss']
})

export class DetailMessageDialogComponent {

  constructor(public dialogRef: MatDialogRef<DetailMessageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public entity: any) {
  }

  /** copy to clipboard */
  copyInputMessage = () => {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.entity.message;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  };

  /** close popup */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
