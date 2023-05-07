import { createSelector } from '@reduxjs/toolkit';

import {
  createModelSelector,
  createModelFieldSelector,
  createHookSelector,
} from '@common/store';

import { config } from '../config';

import { ModelState } from './ducks';

const modelSelector = createModelSelector<ModelState>(config.modelName);

const fieldSelector = createModelFieldSelector<ModelState>(config.modelName);

/**
 * Selector for error
 */
const isErrorExistSelector = createSelector(
  modelSelector,
  (model) => !!Object.keys(model ?? {}).length,
);

/**
 * Selector - http server response status
 */
const errorStatusSelector = fieldSelector('status');

/**
 * Selector - error code
 */
const errorCodeSelector = fieldSelector('code', '');

/**
 * Selector - error message
 */
const errorMessageSelector = fieldSelector('message', '');

export const selectors = {
  isErrorExist: isErrorExistSelector,
  errorStatus: errorStatusSelector,

  useIsErrorExist: createHookSelector(isErrorExistSelector),
  useErrorStatus: createHookSelector(errorStatusSelector),
  useErrorCode: createHookSelector(errorCodeSelector),
  useErrorMessage: createHookSelector(errorMessageSelector),
};
