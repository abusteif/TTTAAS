import React, { Component } from "react";
import Tree from "./testCaseCreationTree";
import TestCaseTable from "./table";
import VideoStream from "./videoStream";
import "../styling/App.css";

class CreateTestCasePage extends Component {
  render() {
    return (
      <div className="mainDiv">
        <div className="topBox" />
        <div className="firstThird">
          <Tree />
        </div>
        <div className="secondThird">
          <TestCaseTable />
        </div>
        <div className="thirdThird">
          <VideoStream />
        </div>
      </div>
    );
  }
}

export default CreateTestCasePage;
