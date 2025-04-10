import { combineEpics, type Epic } from 'redux-observable';
import { catchError, filter, map, type Observable } from 'rxjs';
import { addUserReactionEpic, removeUserReactionEpic } from '../features/posts/epics/userReactionEpic';
import type { ObservedActions, RootStateForEpic } from './types/epics';




export const rootEpic: Epic<ObservedActions, ObservedActions, RootStateForEpic> = (action$, store$, dependencies) =>
  combineEpics(
    addUserReactionEpic,
    removeUserReactionEpic
  )(action$, store$, dependencies).pipe(
     catchError((error, source) => {
       console.error(error);
       return source;
     })
   );