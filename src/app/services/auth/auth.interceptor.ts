import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('public')) {
      // Skip intercepting requests to public endpoints
      return next.handle(req);
    }

    // Add Authorization header
    const token = localStorage.getItem('token');
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continue with the modified request
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          alert("tokenin süresi bitmiş");
          localStorage.clear();
          // Unauthorized, redirect to login
          // Assuming your login route is '/login'
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
}
