import { Component, OnInit, ElementRef } from '@angular/core';
import { ServiceService } from '../../services/service.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:3000/users/image';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: String;
  username: String;
  email: String;
  password: String;
  image: String;
  data: Observable<any>;
  user: any = {
    name: "",
    email: "",
    username: "",
    password: "",
    image: "",

  }
  public uploader: FileUploader = new FileUploader({ url: URL, itemAlias: 'Image' });


  constructor(private service: ServiceService, private flashMessage: FlashMessagesService, private auth: AuthService, private router: Router, private http: HttpClient, private el: ElementRef) { }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:');
     
   let obh= JSON.parse(response);
  if(obh.success){
    console.log(obh.image);
    this.user.image=obh.image;
    this.OnRegisterSubmit();
  }
    
     
    
      alert('File uploaded successfully');
    },error=>{
      console.log(error);
    };
    ;
  }
  OnRegisterSubmit() {

    this.user.name = this.name;
    this.user.email = this.email;
    this.user.username = this.username;
    this.user.password = this.password;
    //  this.user.image = this.image;

    console.log(this.user)


    if (!this.service.validateRegister(this.user)) {
      this.flashMessage.show("fill all field", { cssClass: 'alert-danger', timeout: 1000 });
      return false;

    }

    if (!this.service.validateEmail(this.user.email)) {
      this.flashMessage.show("use valid email", { cssClass: 'alert-danger', timeout: 1000 });
      return false;

    }
    /** Firest Upload Image  */


    /** Firest Upload Image  */

    this.auth.registerUser(this.user).subscribe(data => {
      if (data) {
        this.flashMessage.show('you are now register and can login', { cssClass: 'alert-success', timeout: 1000 })
        this.router.navigate(['/login']);
      } else {
        this.flashMessage.show('something went wrong', { cssClass: 'alert-danger', timeout: 1000 });
        this.router.navigate(['/register'])
      }
    })

    //  this.auth.image(user).subscribe(data=>{
    //    console.log(data);

    //  })



  }

  upload() {
    //locate the file element meant for the file upload.
    let inputEl: HTMLInputElement = this.el.nativeElement.querySelector('#photo');
    //get the total amount of files attached to the file input.
    let fileCount: number = inputEl.files.length;
    //create a new fromdata instance
    let formData = new FormData();
    console.log(formData);

    //check if the filecount is greater than zero, to be sure a file was selected.
    if (fileCount > 0) { // a file was selected
      //append the key name 'photo' with the first file in the element
      formData.append('photo', inputEl.files.item(0));
      console.log(inputEl.files.item(0));

      //call the angular http method
      this.data = this.http
        //post the form data to the url defined above and map the response. Then subscribe //to initiate the post. if you don't subscribe, angular wont post.
        .post(URL, formData).pipe(map((res: Response) => res));

console.log('data variable'+this.data);
      this.data.subscribe((res: any) => {
        console.table(res);
        if (res.success) {
          console.log('Successfully Uploade fiiel');
          this.user.image = res.image;
        }
      }, error => {
        console.log(error);
      })

      //map the success function and alert the response
      //  (success) => {
      //          alert(success._body);
      // },
      // (error) => alert(error)

    }
  }

}
