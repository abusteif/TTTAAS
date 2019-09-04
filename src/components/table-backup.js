import React, { Component } from "react";
import "../styling/table.css";
import { connect } from "react-redux";
import { updateTestCaseTable, selectStep, clickAction } from "../actions/table";
import { testCases } from "../static/mockData";
import RemoteControlPopup from "./remoteControlPopup";
import "../styling/remoteIcon.css";
import RemoteControlModal from "./remoteControlModal";
import ReactDOM from "react-dom";

class TestCaseTable extends Component {
  renderRows() {
    return this.props.table.map(step => {
      return (
        <tr
          id={`step${step.order}`}
          key={step.order}
          onClick={() => {
            this.handleStepSelect(step.order);
          }}
        >
          <th scope="row">{step.order}</th>
          <td>
            <RemoteControlPopup
              action={step.action}
              stepId={step.order}
              onClick={() => {
                this.handleActionClicked(step.order);
              }}
            />
          </td>
          <td>{step.expectedBehaviour}</td>
          <td>{step.delay}</td>

          <td className="pt-3-half">
            {step.order != 1 && (
              <span
                className="table-up"
                onClick={() => this.handleUpButtonClick(step.order)}
              >
                <a href="#!" className="indigo-text">
                  <i className="fas fa-long-arrow-alt-up" aria-hidden="true" />
                </a>
              </span>
            )}
            {step.order != this.props.table.length && (
              <span
                className="table-down"
                onClick={() => this.handleDownButtonClick(step.order)}
              >
                <a href="#!" className="indigo-text">
                  <i
                    className="fas fa-long-arrow-alt-down"
                    aria-hidden="true"
                  />
                </a>
              </span>
            )}
            <i
              className="trash icon pointer_cursor large "
              style={{ opacity: "0.8" }}
            >
              {" "}
            </i>
            <i
              className="copy icon pointer_cursor large"
              style={{ opacity: "0.8" }}
            >
              {" "}
            </i>
          </td>
        </tr>
      );
    });
  }

  handleStepSelect = step => {
    const stepCoords = this.getStepCoords(step);
    this.props.selectStep(step, stepCoords);
  };

  handleActionClicked = step => {
    this.props.clickAction(step);
  };

  handleAddStep = () => {
    const stepNumber = this.props.table.length + 1;
    // if (this.props.table[this.props.table.length-1].action === "default")
    //   return
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
    const newTable = [...this.props.table];
    newTable.splice(stepId - 1, 1);
    for (let i = 0; i < newTable.length; i++) {
      newTable[i].order = i + 1;
    }
    console.log(newTable);
    this.props.updateTestCaseTable(newTable);
  };

  handleUpButtonClick = stepId => {
    const newTable = [...this.props.table];
    const tempRow = newTable[stepId - 1];
    newTable[stepId - 1] = newTable[stepId - 2];
    newTable[stepId - 2] = tempRow;
    newTable[stepId - 1].order = stepId;
    newTable[stepId - 2].order = stepId - 1;
    this.props.updateTestCaseTable(newTable);
  };

  handleDownButtonClick = stepId => {
    const newTable = [...this.props.table];
    const tempRow = newTable[stepId - 1];
    newTable[stepId - 1] = newTable[stepId];
    newTable[stepId] = tempRow;
    newTable[stepId - 1].order = stepId;
    newTable[stepId].order = stepId + 1;
    this.props.updateTestCaseTable(newTable);
  };

  getStepCoords = stepId => {
    return ReactDOM.findDOMNode(this)
      .querySelector(`#step${stepId}`)
      .getBoundingClientRect();
  };

  render() {
    const titleText = this.props.selectedNode.title
      ? this.props.selectedNode.title
      : "Please select a test case";
    if (this.props.selectedNode.title)
      return (
        <div>
          <div className="headerStyling">
            <i
              className="fa fa-file-text"
              style={{
                fontSize: "30px",
                color: "rgba(0,0,0,0.5)",
                paddingRight: "10px"
              }}
            />
            {titleText}
          </div>

          <div className="card">
            <div className="card-body">
              <div id="table" className="table-editable">
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
                  <tbody>{this.renderRows()}</tbody>
                </table>
                <span className="table-add float-left mb-3 mr-2">
                  <a href="#!" className="text-success">
                    <i
                      className="fas fa-plus fa-2x"
                      aria-hidden="true"
                      onClick={this.handleAddStep}
                    />
                    {this.props.actionClicked && <RemoteControlModal />}
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    else return <div />;
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    treeData: state.tree.tree,
    selectedNode: state.tree.selectedNode,
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
