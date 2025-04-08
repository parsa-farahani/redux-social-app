import {
   call,
   put,
   takeEvery,
   takeLatest,
} from "redux-saga/effects";
// import { getPostsServer } from "../../../services/postsServices";
import {
   type AddPostFulfilledAction,
   type AddPostPendingAction,
   type AddPostRejectedAction,
   POST_ADD_FULFILLED,
   POST_ADD_PENDING,
   POST_ADD_REJECTED,
} from "../constants/actions";
import { type Post } from "../postsSlice";
import axios, { type AxiosResponse } from "axios";




type AddPostAction = AddPostPendingAction;


// it is fired on action: 'POST_ADD_PENDING'
function* addPost(action: AddPostAction) {
   try {
      const response: AxiosResponse<Post> = yield call(
         axios.post,
         'http://localhost:9393/posts',
         action.payload
      );
      yield put({ type: POST_ADD_FULFILLED, payload: response.data });
   } catch (error) {
      yield put({ type: POST_ADD_REJECTED, error: error });
   }
}



function* addPostSaga() {
   yield takeLatest(POST_ADD_PENDING, addPost);
}

export default addPostSaga;
