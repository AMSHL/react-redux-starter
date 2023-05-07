import { Saga, SagaIterator } from 'redux-saga';
import { SagaReturnType } from 'redux-saga/effects';

/**
 * Частичное состояние стора
 */
export type PartialState<TModelName extends string, TModelState> = Record<
  TModelName,
  TModelState
>;

/**
 * Параметры саги, которая оборачивает и вызывает внутри себя другую сагу
 */
export type SagaWrapperParams<TSaga extends Saga> = {
  /** Целевая сага */
  saga: TSaga;
  /** Параметры саги */
  args: Parameters<TSaga>;
};

/**
 * Сага с параметрами
 */
export type SagaWithParameters<TSaga extends Saga> = (
  ...args: Parameters<TSaga>
) => SagaIterator<SagaReturnType<TSaga>>;
