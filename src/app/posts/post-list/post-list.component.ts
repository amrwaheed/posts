import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs'
import { Post } from 'src/app/_modeles/post';
import { PostService } from 'src/app/_services/post.service';
import { AuthService } from 'src/app/_services/auth.service';


@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  
  private postSub:Subscription;
  private authStatusSub :Subscription;
  userIsAuthenticated = false;
  posts:Post [] = [];
  isLoading =false;
  totalPosts = 0; // all posts
  postsPerPage = 2; // how many items want to display
  currentPage = 1;
  pageSizeOption = [1, 2, 5, 10]; // number item choose display
  userId:string;




  constructor(private postService:PostService, private authSerivce :AuthService) { }

  ngOnInit() {
    this.isLoading = true;
     this.postService.getPosts(this.postsPerPage, this.currentPage)
    this.userId = this.authSerivce.getUserId()
    this.postSub =  this.postService.getPostUpdatedLisener()
    .subscribe(
      (postData:{posts:Post[],postCount:number})=>{
        this.isLoading = false;
        this.totalPosts = postData.postCount;  // all posts number  
        this.posts = postData.posts;// all posts Data 
      }
    )

    this.userIsAuthenticated = this.authSerivce.getIsAuth();
    this.authStatusSub = this.authSerivce
        .getAuthStatusListener()
        .subscribe(isAuthenticated =>{
          this.userIsAuthenticated = isAuthenticated
          this.userId = this.authSerivce.getUserId()
        })

  }

  onChangePage(pageDate: PageEvent){
    this.isLoading = true;
    this.currentPage = pageDate.pageIndex + 1 ;
    this.postsPerPage = pageDate.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage)
 
    // console.log(pageDate)
  }

  onDelete(postId:string){
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(()=>{
      this.postService.getPosts(this.postsPerPage, this.currentPage)
    },
    ()=>{
      this.isLoading = false;
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.postSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

}
