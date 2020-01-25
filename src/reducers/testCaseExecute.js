const INITIAL_TEST_EXECUTE_STATE = {
  testCaseExecuting: false,
  testExecuteOverlayOpen: false,
  stepDone: true
};

export const testCaseExecute = (state = INITIAL_TEST_EXECUTE_STATE, action) => {
  switch (action.type) {
    case "START_TEST_CASE_EXECUTION":
      return { ...state, testCaseExecuting: true };

    case "STOP_TEST_CASE_EXECUTION":
      return { ...state, testCaseExecuting: false };
    case "OPEN_TEST_EXECUTE_OVERLAY":
      return { ...state, testExecuteOverlayOpen: true };
    case "CLOSE_TEST_EXECUTE_OVERLAY":
      return { ...state, testExecuteOverlayOpen: false };

    default:
      return state;
  }
};
