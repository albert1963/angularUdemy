import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {PostService} from '../../service/post.service';
import {Post} from '../../model/post';
import {Router} from '@angular/router';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  selectedImage: File;
  imagePreview;
  submit = 0;

  constructor(private postServ: PostService, private router: Router, private authServ: AuthService) { }

  ngOnInit() {

  }
  onAddPost(f: NgForm) {

     this.submit = 1;
     if (f.valid) {
       const addpost: Post = {title: f.value.uname, content: f.value.cmt, creator: this.authServ.getAuthData().userId};
       this.postServ.addPost(addpost, this.selectedImage);
       f.resetForm();
       this.submit = 0;
       this.router.navigateByUrl('/');
     }
  }
  onImagePick(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.selectedImage = file;
     const reader = new FileReader();
     reader.onload = () => {
       this.imagePreview = reader.result;
     };
     reader.readAsDataURL(file);

  }
}
