import React, { Component } from "react";
import { connect } from "react-redux";
import "../styling/remoteControlPanel.css";
import "../styling/remoteIcon.css";
import "../styling/tableButtons.css";

const button = {
  home: " TBB TBhomeB controlB largeControlB",
  back: "TBB TBbackB controlB largeControlB",
  up: "TBB TBupB arrowB largeControlB",
  down: "TBB TBdownB arrowB largeControlB",
  right: "TBB TBrightB arrowB largeControlB",
  left: "TBB TBleftB arrowB largeControlB",
  ok: "TBB TBokB arrowB largeControlB",
  star: "TBB TBstarB controlB largeControlB",
  undo: "TBB TBundoB controlB largeControlB"
};

class RemoteControlPopup extends Component {
  getPanelClass = () => {
    var panelClass = "";
    if (this.props.stepId == this.props.actionClicked) {
      if (this.props.action === "default") {
        panelClass = "_mainPanelHighlighted ";
      } else {
        panelClass = "TBmainPanelHighlighted TBenlargedButton ";
      }
    }
    if (this.props.action !== "default")
      panelClass = button[this.props.action].includes("control")
        ? panelClass + "TBmainPanelControlB"
        : panelClass + "TBmainPanelArrowB";

    return panelClass;
  };

  getPanelStyle = () => {
    return this.props.stepId === this.props.actionClicked
      ? { transform: "scale(1.2)" }
      : {};
  };

  render() {
    return <div>{this.actionToIconMapping()}</div>;
  }

  actionToIconMapping = () => {
    if (this.props.action === "default")
      return (
        <div
          className={`_mainPanel ${this.getPanelClass()}`}
          style={this.getPanelStyle()}
          onClick={this.props.onClick}
        >
          <div className="_button _backButton" />
          <div className="_button _homeButton" />
          <div className="_button _upButton" />
          <div className="_button _leftButton" />
          <div className="_button _rightButton" />
          <div className="_button _downButton" />
          <div className="_button _okButton" />

          <div className="_button _starButton" />
          <div className="_button _undoButton" />
          <div className="_button _button1" />
          <div className="_button _button2" />
        </div>
      );
    else {
      return (
        <div
          className={this.getPanelClass()}
          style={this.getPanelStyle()}
          onClick={this.props.onClick}
        >
          <div className={button[this.props.action]}>
            {this.props.action === "ok" ? "OK" : ""}
          </div>
        </div>
      );
    }
  };
}

const mapStateToProps = state => {
  return {
    actionClicked: state.table.actionClicked
  };
};

export default connect(mapStateToProps)(RemoteControlPopup);
