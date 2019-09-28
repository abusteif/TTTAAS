import React, { Component } from "react";
import "../styling/remoteControlPanel.css";

export default class RemoteControlPanel extends Component {
  render() {
    return (
      <div
        className="mainPanel"
        onClick={e => e.stopPropagation()}
        style={
          this.props.top && {
            top: this.props.top - 120,
            left: this.props.left && this.props.left + 150
          }
        }
      >
        <div
          className="BB homeB controlB largeControlB"
          onClick={() => this.props.clickHandler("home")}
        />
        <div
          className="BB backB controlB largeControlB"
          onClick={() => this.props.clickHandler("back")}
        />
        <div
          className="BB arrowB upB interior"
          onClick={() => this.props.clickHandler("up")}
        />
        <div
          className="BB arrowB leftB interior"
          onClick={() => this.props.clickHandler("left")}
        />
        <div
          className="BB arrowB rightB interior"
          onClick={() => this.props.clickHandler("right")}
        />
        <div
          className="BB arrowB downB interior"
          onClick={() => this.props.clickHandler("down")}
        />
        <div
          className="BB arrowB okB"
          onClick={() => this.props.clickHandler("ok")}
        >
          OK
        </div>
        <div
          className="BB undoB controlB largeControlB"
          onClick={() => this.props.clickHandler("undo")}
        />
        <div
          className="BB starB controlB largeControlB"
          onClick={() => this.props.clickHandler("star")}
        />
      </div>
    );
  }
}
