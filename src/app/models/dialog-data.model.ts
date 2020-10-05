export class DialogData {
    buttonLabel: string;
    title: string;
    message: string;
    callBack?: any;
    lineName?: string;
  
  
    constructor(buttonLabel: string, title: string, message: string, callBack?: any, lineName?: string) {
      this.buttonLabel = buttonLabel;
      this.title = title;
      this.message = message;
      this.callBack = callBack || undefined;
      this.lineName = lineName || '';
    }
  }
  