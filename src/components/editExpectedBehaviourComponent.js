import React, { Component } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "../styling/expectedBehaviour.css";

import { videoDimensions } from "../configs.js";

export default class EditExpectedBehaviourComponent extends Component {
  state = {
    selection: { top: 0, left: 0, width: 0, height: 0 },
    changed: false
  };
  _crop = event => {
    const { top, left, width, height } = this.refs.cropper.cropper.cropBoxData;
    console.log(this.state);
    if (this.state.changed === false) {
      if (
        JSON.stringify(this.state.selection) !==
        JSON.stringify({ top, left, width, height })
      ) {
        this.setState({
          changed: true
        });
        this.handleChange();
      }
    }
  };

  componentDidMount = () => {
    const { top, left, width, height } = this.props.selection;
    this.setState({
      selection: {
        top,
        left,
        width,
        height
      }
    });
  };

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
      width: videoDimensions.width * 2,
      height: videoDimensions.height * 2
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
            data={{
              x: this.props.selection.left,
              y: this.props.selection.top,
              width: this.props.selection.width,
              height: this.props.selection.height
            }}
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
