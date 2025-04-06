import {
   call,
   type CallEffect,
   put,
   type PutEffect,
   takeEvery,
   takeLatest,
} from "redux-saga/effects";
// import { getPostsServer } from "../../../services/postsServices";
import {
   type FetchPostsFulfilledAction,
   type FetchPostsPendingAction,
   type FetchPostsRejectedAction,
   POSTS_FETCH_FULFILLED,
   POSTS_FETCH_PENDING,
   POSTS_FETCH_REJECTED,
} from "../constants/actions";
import { type Post } from "../postsSlice";
import axios, { type AxiosResponse } from "axios";




type FetchPostsAction = FetchPostsPendingAction;


// it is fired on action: 'POSTS_FETCH_PENDING'
function* fetchPosts(action: FetchPostsAction) {
   try {
      const response: AxiosResponse<Post[]> = yield call(
         axios.get,
         'http://localhost:9393/posts' 
      );
      console.log(response);
      yield put({ type: POSTS_FETCH_FULFILLED, payload: response.data });
   } catch (error) {
      yield put({ type: POSTS_FETCH_REJECTED, error: error });
   }
}



function* fetchPostsSaga() {
   yield takeLatest(POSTS_FETCH_PENDING, fetchPosts);
}

export default fetchPostsSaga;
