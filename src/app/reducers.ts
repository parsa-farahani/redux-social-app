import postsReducer from '../features/posts/postsSlice';
import usersReducer from '../features/users/usersSlice';
import commentsReducer from '../features/comments/commentsSlice';
import authReducer from '../features/auth/authSlice';
import settingsReducer from '../features/settings/settingsSlice';
import { combineReducers } from 'redux';


const rootReducer = combineReducers({
   auth: authReducer,
   settings: settingsReducer,
   posts: postsReducer,
   users: usersReducer,
   comments: commentsReducer,
})

export default rootReducer;