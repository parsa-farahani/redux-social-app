import { type Epic } from "redux-observable";
import { filter, map } from "rxjs";
import { ADD_REACTION_PENDING, type AddPostReactionPendingAction } from "../constants/actions";
import { ADD_USER_REACTION_FULFILLED, type AddUserReactionFulfilledAction } from "../../users/constants/actions";
import { addPostReactionPending } from "../postsSlice";


export const addUserReactionEpic: Epic= (action$) => 
   action$.pipe(
      filter((action): action is AddUserReactionFulfilledAction =>
         action.type === ADD_USER_REACTION_FULFILLED
      ),
      map((action): AddPostReactionPendingAction => addPostReactionPending(
            {
               postId: action.payload.postId,
               reactionName: action.payload.reactionName,
            }
         )
      )
   );
