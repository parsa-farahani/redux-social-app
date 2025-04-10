import type { Epic } from "redux-observable";
import type { AuthState } from "../../features/auth/authSlice";
import type { CommentsState } from "../../features/comments/commentsSlice";
import type { PostsState } from "../../features/posts/postsSlice";
import type { SettingsState } from "../../features/settings/settingsSlice";
import type { UsersState } from "../../features/users/usersSlice";
import type { AddUserReactionFulfilledAction, RemoveUserReactionFulfilledAction } from "../../features/users/constants/actions";
import type { AddPostReactionPendingAction, RemovePostReactionPendingAction } from "../../features/posts/constants/actions";

export interface RootStateForEpic {
   auth: AuthState;
   settings: SettingsState;
   posts: PostsState;
   users: UsersState;
   comments: CommentsState;
}

export type AnyEpic = Epic<any, any, any, any>;

export type ObservedActions =
| AddUserReactionFulfilledAction
| RemoveUserReactionFulfilledAction
| AddPostReactionPendingAction
| RemovePostReactionPendingAction
;