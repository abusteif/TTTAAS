import React, { Component } from "react";
import { connect } from "react-redux";
import { pressTtvKey, executeStep } from "../actions/ttvControl";
import VideoComponent from "./videoComponent";
import RemoteControlPanel from "./remoteControlPanel";
import RemoteControlPopup from "./remoteControlPopup";

import ReactTable from "react-table";
import { videoDimensions } from "../configs.js";
import {
  startTestCaseExecution,
  stopTestCaseExecution,
  closeTestExecuteOverlay
} from "../actions/testCaseExecute";

import "../styling/expectedBehaviour.css";
import "../styling/videoComponent.css";
import "react-table/react-table.css";

import "../styling/testCaseExecute.css";
import { streamIp, streamPort, streamCode } from "../configs.js";
import { remoteControlButtonMapping } from "../utils.js";

class TestCaseExecute extends Component {
  state = {
    completeTestCase: [],
    currentTeststepsId: 0,
    currentResult: "running",
    videoReady: false,
    newTestStepsTable: [],
    stopClicked: false,
    executionComplete: false
  };
  componentDidMount = () => {
    this.startPlayback = this.child.startPlayback;
    this.setState({
      completeTestCase: this.props.table
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (this.state.stopClicked) {
      this.setState({ stopClicked: false });
      return;
    }
    if (
      this.state.newTestStepsTable.length <
      this.state.currentTeststepsId + 1
    ) {
      if (this.state.currentTeststepsId < this.state.completeTestCase.length) {
        const lastStep = JSON.parse(
          JSON.stringify(
            this.state.completeTestCase[this.state.currentTeststepsId]
          )
        );
        lastStep["result"] = "running";

        this.setState({
          newTestStepsTable: (this.state.newTestStepsTable = [
            ...this.state.newTestStepsTable,
            lastStep
          ])
        });
      }
      if (prevState.currentTeststepsId !== this.state.currentTeststepsId) {
        const updatedResult = JSON.parse(
          JSON.stringify(this.state.newTestStepsTable)
        );
        if (this.state.currentTeststepsId === 0) {
          updatedResult[this.state.currentTeststepsId][
            "result"
          ] = this.state.currentResult;
          this.setState({
            newTestStepsTable: updatedResult
          });
        } else {
          updatedResult[this.state.currentTeststepsId - 1][
            "result"
          ] = this.state.currentResult;
          this.setState({
            newTestStepsTable: updatedResult
          });
        }
      }
    }
    this.lastRow && this.lastRow.scrollIntoView({ behavior: "smooth" });
  };

  componentWillUnmount = () => {
    this.setState({});
  };

  handleButtonStatus = buttonName => {
    switch (buttonName) {
      case "execute":
        return `ui primary button ${
          this.state.videoReady && !this.props.testCaseExecuting
            ? ""
            : "disabled"
        }`;
      case "stop":
        return `ui button red ${
          this.props.testCaseExecuting ? "" : "disabled"
        }`;
      case "cancel":
        return `ui button ${!this.props.testCaseExecuting ? "" : "disabled"}`;
    }
  };

  renderTableColumns = () => {
    if (this.state.completeTestCase.length === 0) return;

    return this.state.newTestStepsTable.map(step => {
      var statusIconClass = "";
      switch (step.result) {
        case "running":
          statusIconClass = "hourglass";
          break;
        case "Pass":
          statusIconClass = "greenTick";
          break;
        case "Fail":
          statusIconClass = "redCross";
          break;
        default:
          break;
      }

      const stepOrder =
        step.order === this.state.currentTeststepsId + 1 ? (
          <div
            className="anchorDiv"
            ref={el => {
              this.lastRow = el;
            }}
          >
            <div className="textDiv"> {step.order}</div>
          </div>
        ) : (
          step.order
        );
      return {
        stepId: stepOrder,
        action: step.action,
        expectedBehaviour: step.expectedBehaviour.image ? (
          <i
            className="file image outline icon large pointer_cursor "
            style={{ opacity: "0.9", paddingLeft: "45%" }}
          />
        ) : (
          ""
        ),
        result: <i className={statusIconClass} />,
        delay: step.delay
      };
    });
  };

  updateResult = result => {};

  runTestCase = async () => {
    await this.setState({
      stopClicked: false,
      currentTeststepsId: 0,
      newTestStepsTable: [],
      currentResult: "running"
    });
    this.startPlayback();
    if (!this.props.testCaseExecuting) this.props.startTestCaseExecution();

    if (this.state.currentTeststepsId === 0) {
      for (var i in [0, 0])
        await this.props.executeStep("home", { image: "" }, 1);
    }

    for (var step in this.state.completeTestCase) {
      if (!this.props.testCaseExecuting || this.state.stopClicked) return;
      this.child.syncPlayer();

      const result = (await this.props.executeStep(
        remoteControlButtonMapping(
          this.state.completeTestCase[this.state.currentTeststepsId]["action"]
        ),
        this.state.completeTestCase[this.state.currentTeststepsId][
          "expectedBehaviour"
        ],
        this.state.completeTestCase[this.state.currentTeststepsId]["delay"]
      ))
        ? "Pass"
        : "Fail";

      if (!this.props.testCaseExecuting || this.state.stopClicked) return;
      this.setState({
        currentResult: result,
        currentTeststepsId: this.state.currentTeststepsId + 1
      });
      // }
    }
    this.props.stopTestCaseExecution();
  };

  render = () => {
    return (
      <div
        className="mainPanel"
        style={{
          width: "80%",
          height: "70%",
          left: "10%",
          top: "10%",
          borderRadius: "10px"
        }}
        onClick={e => e.stopPropagation()}
      >
        <VideoComponent
          style={{ position: "absolute", left: "56%", top: "10%" }}
          onRef={ref => (this.child = ref)}
          streamURL={`http://${streamIp}:${streamPort}/live/${streamCode}.flv`}
          description={`TTV feed for the execution of ${this.props.testCase}`}
          hidden={false}
          cameraButton={false}
          videoCanPlay={() => {
            this.setState({ videoReady: true });
          }}
        />

        <div className="testCaseExecuteTableContainer">
          <ReactTable
            data={this.renderTableColumns()}
            showPagination={false}
            columns={[
              {
                columns: [
                  {
                    Header: "Step",
                    accessor: "stepId"
                  },
                  {
                    Header: "Action",
                    accessor: "action",
                    Cell: props => (
                      <RemoteControlPopup
                        action={props.original.action}
                        stepId={props.original.stepId}
                        onClick={() => {}}
                      />
                    )
                  },
                  {
                    Header: "Expected Behaviour",
                    accessor: "expectedBehaviour"
                  },
                  {
                    Header: "Result",
                    accessor: "result"
                  },
                  {
                    Header: "Delay",
                    accessor: "delay"
                  }
                ]
              }
            ]}
            defaultPageSize={
              this.props.table.length >= 10 ? this.props.table.length : 10
            }
            className="-striped -highlight testCaseExecuteTable"
          />

          <div
            className="ui message"
            style={{
              width: `${videoDimensions.width * 2}px`,
              bottom: "20px",
              margin: "0px",
              width: "190%",
              position: "absolute"
            }}
          >
            <button
              className={this.handleButtonStatus("execute")}
              onClick={this.runTestCase}
            >
              Execute Test Case
            </button>
            <button
              className={this.handleButtonStatus("stop")}
              onClick={() => {
                this.props.stopTestCaseExecution();
                this.setState({ stopClicked: true });
              }}
            >
              Stop Execution
            </button>

            <button
              className={this.handleButtonStatus("cancel")}
              onClick={() => {
                this.props.closeTestExecuteOverlay();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    table: state.table.table,
    testCaseExecution: state.testCaseExecution,
    testCaseExecuting: state.testCaseExecution.testCaseExecuting,
    stepDone: state.testCaseExecution.stepDone
  };
};

export default connect(
  mapStateToProps,
  {
    pressTtvKey,
    startTestCaseExecution,
    stopTestCaseExecution,
    closeTestExecuteOverlay,
    executeStep
  }
)(TestCaseExecute);
