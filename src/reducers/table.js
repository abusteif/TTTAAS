import { testCases } from "../static/mockData";
import _ from "lodash";
const INITIAL_TEST_CASE_TABLE = {
  table: [
    {
      order: "1",
      action: "default",
      expectedBehaviour: "",
      delay: ""
    }
  ],
  initialTable: [
    {
      order: "1",
      action: "default",
      expectedBehaviour: "",
      delay: ""
    }
  ],
  selectedStep: "",
  selectedStepCoords: "",
  actionClicked: "",
  cameraClicked: "",
  previewClicked: "",
  previewLink: "",
  editClicked: false
};

export const testCaseTable = (state = INITIAL_TEST_CASE_TABLE, action) => {
  switch (action.type) {
    case "RETRIEVE_STEPS":
      const testSteps = testCases.filter(testCase => {
        return testCase.id === action.payload;
      });
      if (!testSteps[0]) return INITIAL_TEST_CASE_TABLE;
      if (!testSteps[0].steps) return INITIAL_TEST_CASE_TABLE;
      return {
        ...state,
        table: testSteps[0].steps,
        initialTable: testSteps[0].steps
      };

    case "UPDATE_TEST_CASE_TABLE":
      return { ...state, table: action.payload };

    case "SELECT_STEP":
      return {
        ...state,
        selectedStep: action.payload.stepNumber,
        selectedStepCoords: action.payload.coords
      };

    case "CLICK_ACTION":
      return { ...state, actionClicked: action.payload.stepNumber };

    case "CLICK_CAMERA":
      return { ...state, cameraClicked: action.payload.stepNumber };

    case "CLICK_PREVIEW":
      console.log(state);
      return {
        ...state,
        previewClicked: action.payload.stepNumber,
        previewLink: action.payload.previewLink
      };

    case "UPDATE_PREVIEW":
      const newState = JSON.parse(JSON.stringify({ ...state }));

      const index = _.findIndex(newState.table, {
        order: action.payload.stepNumber
      });
      newState.table.splice(index, 1, {
        ...newState.table[index],
        expectedBehaviour: action.payload.previewLink
      });
      return newState;
    case "CLICK_EDIT":
      return { ...state, editClicked: action.payload };
    default:
      return state;
  }
};
