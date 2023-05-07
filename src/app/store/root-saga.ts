import { SagaIterator } from 'redux-saga';
import { call, all, fork } from 'redux-saga/effects';


/**
 * Main saga - entry point
 *
 * @returns {void}
 */
export function* rootSaga(): SagaIterator {
  // eslint-disable-next-line no-console
  yield call(console.log, 'Root Saga Runner...!');

  yield all(
    [
      /** common */

      /** entities */

      /** features */

      /** pages */

      /** processes */

    ].map(fork),
  );
}
