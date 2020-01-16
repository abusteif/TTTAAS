import React, { Component } from "react";
import ReactDOM from "react-dom";
import _ from "lodash";
import { connect } from "react-redux";
import {
  updateTestCaseTable,
  selectStep,
  clickAction,
  clickCamera,
  clickPreview,
  updatePreview,
  clickEdit,
  updateSelection,
  expectedBehaviourSelectionChanged,
  updateDelay,
  updateInitialTable,
  runTestCase
} from "../actions/table";

import {
  updateTooltipFunc,
  showToolTip,
  decrementToolTipTimer,
  hideTooltip
} from "../actions/tooltip";

import { showVideoStream, showPicture } from "../actions/videoStream";
import VideoComponent from "./videoComponent";

import {
  startTestCaseExecution,
  stopTestCaseExecution,
  openTestExecuteOverlay,
  closeTestExecuteOverlay
} from "../actions/testCaseExecute";

import { testCases } from "../static/mockData";
import RemoteControlPopup from "./remoteControlPopup";
import RemoteControlPanel from "./remoteControlPanel";
import ExpectedBehaviourPreview from "./expectedBehaviourPicture";
import Modal from "./modal";
import Tooltip from "./tooltip";
import EditExpectedBehaviourComponent from "./editExpectedBehaviourComponent";
import Delay from "./delay.js";
import TestCaseExecute from "./testCaseExecute";

import ReactTable from "react-table";
import "react-table/react-table.css";

import table from "../apis/table.js";

import "../styling/remoteIcon.css";
import "../styling/table.css";

const hoverTimer = 1.5;
class TestCaseTable extends Component {
  handleStepSelect = stepId => {
    const stepCoords = this.getCoords(`#step${stepId}`);
    this.props.selectStep(stepId, stepCoords);
  };

  handleActionClicked = step => {
    this.props.clickAction(step);
  };
  handlePreviewClicked = (step, previewLink) => {
    this.props.clickPreview(step, previewLink);
  };

  handleAddStep = () => {
    const stepNumber = this.props.table.length + 1;
    if (
      this.props.table.length !== 0 &&
      this.props.table[this.props.table.length - 1].action === "default"
    )
      return;
    this.props.updateTestCaseTable([
      ...this.props.table,
      {
        order: stepNumber,
        action: "default",
        delay: 1,
        expectedBehaviour: {
          image: "",
          selection: {
            top: 0,
            left: 0,
            width: 0,
            height: 0
          }
        }
      }
    ]);
  };

  handleRemoveButton = stepId => {
    const newTable = JSON.parse(JSON.stringify([...this.props.table]));
    newTable.splice(stepId - 1, 1);
    for (let i = 0; i < newTable.length; i++) {
      newTable[i].order = i + 1;
    }
    this.props.updateTestCaseTable(newTable);
  };

  handleUpButtonClick = stepId => {
    const newTable = JSON.parse(JSON.stringify([...this.props.table]));
    const tempRow = newTable[stepId - 1];
    newTable[stepId - 1] = newTable[stepId - 2];
    newTable[stepId - 2] = tempRow;
    newTable[stepId - 1].order = stepId;
    newTable[stepId - 2].order = stepId - 1;
    this.props.updateTestCaseTable(newTable);
  };

  handleDownButtonClick = stepId => {
    const newTable = JSON.parse(JSON.stringify([...this.props.table]));
    const tempRow = newTable[stepId - 1];
    newTable[stepId - 1] = newTable[stepId];
    newTable[stepId] = tempRow;
    newTable[stepId - 1].order = stepId;
    newTable[stepId].order = stepId + 1;
    this.props.updateTestCaseTable(newTable);
  };

  handleDuplicateStep = stepId => {
    stepId = Number(stepId);
    const newTable = [];
    for (let i = 0; i < stepId; i++) {
      newTable.push(this.props.table[i]);
    }
    newTable.push({
      ...this.props.table[stepId - 1],
      order: Number(stepId) + 1
    });
    for (let i = stepId; i < this.props.table.length; i++)
      newTable.push({ ...this.props.table[i], order: i + 2 });
    this.props.updateTestCaseTable(newTable);
  };

  updateInitialTable = () => {
    const newInitialTable = JSON.parse(JSON.stringify([...this.props.table]));
    this.props.updateInitialTable(newInitialTable);
  };

  getCoords = element => {
    return ReactDOM.findDOMNode(this)
      .querySelector(element)
      .getBoundingClientRect();
  };

  handleTableButtonsDisplay = (buttonType, action, stepId, extraValue) => {
    switch (buttonType) {
      case "up":
        return stepId != 1 && action != "default";
      case "down":
        return stepId != this.props.table.length;
      case "duplicate":
        return action != "default";
      case "remove":
        return this.props.table.length !== 1;
      case "preview":
      case "edit":
        return extraValue;
    }
  };

  getButtonStatus = buttonName => {
    if (buttonName === "save" || buttonName === "discard")
      return _.isEqual(this.props.table, this.props.initialTable) ||
        !this.props.table[0].action ||
        this.props.table[0].action === "default"
        ? "disabled"
        : "";
    if (buttonName === "run") {
      if (this.props.table.length === 1) {
        if (
          this.props.table[0].action === "default" ||
          !this.props.table[0].action
        )
          return "disabled";
      } else {
        return "";
      }
    }
  };

  handleDiscardClick = () => {
    this.props.updateTestCaseTable([...this.props.initialTable]);
  };

  handleSaveClick = async () => {
    const postData = {
      name: this.props.selectedTreedNode.title,
      id: this.props.selectedTreedNode.id,
      parentId: this.props.selectedTreedNode.parentId,
      steps: this.props.table
    };
    const response = await table.put(
      `/test-case/${this.props.selectedTreedNode.id}`,
      { testCase: postData },
      { "Content-Type": "application/json" }
    );
    if (response.status === 201) {
      this.updateInitialTable();
    }
  };

  handleRunStepClick = () => {
    if (this.props.video.showStream) this.props.showVideoStream(false);
    this.props.openTestExecuteOverlay();
  };

  remoteControlClickHandler = newAction => {
    const newTable = [...this.props.table];
    const index = _.findIndex(newTable, { order: this.props.selectedStep });
    newTable.splice(index, 1, { ...newTable[index], action: newAction });
    this.props.clickAction(null);
    this.props.updateTestCaseTable(newTable);
  };

  handleOnMouseHover = (button, text) => {
    this.props.updateTooltipFunc(
      setInterval(() => {
        if (this.props.tooltip.hoverTimer <= 0) {
          this.props.showToolTip(
            hoverTimer,
            this.getCoords(`#${button}`),
            text
          );

          clearInterval(this.props.tooltip.hoverIntervalFunction);
        } else this.props.decrementToolTipTimer();
      }, this.props.tooltip.constHoverTimer * 100)
    );
  };

  handleOnMouseLeave = () => {
    clearInterval(this.props.tooltip.hoverIntervalFunction);
    this.props.hideTooltip();
  };

  handleIconGreyOut = (condition, classOne, classTwo) => {
    return condition ? classOne : classTwo;
  };

  displayActions = stepId => {};

  renderTableColumns = () => {
    console.log(this.props.table);
    return this.props.table.map(step => {
      return {
        stepId: step.order,
        action: (
          <RemoteControlPopup
            action={step.action}
            stepId={step.order}
            onClick={() => {}}
          />
        ),
        expectedBehaviour: step.expectedBehaviour.image ? "picture" : "-",
        move: "pass"
      };
    });
  };

  render() {
    const titleText = this.props.selectedNode.title
      ? this.props.selectedNode.title
      : "Please select a test case";

    if (!this.props.table[0].order) return <div />;
    console.log(this.props.table.length);

    if (this.props.selectedNode.title)
      return (
        <div style={{ height: "100%" }}>
          <div className="headerStyling">
            <i
              className="fa fa-file-text"
              style={{
                fontSize: "30px",
                color: "rgba(0,0,0,0.5)",
                paddingRight: "10px"
              }}
            />
            {titleText}
          </div>
          <ReactTable
            data={this.renderTableColumns()}
            showPagination={false}
            columns={[
              {
                columns: [
                  {
                    Header: "Step",
                    accessor: "stepId",
                    id: props => `#step${props.original.stepId}`
                  },
                  {
                    Header: "Action",
                    accessor: "action"
                  },
                  {
                    Header: "Expected Behaviour",
                    accessor: "expectedBehaviour"
                  },
                  {
                    Header: "Move",
                    accessor: "move"
                  }
                ]
              }
            ]}
            defaultPageSize={this.props.table.length}
            className="-striped -highlight tableStyling"
            getTrProps={(state, rowInfo) => {
              if (rowInfo && rowInfo.row) {
                return {
                  onClick: e => {
                    this.handleStepSelect(rowInfo.index);
                  }
                };
              }
            }}
          />
        </div>
      );
    else return <div />;
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    treeData: state.tree.tree,
    selectedTreedNode: state.tree.selectedNode,
    selectedNode: state.tree.selectedNode,
    initialTable: state.table.initialTable,
    table: state.table.table,
    selectedStep: state.table.selectedStep,
    selectedStepCoords: state.table.selectedStepCoords,
    actionClicked: state.table.actionClicked,
    cameraClicked: state.table.cameraClicked,
    previewClicked: state.table.previewClicked,
    expectedBehaviourEdited: state.table.expectedBehaviourEdited,
    editClicked: state.table.editClicked,
    previewLink: state.table.previewLink,
    tooltip: state.tooltip,
    video: state.videoStream,
    testCaseExecute: state.testCaseExecution
  };
};

export default connect(
  mapStateToProps,
  {
    updateTestCaseTable,
    selectStep,
    clickAction,
    clickCamera,
    clickPreview,
    updatePreview,
    showVideoStream,
    updateTooltipFunc,
    showToolTip,
    decrementToolTipTimer,
    hideTooltip,
    showPicture,
    clickEdit,
    updateSelection,
    expectedBehaviourSelectionChanged,
    updateDelay,
    updateInitialTable,
    runTestCase,
    startTestCaseExecution,
    stopTestCaseExecution,
    openTestExecuteOverlay,
    closeTestExecuteOverlay
  }
)(TestCaseTable);
