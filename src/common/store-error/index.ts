import { reducer, actions, selectors, sagas, defaultTrouble } from './model';
import { config } from './config';

export { UnhandledErrorsStrategy } from './types';
export { errorHandler } from './lib';

const {
  isErrorExist,
  errorStatus,
  useIsErrorExist,
  useErrorStatus,
} = selectors;

export { defaultTrouble };

/**
 * Error model
 */
export const errorModel = {
  config,
  reducer,
  actions,
  sagas,
  selectors: { isErrorExist, errorStatus, useIsErrorExist, useErrorStatus },
};
