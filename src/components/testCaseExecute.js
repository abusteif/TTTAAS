import React, { Component } from "react";
import { connect } from "react-redux";
import { pressTtvKey } from "../actions/ttvControl";
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

class TestCaseExecute extends Component {
  state = {
    completeTestCase: [],
    currentTeststepsId: 0,
    videoReady: false
  };
  componentDidMount = () => {
    this.startPlayback = this.child.startPlayback;
    this.setState({
      completeTestCase: this.props.table
    });
  };

  componentDidUpdate = () => {
    this.lastRow.scrollIntoView({ behavior: "smooth" });
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

  executeTestCase = () => {};

  renderTableColumns = () => {
    if (this.state.completeTestCase.length === 0) return;
    const lastStep = JSON.parse(
      JSON.stringify(this.state.completeTestCase[this.state.currentTeststepsId])
    );
    lastStep["order"] = (
      <div
        className="anchorDiv"
        ref={el => {
          this.lastRow = el;
        }}
      >
        <div className="textDiv"> {lastStep.order}</div>
      </div>
    );
    const extendedTestSteps = [
      ...this.state.completeTestCase.slice(0, this.state.currentTeststepsId),
      lastStep
    ];
    return extendedTestSteps.map(step => {
      return {
        stepId: step.order,
        action: step.action,
        expectedBehaviour: step.expectedBehaviour.image ? (
          <i
            className="file image outline icon large pointer_cursor "
            style={{ opacity: "0.9", paddingLeft: "45%" }}
          />
        ) : (
          ""
        ),
        result: "pass",
        delay: step.delay
      };
    });
  };

  render = () => {
    const data = [
      {
        stepId: "1",
        action: "ok",
        expectedBehaviour: "picture",
        result: "pass"
      }
    ];

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
            defaultPageSize={this.props.table.length}
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
              onClick={() => {
                this.startPlayback();
                if (!this.props.testCaseExecuting)
                  this.props.startTestCaseExecution();
                if (
                  this.state.currentTeststepsId <
                  this.state.completeTestCase.length
                )
                  this.setState({
                    currentTeststepsId: this.state.currentTeststepsId + 1
                  });
              }}
            >
              Execute Test Case
            </button>
            <button
              className={this.handleButtonStatus("stop")}
              onClick={() => {
                this.props.stopTestCaseExecution();
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
    testCaseExecuting: state.testCaseExecution.testCaseExecuting
  };
};

export default connect(
  mapStateToProps,
  {
    pressTtvKey,
    startTestCaseExecution,
    stopTestCaseExecution,
    closeTestExecuteOverlay
  }
)(TestCaseExecute);
