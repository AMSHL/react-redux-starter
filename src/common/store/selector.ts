import { useSelector } from 'react-redux';

import { PartialState } from './types';

/**
 * Создает селектор модели
 *
 * @param {string} modelName - Название модели
 *
 * @returns {function} Cелектор поля модели
 */
export function createModelSelector<S>(modelName: string) {
  return (state: PartialState<typeof modelName, S>): S => state[modelName];
}

/**
 * Создает селектор поля модели
 *
 * @param {string} modelName - Название модели
 *
 * @returns {function} Cелектор поля модели
 */
export function createModelFieldSelector<S>(modelName: string) {
  return <TField extends keyof S>(field: TField, defaultValue?: S[TField]) => (
    state: PartialState<typeof modelName, S>,
  ): S[TField] => {
    const result = state[modelName]?.[field];
    return defaultValue !== undefined ? result ?? defaultValue : result;
  };
}

/**
 * Создает хук для селектора
 *
 * @param selector - селектор
 *
 * @returns хук
 */
export function createHookSelector<TState, TSelected = unknown>(
  selector: (state: TState) => TSelected,
) {
  return (): TSelected => useSelector(selector);
}

/**
 * Функция создает селектор параметров
 *
 * @param selector - функция, которая возвращает параметр
 *
 * @returns результат
 */
export function createParameterSelector<P, R>(
  selector: (params: P) => R,
): (_: unknown, params: P) => R {
  return (_, params) => selector(params);
}
