import React, { Component } from "react";
import { Link } from "react-router-dom";
import history from "../history";

import { connect } from "react-redux";
import {
  removeFromSelectedTestSuite,
  updateIntialSelectedTestCaseList,
  updateSelectedTestSuite
} from "../actions/selectedTestCasesList";
import { getTestCaseStepsFromApi } from "../actions/table";
import { updateDocker } from "../actions/dockerList";
const _ = require("lodash");

const testCaseList = [
  {
    type: "test_suite",
    id: "testSuite1",
    parentId: null,
    name: "test_suite1",
    testCases: [
      {
        type: "test_case",
        id: "testCase11",
        parentId: "testSuite1",
        name: "test_case1"
      },
      {
        type: "test_case",
        id: "testCase12",
        parentId: "testSuite1",
        name: "test_case2"
      },
      {
        type: "test_case",
        id: "testCase13",
        parentId: "testSuite1",
        name: "test_case3"
      }
    ]
  },

  {
    type: "test_suite",
    id: "testSuite2",
    parentId: null,
    name: "test_suite2",

    testCases: [
      {
        type: "test_case",
        id: "testCase21",
        name: "test_case1",

        parentId: "testSuite2"
      },
      {
        type: "test_case",
        id: "testCase22",
        name: "test_case2",

        parentId: "testSuite2"
      },
      {
        type: "test_case",
        id: "testCase23",
        name: "test_case3",

        parentId: "testSuite2"
      }
    ]
  },
  {
    type: "test_suite",
    id: "testSuite3",
    name: "test_suite3",

    parentId: null,
    testCases: [
      {
        type: "test_case",
        id: "testCase31",
        name: "test_case3",

        parentId: "testSuite3"
      }
    ]
  }
];

class SelectedTestCasesList extends Component {
  handleButtonClick = buttonName => {
    switch (buttonName) {
      case "save":
        const payload = {
          ...this.props.selectedDocker,
          testCaseList: this.props.selectedTestCaseList
        };
        this.props.updateIntialSelectedTestCaseList(
          this.props.selectedTestCaseList
        );
        this.props.updateDocker(this.props.selectedDocker.id, payload);
        break;

      case "discard":
        this.props.updateSelectedTestSuite(
          this.props.initialSelectedTestCaseList
        );
    }
  };

  handleButtonStatus = button => {
    switch (button) {
      case "save":
        console.log(
          _.isEqual(
            this.props.initialSelectedTestCaseList,
            this.props.selectedTestCaseList
          )
        );

        return _.isEqual(
          this.props.initialSelectedTestCaseList,
          this.props.selectedTestCaseList
        )
          ? "disabled"
          : "";

      case "discard":
        return _.isEqual(
          this.props.initialSelectedTestCaseList,
          this.props.selectedTestCaseList
        )
          ? "disabled"
          : "";
    }
  };

  handleRemoveClick = (type, element) => {
    switch (type) {
      case "test_case":
        if (element.testSuite.testCases.length === 1) {
          this.props.removeFromSelectedTestSuite(
            {
              ...element.testSuite
            },
            "test_suite"
          );
          return;
        }

        this.props.removeFromSelectedTestSuite(
          {
            ...element.testSuite,
            testCases: element.testCase
          },
          "test_case"
        );
        break;

      case "test_suite":
        this.props.removeFromSelectedTestSuite(
          {
            ...element.testSuite
          },
          "test_suite"
        );
        break;

      default:
        return;
    }
  };

  handleEditClick = async id => {
    await this.props.getTestCaseStepsFromApi(id);
    history.push("/");
  };

  renderRows = () => {
    return this.props.selectedTestCaseList.map(testSuite => {
      return (
        <div key={testSuite.name}>
          <div className="list-group-item list-group-item-action active">
            <i
              className="trash icon pointer_cursor"
              style={{ float: "right" }}
              onClick={e => {
                e.stopPropagation();
                this.handleRemoveClick("test_suite", {
                  testSuite
                });
              }}
            ></i>
            {testSuite.name}
          </div>

          {testSuite.testCases.map(testCase => {
            return (
              <div
                className="list-group-item list-group-item-action"
                key={testCase.name}
              >
                {testCase.name}
                <i
                  className="trash icon pointer_cursor "
                  style={{ float: "right" }}
                  onClick={() => {
                    this.handleRemoveClick("test_case", {
                      testCase,
                      testSuite
                    });
                  }}
                ></i>
                <i
                  className="edit icon black pointer_cursor"
                  style={{ float: "right" }}
                  onClick={e => {
                    e.stopPropagation();
                    this.handleEditClick(testCase.id);
                  }}
                ></i>
              </div>
            );
          })}
        </div>
      );
    });
  };

  render() {
    if (
      Object.keys(this.props.selectedDocker).length === 0 ||
      this.props.selectedTestCaseList.length === 0
    )
      return <div />;
    return (
      <div style={{ height: "100%" }}>
        <div className="headerStyling">
          <i
            className="fab fa-docker"
            style={{
              fontSize: "30px",
              color: "rgba(0,0,0,0.5)",
              paddingRight: "10px"
            }}
          />
          {this.props.selectedDocker.name}
        </div>
        <div className="card" style={{ height: "85%" }}>
          <div className="card-body" style={{ height: "100%" }}>
            <div style={{ overflowY: "scroll", height: "100%" }}>
              <div className="list-group">{this.renderRows()}</div>
            </div>
          </div>
        </div>
        <br />
        <button
          onClick={() => {
            this.handleButtonClick("save");
          }}
          className={"ui primary button " + this.handleButtonStatus("save")}
        >
          Save
        </button>
        <button
          className={"ui  button " + this.handleButtonStatus("save")}
          onClick={() => {
            this.handleButtonClick("discard");
          }}
        >
          Discard
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    selectedTestCaseList: state.testCaseSelect.selectedTestCaseList,
    initialSelectedTestCaseList:
      state.testCaseSelect.initialSelectedTestCaseList,
    selectedDocker: state.dockerList.selectedDocker
  };
};

export default connect(
  mapStateToProps,
  {
    removeFromSelectedTestSuite,
    updateDocker,
    updateIntialSelectedTestCaseList,
    updateSelectedTestSuite,
    getTestCaseStepsFromApi
  }
)(SelectedTestCasesList);
