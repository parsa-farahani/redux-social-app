import { produce, type Draft } from "immer";
import { type Reducer, type Action } from "redux"




type ActionHandler<S, A extends Action> = (state: Draft<S>, action: A) => void;

type ActionHandlers<S, A extends Action> = {
   [type: string]: ActionHandler<S, A>;
}

type ActionHandlersMap<S, A extends Action> = {
  [T in A['type']]?: (
    state: Draft<S>, 
    action: Extract<A, { type: T }>
  ) => void;
};


function createReducer<S, A extends Action = Action>(
   initialState: S,
   handlers: ActionHandlersMap<S, A>
): Reducer<S, A> {
   return (state: S = initialState, action: A) => {
      const handler = (handlers as Record<string, any>)[action.type];
     if (handler) {
       return produce(state, (draft: Draft<S>) => {
        handler(draft, action)
       })
     } else {
       return state
     }
   }
}

export default createReducer;