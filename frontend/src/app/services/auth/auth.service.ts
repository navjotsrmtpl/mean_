import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import {map} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: any;
  authToken: any;

  constructor(private http: HttpClient) { }

  storeUserData(token,user){
    localStorage.setItem('id_token',token);
    localStorage.setItem('user' , JSON.stringify(user));
    this.authToken = token,
    this.user= user;
  }

  registerUser(user){
    let headers= new HttpHeaders();
    headers.append('Content-type','application/json');
    return this.http.post('http://localhost:3000/users/register',user,{headers:headers})
    .pipe(map(res=>res))
  }
  image(user){
    let headers= new HttpHeaders();
    headers.append('Content-type','application/json');
    return this.http.post('http://localhost:3000/users/image',user,{headers:headers})
    .pipe(map(res=>res))
  }

  authenticateUser(user){
    let headers= new HttpHeaders();
    headers.append('Content-type','application/json');
    return this.http.post('http://localhost:3000/users/authenticate',user,{headers:headers})
    .pipe(map(res=>res))
  }

 

  getProfile(){ 
     // var headers = new HttpHeaders()
    this.loadToken(); 
    //headers.append('Content-type', 'application/json');
   // headers.append('Authorization', this.authToken);
    let headers = new HttpHeaders()
    .set("Authorization", this.authToken)
    .set("Content-Type", 'application/json');
    console.log(this.authToken);
    
    return this.http.get('http://localhost:3000/users/profile', {headers})
    .pipe(map(res=>res))
    
    
  }

  loadToken() {
    const token = localStorage.getItem('id_token');
    this.authToken = token; 
  }

  loggedIn(){

    return localStorage.getItem('id_token');

  }


  logout(){
    this.authToken= null;
    this.user= null;
    localStorage.clear();
  }

}
