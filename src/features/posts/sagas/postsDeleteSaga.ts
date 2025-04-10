import {
   call,
   put,
   takeEvery,
   takeLatest,
} from "redux-saga/effects";
// import { getPostsServer } from "../../../services/postsServices";
import {
   type DeletePostFulfilledAction,
   type DeletePostPendingAction,
   type DeletePostRejectedAction,
   POST_DELETE_FULFILLED,
   POST_DELETE_PENDING,
   POST_DELETE_REJECTED,
} from "../constants/actions";
import { type Post } from "../postsSlice";
import axios, { type AxiosResponse } from "axios";




type DeletePostAction = DeletePostPendingAction;


// it is fired on action: 'POST_DELETE_PENDING'
function* deletePost(action: DeletePostAction) {
   try {
      yield call(
         axios.delete,
         `http://localhost:9393/posts/${action.payload}`
      );
      yield put({ type: POST_DELETE_FULFILLED, payload: action.payload });
   } catch (error) {
      yield put({ type: POST_DELETE_REJECTED, error: error });
   }
}



function* deletePostSaga() {
   yield takeLatest(POST_DELETE_PENDING, deletePost);
}

export default deletePostSaga;