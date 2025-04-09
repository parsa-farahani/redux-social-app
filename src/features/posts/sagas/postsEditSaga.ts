import {
   call,
   put,
   takeEvery,
   takeLatest,
} from "redux-saga/effects";
// import { getPostsServer } from "../../../services/postsServices";
import {
   type EditPostFulfilledAction,
   type EditPostPendingAction,
   type EditPostRejectedAction,
   POST_EDIT_FULFILLED,
   POST_EDIT_PENDING,
   POST_EDIT_REJECTED,
} from "../constants/actions";
import { type Post } from "../postsSlice";
import axios, { type AxiosResponse } from "axios";




type EditPostAction = EditPostPendingAction;


// it is fired on action: 'POST_EDIT_PENDING'
function* editPost(action: EditPostAction) {

   const post = action.payload;

   try {
      yield call(
         axios.put,
         `http://localhost:9393/posts/${post.id}`,
         post
      );
      yield put({ type: POST_EDIT_FULFILLED, payload: post });
   } catch (error) {
      yield put({ type: POST_EDIT_REJECTED, error: error });
   }
}



function* editPostSaga() {
   yield takeLatest(POST_EDIT_PENDING, editPost);
}

export default editPostSaga;