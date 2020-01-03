import { Injectable } from '@angular/core';
import {Post} from '../model/post';
import {Subject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<Post[]>();
  constructor(private http: HttpClient) { }

  getPosts( ) {
    this.http.get(environment.backenUrl + '/posts').subscribe(
      (fetchedPost: Post[]) => {
        this.posts = fetchedPost;
        this.postsUpdated.next([...this.posts]);
      }
    );
   // console.log(this.posts);
    return [...this.posts];
  }

  //  upload(file){
  //
  //   this.http.post(environment.backenUrl + '/Containers/photos/upload', data).subscribe(
  //     (success) => {
  //    console.log(success);
  //     }
  //   );
  // }
  addPost(post: Post , file: File) {
    let data = new FormData();
    data.append("file", file);
    this.http.post(environment.backenUrl + '/Containers/photos/upload', data).subscribe(
      (success1: any) => {
        post.imageId = success1._id;
        this.http.post(environment.backenUrl + '/posts', post).subscribe(
          (success: Post) => {
            post.id = success.id;
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
          }
        );
      }
    );

  }
  deletePost(id, imageId) {
    this.http.delete(environment.backenUrl + '/containers/photos/files/' + imageId).subscribe(
      (success1) => {
        this.http.delete(environment.backenUrl + '/posts/' + id).subscribe(
          (success) => {
            const postUp: Post[] = this.posts.filter(post => post.id !== id);
            this.posts = postUp;
            this.postsUpdated.next([...this.posts]);
          }
        );
      }
    );

  }
  getPostsUpdatedListener() {
    return this.postsUpdated.asObservable();
  }
}
