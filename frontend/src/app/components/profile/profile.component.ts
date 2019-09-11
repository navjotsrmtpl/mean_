import { Router } from '@angular/router';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

   user:Object;


  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() {

   this.auth.getProfile().subscribe((profile:any)=> {
       this.user = profile.user;
      console.log(profile);
      
    },
     err => {
       console.log(">>>>>>",err);

       
       return false;
     });
  }


 

}
