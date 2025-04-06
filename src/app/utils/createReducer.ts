import { produce, type Draft } from "immer";
import { type Reducer, type Action } from "redux"


type ActionHandler<S, A extends Action> = (state: Draft<S>, action: A) => void;

type ActionHandlers<S, A extends Action> = {
   [type: string]: ActionHandler<S, A>;
}


function createReducer<S, A extends Action = Action>(
   initialState: S,
   handlers: ActionHandlers<S, A>
): Reducer<S, A> {
   return (state: S = initialState, action: A) => {
     if (Object.prototype.hasOwnProperty.call(handlers, action.type)) {
       return produce(state, (draft: Draft<S>) => {
        handlers[action.type](draft, action)
       })
     } else {
       return state
     }
   }
}

export default createReducer;