import { type Epic } from "redux-observable";
import { filter, map } from "rxjs";
import { type RemovePostReactionPendingAction, type AddPostReactionPendingAction } from "../constants/actions";
import { ADD_USER_REACTION_FULFILLED, REMOVE_USER_REACTION_FULFILLED, type RemoveUserReactionFulfilledAction, type AddUserReactionFulfilledAction } from "../../users/constants/actions";
import { addPostReactionPending, removePostReactionPending } from "../postsSlice";
import { type ObservedActions, type RootStateForEpic } from "../../../app/types/epics";


export const addUserReactionEpic: Epic<ObservedActions, ObservedActions, RootStateForEpic> = (action$) => 
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


export const removeUserReactionEpic: Epic<ObservedActions, ObservedActions, RootStateForEpic> = (action$) => 
   action$.pipe(
      filter((action): action is RemoveUserReactionFulfilledAction =>
         action.type === REMOVE_USER_REACTION_FULFILLED
      ),
      map((action): RemovePostReactionPendingAction => removePostReactionPending(
            {
               postId: action.payload.postId,
               reactionName: action.payload.reactionName,
            }
         )
      )
   );
