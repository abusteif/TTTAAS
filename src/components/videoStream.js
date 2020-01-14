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

import { videoDimensions } from "../configs.js";

import "../styling/expectedBehaviour.css";
import "../styling/videoComponent.css";
import { appIp } from "../configs.js";

const streamCode = "teststream";
const ip = appIp;
const port = "8000";

const sleep = milliseconds => {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
};

class VideoStream extends Component {
  componentDidUpdate = () => {
    this.props.updateVideoSyncFunc(this.child.syncPlayer);
  };

  remoteControlClickHandler = key => {
    var buttonPressed = "";
    switch (key) {
      case "home":
      case "back":
      case "up":
      case "down":
      case "right":
      case "left":
        buttonPressed = key;
        break;
      case "ok":
        buttonPressed = "select";
        break;
      case "undo":
        buttonPressed = "InstantReplay";
        break;
      case "star":
        buttonPressed = "Info";
        break;
      default:
        return;
    }
    this.props.pressTtvKey(buttonPressed);
    sleep(500).then(() => this.props.syncPlayerFunc());
    sleep(500).then(() => this.props.syncPlayerFunc());
  };

  render = () => {
    return (
      <div>
        {this.props.showTakenPicture && (
          <img
            className="screenshot"
            src={this.props.pictureTaken}
            style={{
              width: `${videoDimensions.width}px`,
              height: `${videoDimensions.height}px`
            }}
          />
        )}
        {this.props.showTakenPicture && (
          <div
            className="ui message"
            style={{
              position: "absolute",
              width: `${videoDimensions.width}px`,
              top: `${videoDimensions.height}px`
            }}
          >
            <div className="header">
              Screenshot captured for step {this.props.selectedStep}
            </div>
            <p>Please choose what to do next</p>
            <button
              className="ui primary button"
              onClick={() => {
                this.props.selectStep(null);
                this.props.updatePreview(
                  this.props.cameraClicked,
                  this.props.pictureTaken
                );
                this.props.showPicture(false);
              }}
            >
              Save screenshot
            </button>
            <button
              className="ui button"
              onClick={() => {
                this.props.showPicture(false);
                this.props.updatePictureTaken(null);
                this.props.showVideoStream(true);
              }}
            >
              Re-capture
            </button>
            <button
              className="ui button"
              onClick={() => {
                this.props.showPicture(false);
                this.props.updatePictureTaken(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <div
          style={(() => {
            return !this.props.showStream || !this.props.selectedStep
              ? { display: "none" }
              : null;
          })()}
        >
          <VideoComponent
            onRef={ref => (this.child = ref)}
            streamURL={`http://${ip}:${port}/live/${streamCode}.flv`}
            description={`TTV feed for Step ${this.props.selectedStep}`}
            screenshotHandler={newPic => {
              this.props.updatePictureTaken(newPic);
              this.props.showVideoStream(false);
              this.props.showPicture(true);
            }}
            hidden={!this.props.showStream || this.props.showTakenPicture}
            playbackHandler={this.props.playbackStarted}
            cameraButton={true}
          />

          <RemoteControlPanel
            style={{ position: "absolute" }}
            clickHandler={button => this.remoteControlClickHandler(button)}
            top={videoDimensions.height + 290}
          />
        </div>
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    cameraClicked: state.table.cameraClicked,
    selectedStep: state.table.selectedStep,
    showStream: state.videoStream.showStream,
    showTakenPicture: state.videoStream.showTakenPicture,
    pictureTaken: state.videoStream.picture,
    syncPlayerFunc: state.videoStream.syncPlayerFunc
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
    pressTtvKey
  }
)(VideoStream);
