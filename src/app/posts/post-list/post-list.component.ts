import {Component, OnDestroy, OnInit} from '@angular/core';
import {Post} from '../../model/post';
import {PostService} from '../../service/post.service';
import {Subscription} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AuthService} from '../../service/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit , OnDestroy{
  isAuthenticated = false;
  isLoading = false;
  Posts: Post[] = [];
  imgUrl = environment.backenUrl + 'Containers/photos/download/';
  userId;
  private postsSubs: Subscription;
  private authSubscription: Subscription;
  constructor(private PostServ: PostService, private authsServ: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    if(this.authsServ.getAuthData())
      this.userId = this.authsServ.getAuthData().userId;
    this.Posts = this.PostServ.getPosts();
    this.postsSubs = this.PostServ.getPostsUpdatedListener().subscribe(
      (Posts: Post[]) => {
        this.isLoading = false;
           this.Posts = Posts;
      }
    );
    this.isAuthenticated = this.authsServ.getIsAuth();
    this.authSubscription = this.authsServ.getAuthStatusListener().subscribe(
      (status) => {
        this.isAuthenticated = status;
      }
    );
  }

  onDelete(id, imageId){
    this.PostServ.deletePost(id, imageId);
  }
   ngOnDestroy(): void {
    this.postsSubs.unsubscribe();
    this.authSubscription.unsubscribe();
  }

}
