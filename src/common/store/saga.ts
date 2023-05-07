import { PayloadAction } from '@reduxjs/toolkit';
import { Saga, SagaIterator } from 'redux-saga';
import { call } from 'redux-saga/effects';

import { SagaWithParameters } from './types';

/**
 * Тип функции преобразующей первый параметр саги из
 * простого аргумента в payload экшена
 */
type PassPayloadParam = <TSaga extends Saga>(
  saga: TSaga,
) => (
  action: PayloadAction<Parameters<TSaga>[0]>,
) => SagaIterator<ReturnType<TSaga>>;

/**
 * Преобразует первый параметр саги из простого аргумента в payload экшена
 *
 * @example
 * function* foo(bar: string): SagaIterator
 *    =\> function* foo(action: PayloadAction<string>): SagaIterator
 *
 * @param saga - Целевая сага
 * @returns Сага принимающая экшен
 */
export const passActionPayload: PassPayloadParam = (saga) =>
  function* newSaga({ payload }) {
    return yield call(saga, ...([payload] as Parameters<typeof saga>));
  };

type Safe = <TSaga extends Saga>(saga: TSaga) => SagaWithParameters<TSaga>;

/**
 * Безопасная сага
 *
 * @param saga - Целевая сага
 * @returns  новая сага
 */
export const safe: Safe = (saga) =>
  function* newSaga(...args) {
    try {
      return yield call(saga, ...args);
    } catch {
      return undefined;
    }
  };

/**
 * Композиция саг
 *
 * @param target целевая сага
 * @param composers композиторы
 *
 * @returns новая сага
 */
export function composeSaga<TSaga extends Saga, R extends Saga>(
  target: TSaga,
  composers: [(saga: TSaga) => R, ...((saga: TSaga) => Saga)[]],
): R {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any = target;

  composers.reverse().forEach((composer) => {
    result = composer(result);
  });

  return result;
}
