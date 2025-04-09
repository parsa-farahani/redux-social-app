import { all, fork } from "redux-saga/effects";
import fetchPostsSaga from "./sagas/postsFetchSagas";
import fetchPostSaga from "./sagas/postsSingleFetchSaga";
import addPostSaga from "./sagas/postsAddSaga";
import deletePostSaga from "./sagas/postsDeleteSaga";
import editPostSaga from "./sagas/postsEditSaga";


export default function* postsSaga() {
   yield all([
      fork(fetchPostsSaga),
      fork(fetchPostSaga),
      fork(addPostSaga),
      fork(deletePostSaga),
      fork(editPostSaga),
   ])
}
