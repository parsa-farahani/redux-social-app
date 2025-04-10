import {
   call,
   put,
   takeEvery,
   takeLatest,
} from "redux-saga/effects";
// import { getPostsServer } from "../../../services/postsServices";
import {
   type FetchPostFulfilledAction,
   type FetchPostPendingAction,
   type FetchPostRejectedAction,
   POST_FETCH_FULFILLED,
   POST_FETCH_PENDING,
   POST_FETCH_REJECTED,
} from "../constants/actions";
import { type Post } from "../postsSlice";
import axios, { type AxiosResponse } from "axios";




type FetchPostAction = FetchPostPendingAction;


// it is fired on action: 'POST_FETCH_PENDING'
function* fetchPost(action: FetchPostAction) {
   try {
      const response: AxiosResponse<Post> = yield call(
         axios.get,
         `http://localhost:9393/posts/${action.payload}`
      );
      yield put({ type: POST_FETCH_FULFILLED, payload: response.data });
   } catch (error) {
      yield put({ type: POST_FETCH_REJECTED, error: error, payload: action.payload });
   }
}



function* fetchPostSaga() {
   yield takeLatest(POST_FETCH_PENDING, fetchPost);
}

export default fetchPostSaga;
