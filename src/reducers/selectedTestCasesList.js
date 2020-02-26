const _ = require("lodash");
const INITIAL_TEST_CASE_SELECT_STATE = {
  selectedTestCaseList: [],
  initialSelectedTestCaseList: []
};

export const testCaseSelect = (
  state = INITIAL_TEST_CASE_SELECT_STATE,
  action
) => {
  switch (action.type) {
    case "GET_SELECTED_TEST_CASES":
      return {
        ...state,
        selectedTestCaseList: action.payload.docker.testCaseList,
        initialSelectedTestCaseList: action.payload.docker.testCaseList
      };

    case "UPDATE_INITIAL_SELECTED_TEST_CASE_LIST":
      return { ...state, initialSelectedTestCaseList: action.payload };

    case "UPDATE_SELECTED_TEST_SUITE":
      return { ...state, selectedTestCaseList: action.payload };

    case "ADD_TO_SELECTED_TEST_SUITE":
      var testSuite = state.selectedTestCaseList.find(
        x => x.id === action.payload.id
      );

      if (testSuite) {
        var newTestCases = [...testSuite.testCases];
        for (var testCase in action.payload.testCases) {
          if (
            testSuite.testCases.find(
              x => x.id === action.payload.testCases[testCase].id
            )
          )
            continue;
          else {
            newTestCases = [
              ...newTestCases,
              action.payload.testCases[testCase]
            ];
          }
        }
        var newTestSuite = { ...testSuite, testCases: newTestCases };
        var newTestCaseList = [...state.selectedTestCaseList];

        newTestCaseList[
          state.selectedTestCaseList.indexOf(testSuite)
        ] = newTestSuite;
        newTestCaseList = _.orderBy(newTestCaseList, ["name"], ["asc"]);
        return { ...state, selectedTestCaseList: newTestCaseList };
      } else {
        newTestCaseList = _.orderBy(
          [...state.selectedTestCaseList, action.payload],
          ["name"],
          ["asc"]
        );

        return {
          ...state,
          selectedTestCaseList: newTestCaseList
        };
      }

      break;
    case "REMOVE_FROM_SELECTED_TEST_SUITE":
      const newState = JSON.parse(JSON.stringify({ ...state }));

      testSuite = newState.selectedTestCaseList.find(
        x => x.id === action.payload.elementToRemove.id
      );
      switch (action.payload.type) {
        case "test_case":
          _.remove(testSuite.testCases, {
            id: action.payload.elementToRemove.testCases.id
          });
          newTestCaseList = [...newState.selectedTestCaseList];
          _.remove(newTestCaseList, {
            id: action.payload.elementToRemove.id
          });
          newTestCaseList = [...newTestCaseList, testSuite];
          newTestCaseList = _.orderBy(newTestCaseList, ["name"], ["asc"]);
          return { ...newState, selectedTestCaseList: newTestCaseList };

        case "test_suite":
          newTestCaseList = [...newState.selectedTestCaseList];
          _.remove(newTestCaseList, {
            id: action.payload.elementToRemove.id
          });
          newTestCaseList = _.orderBy(newTestCaseList, ["name"], ["asc"]);

          return { ...state, selectedTestCaseList: newTestCaseList };
      }

      return state;
      break;
    default:
      return state;
  }
};
