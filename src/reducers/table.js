import { videoDimensions, videoScaling } from "../configs.js";

import _ from "lodash";
const INITIAL_TEST_CASE_TABLE = {
  table: [{}],

  initialTable: [
    {
      // order: "1",
      // action: "default",
      // expectedBehaviour: {
      //   image: "",
      //   selection: {
      //     top: 0,
      //     left: 0,
      //     width: 0,
      //     height: 0
      //   }
      // },
      //
      // delay: 1
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
      if (!action.payload.testCase) return INITIAL_TEST_CASE_TABLE;

      const testSteps = action.payload.testCase.steps;
      if (testSteps)
        return {
          ...state,
          table: testSteps,
          initialTable: testSteps
        };
      else {
        return INITIAL_TEST_CASE_TABLE;
      }

    case "UPDATE_INITIAL_TABLE":
      return { ...state, initialTable: action.payload };

    case "UPDATE_TEST_CASE_TABLE":
      return { ...state, table: action.payload };

    case "RESET_tABLE":
      return INITIAL_TEST_CASE_TABLE;

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
            top: 0,
            left: 0,
            width: videoDimensions.width / videoScaling,
            height: videoDimensions.height / videoScaling
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

    case "UPDATE_DELAY":
      const newState3 = JSON.parse(JSON.stringify({ ...state }));

      const index3 = _.findIndex(newState3.table, {
        order: action.payload.stepNumber
      });
      newState3.table.splice(index3, 1, {
        ...newState3.table[index3],
        delay: action.payload.delay
      });
      return newState3;

    default:
      return state;
  }
};
