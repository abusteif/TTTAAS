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
    // const mapButtonToAPICall = key => {
    //   var buttonPressed = "";
    //   switch (key) {
    //     case "home":
    //     case "back":
    //     case "up":
    //     case "down":
    //     case "right":
    //     case "left":
    //       buttonPressed = key;
    //       break;
    //     case "ok":
    //       buttonPressed = "select";
    //       break;
    //     case "undo":
    //       buttonPressed = "InstantReplay";
    //       break;
    //     case "star":
    //       buttonPressed = "Info";
    //       break;
    //     default:
    //       break;
    //   }
    //   return buttonPressed;
    // };
    // var testSteps = [];
    // for (var s in this.props.table) {
    //   testSteps.push({
    //     endpoint: `/keypress/${mapButtonToAPICall(this.props.table[s].action)}`,
    //     delay: this.props.table[s].delay
    //   });
    // }
    // const ttvPayload = {
    //   baseURL: "http://192.168.0.187:8060",
    //   endpoints: testSteps
    // };
    // this.props.runTestCase(ttvPayload);
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

  renderRows() {
    if (!this.props.table[0].order) return;

    return this.props.table.map(step => {
      return (
        <tr
          id={`step${step.order}`}
          key={step.order}
          onClick={() => {
            this.handleStepSelect(step.order);
          }}
        >
          <th scope="row">{step.order}</th>

          <td>
            <RemoteControlPopup
              action={step.action}
              stepId={step.order}
              onClick={() => {
                this.handleActionClicked(step.order);
              }}
            />
          </td>
          <td>
            {this.handleTableButtonsDisplay(
              "preview",
              step.action,
              step.order,
              step.expectedBehaviour.image
            ) && (
              <i
                id={`table_preview${step.order}`}
                className={(() => {
                  let previewClass =
                    "file image outline icon large pointer_cursor ";

                  previewClass =
                    this.props.previewClicked == step.order
                      ? previewClass + "previewHighlighted"
                      : previewClass + "";
                  return previewClass;
                })()}
                style={{ opacity: "0.9" }}
                onClick={() => {
                  this.handlePreviewClicked(
                    step.order,
                    step.expectedBehaviour.image
                  );
                  this.handleOnMouseLeave();
                }}
                onMouseOver={() => {
                  this.handleOnMouseHover(
                    `table_preview${step.order}`,
                    "View current expected behaviour"
                  );
                }}
                onMouseLeave={this.handleOnMouseLeave}
              />
            )}
            {this.handleTableButtonsDisplay(
              "edit",
              step.action,
              step.order,
              step.expectedBehaviour.image
            ) && (
              <i
                id={`table_edit${step.order}`}
                className="edit icon large pointer_cursor"
                style={{ opacity: "0.9" }}
                onClick={() => {
                  this.props.clickEdit(true);
                  this.handleOnMouseLeave();
                }}
                onMouseOver={() => {
                  this.handleOnMouseHover(
                    `table_edit${step.order}`,
                    "Edit current expected behaviour"
                  );
                }}
                onMouseLeave={this.handleOnMouseLeave}
              />
            )}

            <i
              id={`table_camera${step.order}`}
              className={"camera icon large playback_started "}
              onClick={() => {
                this.props.clickCamera(step.order);
                this.props.showPicture(false);
                this.props.showVideoStream(true);
                this.handleOnMouseLeave();
              }}
              onMouseOver={() => {
                this.handleOnMouseHover(
                  `table_camera${step.order}`,
                  "Set/Re-capture an expected behaviour"
                );
              }}
              onMouseLeave={this.handleOnMouseLeave}
            />

            {this.props.tooltip.hovered && (
              <Tooltip
                top={this.props.tooltip.coords.top}
                left={this.props.tooltip.coords.left}
                text={this.props.tooltip.text}
              />
            )}
          </td>
          <td>
            <Delay
              stepId={step.order}
              initialValue={step.delay}
              handleButtonClick={(stepId, delay) =>
                this.props.updateDelay(stepId, delay)
              }
            />
          </td>

          <td className="pt-3-half">
            {this.handleTableButtonsDisplay(
              "down",
              step.action,
              step.order
            ) && (
              <i
                style={{ position: "absolute", left: "25%", opacity: "0.9" }}
                className="long arrow alternate down icon pointer_cursor large"
                aria-hidden="true"
                onClick={() => this.handleDownButtonClick(step.order)}
              />
            )}
            {this.handleTableButtonsDisplay("up", step.action, step.order) && (
              <i
                style={{ position: "absolute", left: "33%", opacity: "0.9" }}
                onClick={() => this.handleUpButtonClick(step.order)}
                className="long arrow alternate up icon pointer_cursor large"
                aria-hidden="true"
              />
            )}
            {this.handleTableButtonsDisplay(
              "remove",
              step.action,
              step.order
            ) && (
              <i
                style={{ position: "absolute", left: "42%", opacity: "0.9" }}
                className="trash icon pointer_cursor large "
                onClick={() => {
                  this.handleRemoveButton(step.order);
                }}
              />
            )}
            {this.handleTableButtonsDisplay(
              "duplicate",
              step.action,
              step.order
            ) && (
              <i
                style={{ position: "absolute", left: "55%", opacity: "0.9" }}
                className="copy icon pointer_cursor large"
                onClick={() => this.handleDuplicateStep(step.order)}
              />
            )}
          </td>
        </tr>
      );
    });
  }

  render() {
    const titleText = this.props.selectedNode.title
      ? this.props.selectedNode.title
      : "Please select a test case";
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

          <div className="card" style={{ height: "85%" }}>
            <div className="card-body" style={{ height: "100%" }}>
              <div
                id="table"
                className="table-editable"
                style={{ height: "100%" }}
              >
                <table className="table table-bordered table-responsive-md table-striped text-center">
                  <thead>
                    <tr>
                      <th className="text-center" style={{ width: "10%" }}>
                        Step
                      </th>
                      <th className="text-center" style={{ width: "15%" }}>
                        Action
                      </th>
                      <th className="text-center" style={{ width: "30%" }}>
                        Expected Behaviour
                      </th>
                      <th className="text-center" style={{ width: "10%" }}>
                        Delay
                      </th>
                      <th className="text-center">Move</th>
                    </tr>
                  </thead>
                </table>
                <div style={{ overflowY: "scroll", height: "95%" }}>
                  <table className="table table-bordered table-responsive-md table-striped text-center">
                    <thead>
                      <tr>
                        <th
                          className="text-center"
                          style={{ width: "10.1%" }}
                        />
                        <th
                          className="text-center"
                          style={{ width: "15.2%" }}
                        />
                        <th
                          className="text-center"
                          style={{ width: "30.2%" }}
                        />
                        <th
                          className="text-center"
                          style={{ width: "10.2%" }}
                        />
                        <th
                          className="text-center"
                          style={{ width: "34.3%" }}
                        />
                      </tr>
                    </thead>
                    <tbody>{this.renderRows()}</tbody>
                  </table>
                  <span className="table-add float-left mb-3 mr-2">
                    <i
                      style={{ cursor: "pointer" }}
                      className="fas fa-plus fa-2x grey"
                      aria-hidden="true"
                      onClick={this.handleAddStep}
                    />
                    {this.props.actionClicked && (
                      <Modal
                        anchorId="modal"
                        closeModalHandler={() => this.props.clickAction(null)}
                      >
                        <RemoteControlPanel
                          clickHandler={this.remoteControlClickHandler}
                          top={this.props.selectedStepCoords.top}
                          left={this.props.selectedStepCoords.left}
                        />
                      </Modal>
                    )}
                  </span>
                  {this.props.previewClicked && (
                    <Modal
                      anchorId="modal"
                      closeModalHandler={() =>
                        this.props.clickPreview(null, "")
                      }
                    >
                      <ExpectedBehaviourPreview
                        previewPic={
                          this.props.table[this.props.selectedStep - 1]
                            .expectedBehaviour.image
                        }
                        pictureLink={this.props.previewLink}
                        top={this.props.selectedStepCoords.top}
                        left={this.props.selectedStepCoords.left}
                      />
                    </Modal>
                  )}

                  {this.props.editClicked && (
                    <Modal
                      anchorId="modal"
                      closeModalHandler={() => {
                        if (this.props.expectedBehaviourEdited) {
                          alert(
                            "Expected behaviour selection has been edited. Please save or discard the change to proceed"
                          );
                        } else this.props.clickEdit(false);
                      }}
                    >
                      <EditExpectedBehaviourComponent
                        image={
                          this.props.table[this.props.selectedStep - 1]
                            .expectedBehaviour.image
                        }
                        selection={
                          this.props.table[this.props.selectedStep - 1]
                            .expectedBehaviour.selection
                        }
                        saveButtonHandler={({ top, left, width, height }) => {
                          this.props.updateSelection(
                            this.props.selectedStep,
                            top,
                            left,
                            width,
                            height
                          );
                          this.props.clickEdit(false);
                          this.props.expectedBehaviourSelectionChanged(false);
                        }}
                        cancelButtonHandler={() => {
                          {
                            this.props.clickEdit(false);
                            this.props.expectedBehaviourSelectionChanged(false);
                          }
                        }}
                        // inverseSelectionButtonHandler={() => {
                        //   this.props.clickEdit(false);
                        //   this.props.expectedBehaviourSelectionChanged(false);
                        // }}
                        handleChange={() => {
                          this.props.expectedBehaviourSelectionChanged(true);
                        }}
                      />
                    </Modal>
                  )}

                  {this.props.testCaseExecute.testExecuteOverlayOpen && (
                    <Modal
                      anchorId="modal"
                      closeModalHandler={() =>
                        this.props.closeTestExecuteOverlay()
                      }
                    >
                      <TestCaseExecute />
                    </Modal>
                  )}
                </div>

                <br />
                <button
                  onClick={this.handleSaveClick}
                  className={
                    "ui primary button " + this.getButtonStatus("save")
                  }
                >
                  Save
                </button>
                <button
                  className={"ui button " + this.getButtonStatus("discard")}
                  onClick={this.handleDiscardClick}
                >
                  Discard
                </button>
                <button
                  onClick={this.handleRunStepClick}
                  className={"ui button " + this.getButtonStatus("run")}
                >
                  Run Test Case
                </button>
              </div>
            </div>
          </div>
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
