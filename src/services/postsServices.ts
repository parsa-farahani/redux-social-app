
import axios from "axios";
import { type Post } from "../features/posts/postsSlice";

const SERVER_URL = 'http://localhost:9393';


// @desc 'GET' all posts
// @route 'http://localhost:9393/posts'
export const getPostsServer = async () => {
   const url = `${SERVER_URL}/posts`;
   return axios.get(url);
};

// @desc 'GET' post by postId
// @route 'http://localhost:9393/posts/:postId'
export const getPostServer = async (postId: string) => {
   const url = `${SERVER_URL}/posts/${postId}`;
   return axios.get(url);
};

// @desc 'POST' New Post
// @route 'http://localhost:9393/posts'
export const addPostServer = async (post: Post) => {
   const url = `${SERVER_URL}/posts`;
   return axios.post(url, post);
};

// @desc 'DELETE' Post by postId
// @route 'http://localhost:9393/posts/:postId'
export const deletePostServer = async (postId: string) => {
   const url = `${SERVER_URL}/posts/${postId}`;
   return axios.delete(url);
};

// @desc 'PUT' Post by post, postId
// @route 'http://localhost:9393/posts/:postId'
export const updatePostServer = async (post: Post, postId: string) => {
   const url = `${SERVER_URL}/posts/${postId}`;
   return axios.put(url, post);
};

// @desc 'PUT' Post by post, postId
// @route 'http://localhost:9393/posts/:postId'
export const updatePostReactionServer = async (post: Pick<Post, 'id' | 'reactions'>, postId: string) => {
   const url = `${SERVER_URL}/posts/${postId}`;
   return axios.patch(url, post);
};