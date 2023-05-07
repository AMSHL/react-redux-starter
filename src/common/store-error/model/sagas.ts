import { Saga, SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { SagaWrapperParams } from '@common/store';
import {
  createTrouble,
  combineTroubleActions,
  TroubleAction,
} from '@common/trouble';

import { ErrorHandlerParams, UnhandledErrorsStrategy } from '../types';

/** Trouble for handling default errors */
export const defaultTrouble = createTrouble();

/**
 * Error handler iteration
 * @param actions - action
 * @param error - error
 *
 * @returns {void}
 */
function* forEachTroubleActionSaga(
  actions: TroubleAction[],
  error: Error,
): SagaIterator {
  for (let index = 0; index < actions.length; ++index) {
    const action = actions[index];
    yield call(action, error);
  }
}

/**
 * Error handling Saga
 *
 * @param error - error
 * @param params - params
 *
 * @returns {void}
 */
function* errorHandlerSaga(
  error: Error,
  params?: ErrorHandlerParams,
): SagaIterator {
  const {
    trouble,
    unhandledErrorsStrategy: strategy = UnhandledErrorsStrategy.UseDefault,
  } = params || {};

  if (trouble && strategy === UnhandledErrorsStrategy.Throw) {
    const {
      matchedActions,
      otherwiseActions,
      alwaysActions,
    } = trouble.getSplittedActions(error);

    const isHandled = matchedActions.length > 0 || otherwiseActions.length > 0;

    const troubleActions = [
      ...matchedActions,
      ...otherwiseActions,
      ...alwaysActions,
    ];

    yield call(forEachTroubleActionSaga, troubleActions, error);

    if (!isHandled) {
      throw error;
    } else {
      const {
        alwaysActions: defaultAlwaysActions,
      } = defaultTrouble.getSplittedActions(error);

      yield call(forEachTroubleActionSaga, defaultAlwaysActions, error);
    }
  } else {
    const troubleActions = combineTroubleActions({
      parent: defaultTrouble,
      child: trouble,
      error,
    });

    yield call(forEachTroubleActionSaga, troubleActions, error);
  }
}

/**
 * Параметры саги, которая оборачивает сагу в обработчик ошибок
 */
type WithErrorHandlerParams<TSaga extends Saga> = SagaWrapperParams<TSaga> & {
  /** trouble для обработки ошибок */
  params?: ErrorHandlerParams;
};

/**
 * Оборачивает сагу в обработчик ошибок
 *
 * @param params - параметры
 *
 * @returns результат
 */
function* withErrorHandlerSaga<TSaga extends Saga>({
  saga,
  params,
  args,
}: WithErrorHandlerParams<TSaga>): SagaIterator<ReturnType<TSaga>> {
  try {
    return yield call(saga, ...args);
  } catch (error) {
    return yield call(errorHandlerSaga, error, params);
  }
}

export const sagas = {
  withErrorHandler: withErrorHandlerSaga,
};
