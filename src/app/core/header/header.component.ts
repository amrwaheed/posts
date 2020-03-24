import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  userIsAuthenticated = false;
  private authListenerSubs : Subscription;

  constructor(
    private authService: AuthService,
    
  ) { }

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
        .getAuthStatusListener()
        .subscribe(isAuthenticated =>{
      this.userIsAuthenticated = isAuthenticated;
    })

  }


  onLogout(){
    this.authService.logout();
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.authListenerSubs.unsubscribe();
  }

}
