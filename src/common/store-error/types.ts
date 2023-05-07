import { Trouble } from '@common/trouble';

/** Unhandled error strategy */
export enum UnhandledErrorsStrategy {
  /** use default handler */
  UseDefault = 'UseDefault',
  /** throw forward */
  Throw = 'Throw',
}

export type ErrorHandlerParams = {
  /** trouble */
  trouble: Trouble;
  /** Unhandled error strategy */
  unhandledErrorsStrategy: UnhandledErrorsStrategy;
};
