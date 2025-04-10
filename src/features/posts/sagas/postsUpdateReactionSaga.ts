import { call, put, select, takeLatest } from "redux-saga/effects";
import { ADD_REACTION_PENDING, REACTION_ADDED, REACTION_REMOVED, REMOVE_REACTION_PENDING, type AddPostReactionPendingAction, type RemovePostReactionPendingAction } from "../constants/actions";
import { type Post, selectPostById } from "../postsSlice";
import axios from "axios";



// + add reaction
function* addPostReaction(action: AddPostReactionPendingAction) {

   const { postId, reactionName } = action.payload;

   try {
      
      const post: Post = yield select(selectPostById, postId);

      if ( !isFinite(post?.reactions[reactionName]) ) return;

      const prevPostReactionTotal = post.reactions[reactionName];
     
      
      yield put( { type: REACTION_ADDED, payload: { postId, reactionName } } );
      
      yield call(
         axios.patch,
         `http://localhost:9393/posts/${postId}`,
         {
            id: postId,
            reactions: {
               ...post.reactions,
               [reactionName]: prevPostReactionTotal + 1,
            }
         }
      )

   } catch (error) {      
      yield put( { type: REACTION_REMOVED, payload: { postId, reactionName } } );
   }
}


export function* addPostReactionSaga() {
   yield takeLatest(ADD_REACTION_PENDING, addPostReaction);
}



// + remove reaction
function* removePostReaction(action: RemovePostReactionPendingAction) {

   const { postId, reactionName } = action.payload;

   try {
      
      const post: Post = yield select(selectPostById, postId);

      if ( !isFinite(post?.reactions[reactionName]) ) return;

      const prevPostReactionTotal = post.reactions[reactionName];
     
      
      yield put( { type: REACTION_REMOVED, payload: { postId, reactionName } } );
      
      yield call(
         axios.patch,
         `http://localhost:9393/posts/${postId}`,
         {
            id: postId,
            reactions: {
               ...post.reactions,
               [reactionName]: prevPostReactionTotal - 1,
            }
         }
      )

   } catch (error) {      
      yield put( { type: REACTION_ADDED, payload: { postId, reactionName } } );
   }
}


export function* removePostReactionSaga() {
   yield takeLatest(REMOVE_REACTION_PENDING, removePostReaction);
}