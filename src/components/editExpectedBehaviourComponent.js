import React, { Component } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "../styling/expectedBehaviour.css";

import { videoDimensions, videoScaling } from "../configs.js";

export default class EditExpectedBehaviourComponent extends Component {
  state = {
    changed: false
  };
  defaultSelection = {
    x: videoDimensions.width * 0.2,
    y: videoDimensions.height * 0.2,
    width: videoDimensions.width * 1.6,
    height: videoDimensions.height * 1.6,
    rotate: 0,
    scaleX: 1,
    scaleY: 1
  };
  _crop = event => {
    console.log("current selection", event.detail);
    console.log("default selection ", this.defaultSelection);
    const { top, left, width, height } = this.refs.cropper.cropper.cropBoxData;
    console.log("state", this.state);
    if (JSON.stringify(event.detail) === JSON.stringify(this.defaultSelection))
      return;
    if (this.state.changed === false) {
      if (
        JSON.stringify(this.props.selection) !==
        JSON.stringify({ top, left, width, height })
      ) {
        this.setState({
          changed: true
        });
        this.handleChange();
      }
    }
  };

  componentWillUnmount = () => {
    console.log("unmounting...........");
    this.setState({ changed: false });
  };
  componentDidMount = () => {
    console.log("MOUNTEDDDDDD");
    const { top, left, width, height } = this.props.selection;
    const selectionCheck = setInterval(() => {
      if (
        this.refs.cropper &&
        this.refs.cropper.cropper &&
        this.refs.cropper.cropper.cropBoxData
      ) {
        this.refs.cropper.cropper.setCropBoxData(this.props.selection);
        console.log(this.props.selection);
        clearInterval(selectionCheck);
        console.log(this.refs.cropper.cropper.cropBoxData);
      } else {
        console.log("*********");
      }
    }, 10);
  };

  setInitialSelection = () => {};

  handleChange = baseClassName => {
    if (!this.state.changed) {
      return baseClassName + " disabled";
    } else {
      this.props.handleChange();

      return baseClassName;
    }
  };

  handleSaveButtonClick = () => {
    if (!this.state.changed) return;
    this.props.saveButtonHandler(this.refs.cropper.cropper.cropBoxData);
  };

  handleSelectAllButton = () => {
    this.refs.cropper.cropper.setData({
      x: 0,
      y: 0,
      width: videoDimensions.width / videoScaling,
      height: videoDimensions.height / videoScaling
    });
  };
  handleCancelButtonClick = () => {
    this.props.cancelButtonHandler();
  };

  render = () => {
    return (
      <div
        style={{
          display: "table-cell",
          verticalAlign: "middle",
          textAlign: "center",
          margin: "0 auto"
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            display: "inline-block",
            width: `${videoDimensions.width * 2}px`,
            borderRadius: "1%"
          }}
        >
          <Cropper
            ref="cropper"
            src={this.props.image}
            crop={this._crop}
            zoomable={false}
            viewMode={1}
            style={{ height: `${videoDimensions.height * 2}px` }}
          />

          <div
            className="ui message"
            style={{
              width: `${videoDimensions.width * 2}px`,
              bottom: "0px",
              margin: "0px"
            }}
          >
            <button
              className={this.handleChange("ui primary button")}
              onClick={this.handleSaveButtonClick}
            >
              Save selection
            </button>
            <button className="ui button" onClick={this.handleSelectAllButton}>
              Select all
            </button>

            <button
              className="ui button"
              onClick={this.handleCancelButtonClick}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };
}
