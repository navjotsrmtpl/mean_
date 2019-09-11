import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import {ServiceService} from '../../services/service.service';
import { Token } from '@angular/compiler';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username:String;
  password: String;


  constructor(public auth:AuthService, private router:Router, private flashMessage: FlashMessagesService,private service:ServiceService) { }

  ngOnInit() {
  }
  onLoginSubmit(){

    const user={
      username:  this.username,
      password: this.password

    }
  

    this.auth.authenticateUser(user).subscribe((data:any)=>{
    
        //console.table(data);
        if(data.success){
          console.log(data);
          
          this.auth.storeUserData(data.token, data.user);
          this.flashMessage.show('You are logged in',{
            cssClass: "alert-success",
            timeout:1000
          });
          this.router.navigate(['dashboard'])
        }
      
      else{
        this.flashMessage.show(data.msg,{
          cssClass: 'alert-danger',
          timeout:1000
        });
        this.router.navigate(['login'])
      }
      
    })

  }

}
