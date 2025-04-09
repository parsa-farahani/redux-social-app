import { type Action, applyMiddleware, compose, createStore, type StoreEnhancer } from "redux";
import { thunk, type ThunkAction } from "redux-thunk";
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from "./reducers";
import createSagaMiddleware from 'redux-saga';
import rootSaga from "./rootSaga";
import { createEpicMiddleware } from "redux-observable";
import { rootEpic } from "./rootEpic";

// Middlewares
const sagaMiddleware = createSagaMiddleware();
const epicMiddleware = createEpicMiddleware();
const middleware = [thunk, sagaMiddleware, epicMiddleware];

if (process.env.NODE_ENV === 'development') {

   // add 'development-only' middlewares here...
}



// Store Enhancers & Middleware
const enhancers: StoreEnhancer[] = [];

const composeEnhancers: (...args: StoreEnhancer[]) => StoreEnhancer<any, any> = 
   process.env.NODE_ENV === 'development'
   ? composeWithDevTools({ trace: true })
   : compose
;


const store = createStore(
   rootReducer,
   undefined,
   composeEnhancers(applyMiddleware(...middleware), ...enhancers)
)


sagaMiddleware.run(rootSaga);
epicMiddleware.run(rootEpic);

export default store;


//  --------  Types --------
export type AppStore = typeof store;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
   ThunkReturnType,
   RootState,
   unknown,
   Action
>;
