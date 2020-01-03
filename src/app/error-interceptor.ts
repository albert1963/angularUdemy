import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { throwError } from "rxjs";
import {Component, Injectable} from '@angular/core';
import {ErrorService} from './error/error.service';
import {ErrorComponent} from './error/error/error.component';
import {MatDialog} from '@angular/material';



@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog, private errServ: ErrorService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = "An unknown error occurred!";
        if (error.error.error.message) {
          errorMessage = error.error.error.message;
        }

        this.dialog.open(ErrorComponent, {data: {message: errorMessage}});
        // this.errorService.throwError(errorMessage);
        return throwError(error);
      })
    );
  }
}
