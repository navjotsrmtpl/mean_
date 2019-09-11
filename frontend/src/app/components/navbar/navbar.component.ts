import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public auth:AuthService, private router:Router, private flashMessage:FlashMessagesService) { }

  ngOnInit() {
  }

  onLogoutClick(){

    this.auth.logout();
    this.flashMessage.show('you are logout successfully',{
      cssClass: 'alert-success',
      timeout:3000
    });
    this.router.navigate(['login']);
    return false;

  }

}
