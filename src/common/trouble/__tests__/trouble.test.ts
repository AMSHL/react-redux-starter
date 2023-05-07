import { createTrouble, combineTroubleActions } from '../trouble';

const errors = ['one', 'two', 'three'].map((message) => new Error(message));

const isEqErrors = (err1: Error, err2: Error) => err1.message === err2.message;

const config = () => {
  const action1 = jest.fn();
  const action2 = jest.fn();

  const trouble = createTrouble()
    .on((error) => isEqErrors(errors[0], error), action1)
    .on((error) => isEqErrors(errors[1], error), action2);

  return { action1, action2, trouble };
};

describe('trouble', () => {
  test('on', () => {
    const { action1, action2, trouble } = config();

    expect(trouble.getActions(errors[0]).length).toBe(1);
    expect(trouble.getActions(errors[0])[0]).toBe(action1);

    expect(trouble.getActions(errors[1]).length).toBe(1);
    expect(trouble.getActions(errors[1])[0]).toBe(action2);

    expect(trouble.getActions(errors[2]).length).toBe(0);
  });

  test('otherwise', () => {
    const action = jest.fn();
    const { trouble } = config();

    trouble.otherwise(action);

    const actions = trouble.getActions(errors[2]);

    expect(actions.length).toBe(1);
    expect(actions[0]).toBe(action);
  });

  test('always', () => {
    const action = jest.fn();
    const { trouble } = config();

    trouble.always(action);

    const actions = trouble.getActions(errors[0]);

    expect(actions.length).toBe(2);
    expect(actions[1]).toBe(action);
  });

  test('clear', () => {
    const trouble = createTrouble()
      .on((error) => isEqErrors(errors[0], error), jest.fn())
      .otherwise(jest.fn())
      .always(jest.fn())
      .clear();

    expect(trouble.getActions(errors[0])).toEqual([]);
  });

  test('getSplittedActions', () => {
    const otherwiseAction = jest.fn();
    const alwaysAction = jest.fn();

    const { action1, trouble } = config();

    trouble.otherwise(otherwiseAction);

    const splitted = trouble.getSplittedActions(errors[0]);
    expect(splitted.matchedActions.length).toBe(1);
    expect(splitted.matchedActions[0]).toBe(action1);
    expect(splitted.alwaysActions.length).toBe(0);
    expect(splitted.otherwiseActions.length).toBe(0);

    const splitted2 = trouble.getSplittedActions(errors[2]);
    expect(splitted2.matchedActions.length).toBe(0);
    expect(splitted2.alwaysActions.length).toBe(0);
    expect(splitted2.otherwiseActions.length).toBe(1);
    expect(splitted2.otherwiseActions[0]).toBe(otherwiseAction);

    trouble.always(alwaysAction);

    const splitted3 = trouble.getSplittedActions(errors[0]);
    expect(splitted3.matchedActions.length).toBe(1);
    expect(splitted3.matchedActions[0]).toBe(action1);
    expect(splitted3.alwaysActions.length).toBe(1);
    expect(splitted3.alwaysActions[0]).toBe(alwaysAction);
    expect(splitted3.otherwiseActions.length).toBe(0);
  });
});

describe('combineTroubleActions', () => {
  test('juset parent', () => {
    const { action1, trouble } = config();
    const actions = combineTroubleActions({
      parent: trouble,
      error: errors[0],
    });

    expect(actions.length).toBe(1);
    expect(actions[0]).toBe(action1);
  });

  test('parent and child. Both has the same matched handlers for one error', () => {
    const parent = config();
    const child = config();

    const actions = combineTroubleActions({
      parent: parent.trouble,
      child: child.trouble,
      error: errors[0],
    });

    expect(actions.length).toBe(1);
    expect(actions[0]).toBe(child.action1);
  });

  test('parent and child. Parent has matched handler for error that is not inside child', () => {
    const action = jest.fn();

    const parent = createTrouble().on(
      (error) => isEqErrors(errors[2], error),
      action,
    );
    const child = config();

    const actions = combineTroubleActions({
      parent: parent,
      child: child.trouble,
      error: errors[2],
    });

    expect(actions.length).toBe(1);
    expect(actions[0]).toBe(action);
  });

  test('parent и child. Оба имеют always обработчики', () => {
    const parentAction = jest.fn();
    const childAction = jest.fn();

    const parent = createTrouble().always(parentAction);
    const child = createTrouble().always(childAction);

    const actions = combineTroubleActions({
      parent,
      child,
      error: errors[0],
    });

    expect(actions.length).toBe(2);
    expect(actions[0]).toBe(childAction);
    expect(actions[1]).toBe(parentAction);
  });

  test('parent and child. Both has otherwise handlers', () => {
    const parentAction = jest.fn();
    const childAction = jest.fn();

    const parent = createTrouble().otherwise(parentAction);
    const child = createTrouble().otherwise(childAction);

    const actions = combineTroubleActions({
      parent,
      child,
      error: errors[0],
    });

    expect(actions.length).toBe(1);
    expect(actions[0]).toBe(childAction);
  });
});
