import { Saga } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { SagaWithParameters } from '@common/store';

import { sagas } from '../model';
import { ErrorHandlerParams } from '../types';

/**
 * Хелпер для оборачивания саги в обработчик ошибки
 */
type ErrorHandler = (
  params?: ErrorHandlerParams,
) => <TSaga extends Saga>(saga: TSaga) => SagaWithParameters<TSaga>;

/**
 * Хелпер для оборачивания саги в обработчик ошибки
 *
 * @param params - параметры для обработки исключений
 *
 * @returns Сага обернутая в withErrorHandler
 */
export const errorHandler: ErrorHandler = (params) => (saga) =>
  function* newSaga(...args) {
    return yield call(sagas.withErrorHandler, {
      saga,
      params,
      args,
    });
  };
