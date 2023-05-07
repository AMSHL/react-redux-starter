/** Action to handle error */
export type TroubleAction = (error: Error) => unknown;

/** function to match error and action */
export type TroubleMatcher = (error: Error) => boolean;

/** Actions divided by types */
export type TroubleSplittedActions = {
  matchedActions: TroubleAction[];
  otherwiseActions: TroubleAction[];
  alwaysActions: TroubleAction[];
};

/** Trouble - error handler */
export type Trouble = {
  /** Register action, if matcher finds error */
  on: (matcher: TroubleMatcher, action: TroubleAction) => Trouble;

  /** Register action thant runs if no other actions will run */
  otherwise: (action: TroubleAction) => Trouble;

  /** Register action that runs always after everything runs(finally analog). */
  always: (action: TroubleAction) => Trouble;

  /** Clear all registered actions */
  clear: () => Trouble;

  /** Get split by types actions for Error */
  getSplittedActions(error: Error): TroubleSplittedActions;

  /** Get all Error actions */
  getActions(error: Error): TroubleAction[];
};
