import { all, fork } from "redux-saga/effects";
import fetchPostsSaga from "./sagas/postsFetchSagas";


export default function* postsSaga() {
   yield all([
      fork(fetchPostsSaga),
   ])
}

