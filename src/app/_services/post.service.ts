import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject, from } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Post } from '../_modeles/post';


const BACKEND_URL = environment.apiUrl +'/posts';
@Injectable({
  providedIn: 'root'
})
export class PostService {

  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[], postCount: number }>();// event emit to fire event and send the new ref of posts arr

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            }
          }),
          maxPosts: postData.maxPosts
        }
      }))
      .subscribe(
        (transformedPostData) => {
          this.posts = transformedPostData.posts;
          this.postUpdated.next({
            posts: [...this.posts],
            postCount: transformedPostData.maxPosts
          })
        }
      )
    // return [...this.posts];
  }
  getPostUpdatedLisener() {
    return this.postUpdated.asObservable()
  }

  getPost(id: string) {
    // return {...this.posts.find(p => p.id === id)}
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      imagePath: string,
      creator: string
    }>( BACKEND_URL + '/' + id)
  }


  /**
   * 
   * @param title 
   * @param content 
   */
  addPost(title: string, content: string, image: File) {
    // const post : Post = { id: responseData.postId, title: title, content: content }
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http
      .post<{ message: String, post: Post }>(BACKEND_URL, postData).subscribe(
        (responseData) => {
          // console.log(responseData)
          // const post: Post = {
          //   id: responseData.post.id,
          //   title: title,
          //   content: content,
          //   imagePath: responseData.post.imagePath
          // }
          // // const Id = responseData.postId;
          // // post.id = Id;
          // this.posts.push(post)
          // this.postUpdated.next([...this.posts])
          this.router.navigate(['/'])
        }
      )

  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    // const post: Post  = { id:id, title:title, content:content ,imagePath:null};
    let postData: Post | FormData;
    if (typeof (image) === "object") {
      postData = new FormData();

      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);

    } else {
      postData = { id: id, title: title, content: content, imagePath: image, creator: null };
    }
    this.http.put(BACKEND_URL+ '/' + id, postData)
      .subscribe(response => {
        // const updatedPosts = [...this.posts]; // old posts arr
        // const oldPostIndex = updatedPosts.findIndex(p => p.id === id); // find index of post you want update it from the old posts arr
        // const post: Post = {
        //   id: id,
        //   title: title,
        //   content: content,
        //   imagePath: "response.imagePath"
        // };
        // updatedPosts[oldPostIndex] = post // change this object post into the new object 
        // this.posts = updatedPosts; // change the array of posts with the new post updated
        // this.postUpdated.next([...this.posts])// fire event and pass the new posts array 
        this.router.navigate(['/'])

      })

  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + '/' + postId);
    // .subscribe(() => {
    //   console.log("Deleted")
    //   const updatedPosts = this.posts.filter(post => post.id !== postId)
    //   this.posts = updatedPosts;
    //   this.postUpdated.next([...this.posts])
    // })
  }



}
