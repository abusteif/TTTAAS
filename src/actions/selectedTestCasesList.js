import dockerList from "../apis/dockerList.js";

export const getSelectedTestCases = id => async dispatch => {
  const response = await dockerList.get(`/docker/${id}`);
  console.log(response.data);
  dispatch({ type: "GET_SELECTED_TEST_CASES", payload: response.data });
};

export const updateIntialSelectedTestCaseList = newInitialTable => {
  return {
    type: "UPDATE_INITIAL_SELECTED_TEST_CASE_LIST",
    payload: newInitialTable
  };
};

export const addToSelectedTestSuite = newElement => {
  return {
    type: "ADD_TO_SELECTED_TEST_SUITE",
    payload: newElement
  };
};

export const removeFromSelectedTestSuite = (elementToRemove, type) => {
  return {
    type: "REMOVE_FROM_SELECTED_TEST_SUITE",
    payload: { elementToRemove, type }
  };
};

export const updateSelectedTestSuite = newTestSuite => {
  return {
    type: "UPDATE_SELECTED_TEST_SUITE",
    payload: newTestSuite
  };
};
