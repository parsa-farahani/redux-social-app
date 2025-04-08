import { all, fork } from "redux-saga/effects";
import fetchPostsSaga from "./sagas/postsFetchSagas";
import fetchPostSaga from "./sagas/postsSingleFetchSaga";
import addPostSaga from "./sagas/postsAddSaga";


export default function* postsSaga() {
   yield all([
      fork(fetchPostsSaga),
      fork(fetchPostSaga),
      fork(addPostSaga),
   ])
}

