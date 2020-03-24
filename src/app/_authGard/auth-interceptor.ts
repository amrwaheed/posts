import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor( private authService: AuthService) {

    }

    
    intercept(req: HttpRequest<any>, next: HttpHandler){
        const authToken = this.authService.getToken();
        const authRequest = req.clone({
            headers:req.headers.set('Authorization',"Bearer "+ authToken)
        }); // clone incoming request copy
        return next.handle(authRequest);
    }
}