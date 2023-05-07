import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { config } from '../config';

export type ModelState = {
  /** Код ошибки */
  code: string;
  /** Http статус ответа сервера */
  status?: number;
  /** Сообщение ошибки */
  message?: string;
};

/**
 * Начальное состояние модели
 */
const initialState: ModelState | null = null;

/**
 * Cлайс модели
 */
const errorSlice = createSlice({
  name: config.modelName,
  initialState,
  reducers: {
    setError: (_, { payload }: PayloadAction<ModelState>) => payload,

    reset: () => initialState,
  },
});

export const { reducer, actions } = errorSlice;
