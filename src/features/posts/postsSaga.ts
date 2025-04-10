import { all, fork } from "redux-saga/effects";
import fetchPostsSaga from "./sagas/postsFetchSagas";
import fetchPostSaga from "./sagas/postsSingleFetchSaga";
import addPostSaga from "./sagas/postsAddSaga";
import deletePostSaga from "./sagas/postsDeleteSaga";
import editPostSaga from "./sagas/postsEditSaga";
import { addPostReactionSaga, removePostReactionSaga } from "./sagas/postsUpdateReactionSaga";


export default function* postsSaga() {
   yield all([
      fork(fetchPostsSaga),
      fork(fetchPostSaga),
      fork(addPostSaga),
      fork(deletePostSaga),
      fork(editPostSaga),
      fork(addPostReactionSaga),
      fork(removePostReactionSaga),
   ])
}
