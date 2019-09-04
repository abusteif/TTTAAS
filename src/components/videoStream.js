import React, { Component } from "react";
import { connect } from "react-redux";
import {
  showVideoStream,
  playbackStarted,
  showPicture,
  updatePictureTaken
} from "../actions/videoStream";
import { updatePreview, selectStep } from "../actions/table";

import VideoComponent from "./videoComponent";
import RemoteControlPanel from "./remoteControlPanel";

import "../styling/videoStream.css";
import "../styling/expectedBehaviour.css";

const streamCode = "testStream";
const ip = "192.168.42.245";
const port = "8000";

class VideoStream extends Component {
  screenShotHandler = dataURI => {
    console.log(dataURI);
  };

  render = () => {
    return (
      <div>
        {this.props.showTakenPicture && (
          <img className="screenshot" src={this.props.pictureTaken} />
        )}
        {this.props.showTakenPicture && (
          <div
            className="ui message"
            style={{ position: "absolute", width: "640px", top: "480px" }}
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
            return !this.props.showStream ? { display: "none" } : null;
          })()}
        >
          <VideoComponent
            streamURL={`http://${ip}:${port}/live/${streamCode}.flv`}
            screenshotHandler={newPic => {
              this.props.updatePictureTaken(newPic);
              this.props.showVideoStream(false);
              this.props.showPicture(true);
            }}
            hidden={!this.props.showStream || this.props.showTakenPicture}
            playbackHandler={this.props.playbackStarted}
          />

          <RemoteControlPanel
            style={{ position: "absolute" }}
            clickHandler={() => console.log("ok")}
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
    pictureTaken: state.videoStream.picture
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
    updatePictureTaken
  }
)(VideoStream);
