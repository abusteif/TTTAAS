import React, { Component } from "react";
import { connect } from "react-redux";
import {
  showVideoStream,
  playbackStarted,
  showPicture,
  updatePictureTaken,
  updateVideoSyncFunc
} from "../actions/videoStream";
import { updatePreview, selectStep } from "../actions/table";
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
import { appIp } from "../configs.js";

const streamCode = "teststream";
const ip = appIp;
const port = "8000";

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class TestCaseExecute extends Component {
  componentDidMount = () => {
    // this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    this.startPlayback = this.child.startPlayback;
  };

  renderTable = () => {};
  //   render = () => {
  //     return (
  //       <div>
  //         <div
  //           style={
  //             {
  //               // overflowY: "scroll",
  //               // height: "95%",
  //               // position: "absolute",
  //               // color: "white",
  //               // backgroundColor: "white",
  //               // width: "20%",
  //               // height: "20%",
  //               // left: "20%"
  //             }
  //           }
  //         >
  //           {this.renderReactTable()}
  //           <div
  //             style={{ float: "left", clear: "both" }}
  //             ref={el => {
  //               this.messagesEnd = el;
  //             }}
  //           ></div>
  //         </div>
  //         <VideoComponent
  //           style={{ position: "absolute", top: "10%", left: "70%" }}
  //           onRef={ref => (this.child = ref)}
  //           streamURL={`http://${ip}:${port}/live/${streamCode}.flv`}
  //         />
  //       </div>
  //     );
  //   };
  // }

  renderTableColumns = () => {
    return this.props.table.map(step => {
      return {
        stepId: step.order,
        action: step.action,
        expectedBehaviour: step.expectedBehaviour.image ? "picture" : "-",
        result: "pass"
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
          streamURL={`http://${ip}:${port}/live/${streamCode}.flv`}
          description={`TTV feed for the execution of ${this.props.testCase}`}
          hidden={false}
          playbackHandler={this.props.playbackStarted}
          cameraButton={false}
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
                      // <div
                      //   style={{
                      //     height: "30px",
                      //     width: "30px",
                      //     backgroundColor: "green",
                      //     color: "red"
                      //   }}
                      // >
                      //   testing
                      // </div>
                    )
                  },
                  {
                    Header: "Expected Behaviour",
                    accessor: "expectedBehaviour"
                  },
                  {
                    Header: "Result",
                    accessor: "result"
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
              className={"ui primary button"}
              onClick={() => {
                this.startPlayback();
              }}
            >
              Execute Test Case
            </button>
            <button
              className="ui button red"
              onClick={() => {
                this.props.stopTestCaseExecution();
              }}
            >
              Stop Execution
            </button>

            <button
              className="ui button"
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
    table: state.table.table
  };
};

export default connect(
  mapStateToProps,
  {
    showVideoStream,
    playbackStarted,
    updatePreview,
    selectStep,
    showPicture,
    updatePictureTaken,
    updateVideoSyncFunc,
    pressTtvKey,
    startTestCaseExecution,
    stopTestCaseExecution,
    closeTestExecuteOverlay
  }
)(TestCaseExecute);
