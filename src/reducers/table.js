import { testCases } from "../static/mockData";
import { videoDimensions } from "../configs.js";

import _ from "lodash";
const INITIAL_TEST_CASE_TABLE = {
  table: [
    {
      order: "1",
      action: "default",
      expectedBehaviour: {
        image: "",
        selection: {
          top: 0,
          left: 0,
          width: 0,
          height: 0
        }
      },

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
  editClicked: false,
  expectedBehaviourEdited: false
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
      const newState1 = JSON.parse(JSON.stringify({ ...state }));

      const index1 = _.findIndex(newState1.table, {
        order: action.payload.stepNumber
      });
      newState1.table.splice(index1, 1, {
        ...newState1.table[index1],
        expectedBehaviour: {
          ...newState1.table[index1].expectedBehaviour,
          image: action.payload.previewLink,
          selection: {
            top: videoDimensions.height - 50,
            left: videoDimensions.width - 75,
            width: 150,
            height: 100
          }
        }
      });
      return newState1;
    case "CLICK_EDIT":
      return { ...state, editClicked: action.payload };

    case "EXPECTED_BEHAVIOUR_CHANGED":
      return { ...state, expectedBehaviourEdited: action.payload };

    case "UPDATE_SELECTION":
      const newState2 = JSON.parse(JSON.stringify({ ...state }));

      const index2 = _.findIndex(newState2.table, {
        order: action.payload.stepNumber
      });

      newState2.table.splice(index2, 1, {
        ...newState2.table[index2],
        expectedBehaviour: {
          ...newState2.table[index2].expectedBehaviour,
          selection: action.payload.selection
        }
      });
      return newState2;

    default:
      return state;
  }
};
