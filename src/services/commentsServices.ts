
import axios from "axios";
import { type Comment } from "../features/comments/commentsSlice";

const SERVER_URL = 'http://localhost:9393';


// @desc 'GET' all comments
// @route 'http://localhost:9393/comments'
export const getCommentsServer = async () => {
   const url = `${SERVER_URL}/comments`;
   return axios.get(url);
};

// @desc 'GET' post by commentId
// @route 'http://localhost:9393/comments/:commentId'
export const getCommentServer = async (commentId: string) => {
   const url = `${SERVER_URL}/comments/${commentId}`;
   return axios.get(url);
};

// @desc 'POST' New Comment
// @route 'http://localhost:9393/comments'
export const addCommentServer = async (comment: Comment) => {
   const url = `${SERVER_URL}/comments`;
   return axios.post(url, comment);
};

// @desc 'DELETE' Comment by commentId
// @route 'http://localhost:9393/comments/:commentId'
export const deleteCommentServer = async (commentId: string) => {
   const url = `${SERVER_URL}/comments/${commentId}`;
   return axios.delete(url);
};

// @desc 'PUT' Comment by post, commentId
// @route 'http://localhost:9393/comments/:commentId'
export const updateCommentServer = async (comment: Comment, commentId: string) => {
   const url = `${SERVER_URL}/comments/${commentId}`;
   return axios.put(url, comment);
};


// @desc 'PUT' Comment by post, commentId
// @route 'http://localhost:9393/comments/:commentId'
// export const updateCommentReactionServer = async (comment: Pick<Comment, 'id' | 'reactions'>, postId: string) => {
//    const url = `${SERVER_URL}/comments/${commentId}`;
//    return axios.patch(url, comment);
// };