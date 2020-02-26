import React, { Component } from "react";
import TestCaseSelectionTree from "./TestCaseSelectionTree";
import SelectedTestCasesList from "./SelectedTestCasesList";
import DockerList from "./DockerList";
import "../styling/App.css";
import "../styling/testCaseSelectionPage.css";

class TestCaseSelectionPage extends Component {
  render() {
    return (
      <div className="mainDiv">
        <div className="topBox" />
        <div className="firstFourth">
          <DockerList />
        </div>
        <div className="secondFourth">
          <TestCaseSelectionTree />
        </div>
        <div className="thirdFourth">
          <SelectedTestCasesList />
        </div>
      </div>
    );
  }
}

export default TestCaseSelectionPage;
