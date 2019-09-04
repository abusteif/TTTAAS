import React, { Component } from "react";
import "../styling/table.css";
import _ from "lodash";
import { connect } from "react-redux";
import { updateTestCaseTable, selectStep, clickAction } from "../actions/table";
import { testCases } from "../static/mockData";
import RemoteControlPopup from "./remoteControlPopup";
import "../styling/remoteIcon.css";
import RemoteControlModal from "./remoteControlModal";
import ReactDOM from "react-dom";

class TestCaseTable extends Component {
  renderRows() {
    return (
      <tr>
        <th scope="row">
          <i className="fas fa-bars large" />

          {1}
        </th>

        <td>
          <RemoteControlPopup action="default" stepId={1} />
        </td>
        <td>asdfas</td>
        <td>asddsa</td>

        <td className="pt-3-half">
          <span className="table-up">
            <a href="#!" className="indigo-text">
              <i className="fas fa-long-arrow-alt-up" aria-hidden="true" />
            </a>
          </span>
          <span className="table-down">
            <a href="#!" className="indigo-text">
              <i className="fas fa-long-arrow-alt-down" aria-hidden="true" />
            </a>
          </span>
          <i
            className="trash icon pointer_cursor large "
            style={{ opacity: "0.8" }}
          >
            {" "}
          </i>
          <i
            className="copy icon pointer_cursor large"
            style={{ opacity: "0.8" }}
          />
        </td>
      </tr>
    );
  }

  handleStepSelect = stepId => {
    const stepCoords = this.getStepCoords(stepId);
    this.props.selectStep(stepId, stepCoords);
  };

  handleActionClicked = step => {
    this.props.clickAction(step);
  };

  handleButtonDisplay = stepId => {
    return this.props.table[stepId - 1].action != "default";
  };
  handleAddStep = () => {
    const stepNumber = this.props.table.length + 1;
    if (
      this.props.table.length !== 0 &&
      this.props.table[this.props.table.length - 1].action === "default"
    )
      return;
    this.props.updateTestCaseTable([
      ...this.props.table,
      {
        order: stepNumber,
        action: "default",
        expectedBehaviour: "",
        delay: ""
      }
    ]);
  };

  handleRemoveButton = stepId => {
    const newTable = JSON.parse(JSON.stringify([...this.props.table]));
    newTable.splice(stepId - 1, 1);
    for (let i = 0; i < newTable.length; i++) {
      newTable[i].order = i + 1;
    }
    this.props.updateTestCaseTable(newTable);
  };

  handleUpButtonClick = stepId => {
    const newTable = JSON.parse(JSON.stringify([...this.props.table]));
    const tempRow = newTable[stepId - 1];
    newTable[stepId - 1] = newTable[stepId - 2];
    newTable[stepId - 2] = tempRow;
    newTable[stepId - 1].order = stepId;
    newTable[stepId - 2].order = stepId - 1;
    this.props.updateTestCaseTable(newTable);
  };

  handleDownButtonClick = stepId => {
    const newTable = JSON.parse(JSON.stringify([...this.props.table]));
    const tempRow = newTable[stepId - 1];
    newTable[stepId - 1] = newTable[stepId];
    newTable[stepId] = tempRow;
    newTable[stepId - 1].order = stepId;
    newTable[stepId].order = stepId + 1;
    this.props.updateTestCaseTable(newTable);
  };

  handleDuplicateStep = stepId => {
    const newTable = [];
    for (let i = 0; i < stepId; i++) {
      newTable.push(this.props.table[i]);
    }
    newTable.push({ ...this.props.table[stepId - 1], order: stepId + 1 });
    for (let i = stepId; i < this.props.table.length; i++)
      newTable.push({ ...this.props.table[i], order: i + 2 });
    this.props.updateTestCaseTable(newTable);
  };
  getStepCoords = stepId => {
    return ReactDOM.findDOMNode(this)
      .querySelector(`#step${stepId}`)
      .getBoundingClientRect();
  };

  getButtonStatus = () => {
    return _.isEqual(this.props.table, this.props.initialTable)
      ? "disabled"
      : "";
  };

  handleDiscardClick = () => {
    this.props.updateTestCaseTable([...this.props.initialTable]);
  };

  render() {
    return (
      <div style={{ height: "100%" }}>
        <div className="headerStyling">
          <i
            className="fa fa-file-text"
            style={{
              fontSize: "30px",
              color: "rgba(0,0,0,0.5)",
              paddingRight: "10px"
            }}
          />
          asd
        </div>

        <div className="card" style={{ height: "85%" }}>
          <div className="card-body" style={{ height: "100%" }}>
            <div
              id="table"
              className="table-editable"
              style={{ height: "100%" }}
            >
              <table className="table table-bordered table-responsive-md table-striped text-center">
                <thead>
                  <tr>
                    <th className="text-center" style={{ width: "10%" }}>
                      Step
                    </th>
                    <th className="text-center" style={{ width: "15%" }}>
                      Action
                    </th>
                    <th className="text-center" style={{ width: "30%" }}>
                      Expected Behaviour
                    </th>
                    <th className="text-center" style={{ width: "10%" }}>
                      Delay
                    </th>
                    <th className="text-center">Move</th>
                  </tr>
                </thead>
              </table>
              <div style={{ overflowY: "scroll", height: "95%" }}>
                <table className="table table-bordered table-responsive-md table-striped text-center">
                  <thead>
                    <tr>
                      <th className="text-center" style={{ width: "10.1%" }} />
                      <th className="text-center" style={{ width: "15.2%" }} />
                      <th className="text-center" style={{ width: "30.2%" }} />
                      <th className="text-center" style={{ width: "10.2%" }} />
                      <th className="text-center" style={{ width: "34.3%" }} />
                    </tr>
                  </thead>
                  <tbody>{this.renderRows()}</tbody>
                </table>
                <span className="table-add float-left mb-3 mr-2">
                  <i
                    className="fas fa-plus fa-2x grey"
                    aria-hidden="true"
                    onClick={this.handleAddStep}
                  />
                  {this.props.actionClicked && <RemoteControlModal />}
                </span>
              </div>
              <br />
              <button className={"ui primary button " + this.getButtonStatus()}>
                Save
              </button>
              <button
                className={"ui button " + this.getButtonStatus()}
                onClick={this.handleDiscardClick}
              >
                Discard
              </button>
              <button className={"ui button " + this.getButtonStatus()}>
                Run Test Case
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  // console.log(state);
  return {
    treeData: state.tree.tree,
    selectedNode: state.tree.selectedNode,
    initialTable: state.table.initialTable,
    table: state.table.table,
    selectedStep: state.table.selectedStep,
    selectedStepCoords: state.table.selectedStepCoords,
    actionClicked: state.table.actionClicked
  };
};

export default connect(
  mapStateToProps,
  { updateTestCaseTable, selectStep, clickAction }
)(TestCaseTable);
