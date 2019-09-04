export const updateTestCaseTable = table => {
  return {
    type: "UPDATE_TEST_CASE_TABLE",
    payload: table
  };
};

export const initializeTestCaseTable = testCaseId => {
  return {
    type: "RETRIEVE_STEPS",
    payload: testCaseId
  };
};

export const selectStep = (stepNumber, coords) => {
  return {
    type: "SELECT_STEP",
    payload: {
      stepNumber: stepNumber,
      coords: coords
    }
  };
};

export const clickAction = stepNumber => {
  return {
    type: "CLICK_ACTION",
    payload: {
      stepNumber: stepNumber
    }
  };
};

export const clickCamera = stepNumber => {
  return {
    type: "CLICK_CAMERA",
    payload: {
      stepNumber: stepNumber
    }
  };
};

export const clickPreview = (stepNumber, previewLink) => {
  return {
    type: "CLICK_PREVIEW",
    payload: {
      stepNumber: stepNumber,
      previewLink: previewLink
    }
  };
};

export const updatePreview = (stepNumber, newPreview) => {
  console.log(stepNumber);
  return {
    type: "UPDATE_PREVIEW",
    payload: {
      stepNumber: stepNumber,
      previewLink: newPreview
    }
  };
};

export const clickEdit = status => {
  return {
    type: "CLICK_EDIT",
    payload: status
  };
};
