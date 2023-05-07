import { combineReducers } from '@reduxjs/toolkit';
import {RouterState} from 'redux-first-history';
import {Reducer} from 'redux';

import { errorModel } from '@common/store-error';

const rootReducer = (routerReducer:  Reducer<RouterState>) => combineReducers({
  router: routerReducer,

  /** common */
  [errorModel.config.modelName]: errorModel.reducer,

  /** entities */

  /** features */

  /** layouts */

  /** processes */

});

export default rootReducer;
