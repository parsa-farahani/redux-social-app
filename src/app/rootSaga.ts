import { all } from "redux-saga/effects";
import postsSaga from "../features/posts/postsSaga";


export default function* rootSaga() {
   yield all([
      postsSaga(),
   ])
}