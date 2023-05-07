import { configureStore } from '@reduxjs/toolkit';
import { createReduxHistoryContext } from 'redux-first-history';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';

import { rootSaga } from './root-saga';
import rootReducer from './root-reducer';

const sagaMiddleware = createSagaMiddleware();

const {
  createReduxHistory,
  routerMiddleware,
  routerReducer
} = createReduxHistoryContext({ history: createBrowserHistory() });

const reducer = rootReducer(routerReducer);
export const store = configureStore({
  reducer,
  devTools: true,
  middleware: [
    sagaMiddleware,
    routerMiddleware
  ]
});

sagaMiddleware.run(rootSaga);

export const history = createReduxHistory(store);
