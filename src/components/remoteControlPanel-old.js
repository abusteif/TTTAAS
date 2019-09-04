import React, { Component } from "react";
import { connect } from "react-redux";
import { updateTestCaseTable, selectStep, clickAction } from "../actions/table";
import _ from "lodash";
import "../styling/remoteControlPanel.css";

class RemoteControlPanel extends Component {
  render() {
    return (
      <div
        className="mainPanel"
        onClick={e => e.stopPropagation()}
        style={
          this.props.top && {
            top: this.props.top - 120,
            left: this.props.left + 150
          }
        }
      >
        <div
          className="BB homeB controlB largeControlB"
          onClick={() => this.handleOnClick(this.props.selectedStep, "home")}
        />
        <div
          className="BB backB controlB largeControlB"
          onClick={() => this.handleOnClick(this.props.selectedStep, "back")}
        />
        <div
          className="BB arrowB upB interior"
          onClick={() => this.handleOnClick(this.props.selectedStep, "up")}
        />
        <div
          className="BB arrowB leftB interior"
          onClick={() => this.handleOnClick(this.props.selectedStep, "left")}
        />
        <div
          className="BB arrowB rightB interior"
          onClick={() => this.handleOnClick(this.props.selectedStep, "right")}
        />
        <div
          className="BB arrowB downB interior"
          onClick={() => this.handleOnClick(this.props.selectedStep, "down")}
        />
        <div
          className="BB arrowB okB"
          onClick={() => this.handleOnClick(this.props.selectedStep, "ok")}
        >
          OK
        </div>
        <div
          className="BB undoB controlB largeControlB"
          onClick={() => this.handleOnClick(this.props.selectedStep, "undo")}
        />
        <div
          className="BB starB controlB largeControlB"
          onClick={() => this.handleOnClick(this.props.selectedStep, "star")}
        />
      </div>
    );
  }

  handleOnClick = (stepOrder, newAction) => {
    const newTable = [...this.props.table];
    const index = _.findIndex(newTable, { order: stepOrder });
    newTable.splice(index, 1, { ...newTable[index], action: newAction });
    this.props.clickAction(null);
    this.props.updateTestCaseTable(newTable);
  };
}

const mapStateToProps = state => {
  return {
    selectedStep: state.table.selectedStep,
    table: state.table.table
  };
};

export default connect(
  mapStateToProps,
  { updateTestCaseTable, selectStep, clickAction }
)(RemoteControlPanel);
