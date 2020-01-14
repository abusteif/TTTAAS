export const startTestCaseExecution = () => {
  return {
    type: "START_TEST_CASE_EXECUTION"
  };
};

export const stopTestCaseExecution = () => {
  return {
    type: "STOP_TEST_CASE_EXECUTION"
  };
};

export const openTestExecuteOverlay = () => {
  return {
    type: "OPEN_TEST_EXECUTE_OVERLAY"
  };
};

export const closeTestExecuteOverlay = () => {
  return {
    type: "CLOSE_TEST_EXECUTE_OVERLAY"
  };
};
