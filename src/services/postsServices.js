
import axios from "axios";

const SERVER_URL = 'http://localhost:9393';


// @desc 'GET' all posts
// @route 'http://localhost:9393/posts'
export const getPostsServer = async () => {
   const url = `${SERVER_URL}/posts`;
   return axios.get(url);
};

// @desc 'GET' post by postId
// @route 'http://localhost:9393/posts/:postId'
export const getPostServer = async (postId) => {
   const url = `${SERVER_URL}/posts/${postId}`;
   return axios.get(url);
};

// @desc 'POST' New Post
// @route 'http://localhost:9393/posts'
export const addPostServer = async (post) => {
   const url = `${SERVER_URL}/posts`;
   return axios.post(url, post);
};

// @desc 'DELETE' Post by postId
// @route 'http://localhost:9393/posts/:postId'
export const deletePostServer = async (postId) => {
   const url = `${SERVER_URL}/posts/${postId}`;
   return axios.delete(url);
};

// @desc 'PUT' Post by post, postId
// @route 'http://localhost:9393/posts/:postId'
export const updatePostServer = async (post, postId) => {
   const url = `${SERVER_URL}/posts/${postId}`;
   return axios.put(url, post);
};