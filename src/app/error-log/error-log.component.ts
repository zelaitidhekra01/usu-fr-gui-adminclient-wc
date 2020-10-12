import { Component, OnInit } from '@angular/core';



@Component({
    selector: 'app-error-log',
    templateUrl: './error-log.component.html',
    styleUrls : ['./error-log.component.scss']
})
export class ErrorLogComponent implements OnInit{
   
    ngOnInit(): void {
        throw new Error('Method not implemented.');
    }

}