import { type Action } from 'redux';
import { combineEpics, type Epic } from 'redux-observable';
import { catchError } from 'rxjs';
import { type RootState } from './store';
import { addUserReactionEpic } from '../features/posts/epics/userReactionEpic';
import { userReactionAdded } from '../features/users/usersSlice';



const epics = [
   addUserReactionEpic,
]


export const rootEpic = combineEpics(
   addUserReactionEpic
)

// export const rootEpic = (action$, store$) => {
//    return combineEpics(
//       ...epics
//    )
   // )(action$, store$).pipe(
   //    catchError(
   //       (error, source) => {
   //          console.error(`EPIC_ERROR: ${error}`);
   //          return source;
   //       }
   //    )
   // )
// }