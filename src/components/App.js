import React, { Component } from "react";
import Tree from "./tree";
import TestCaseTable from "./table";
import StreamForm from "./formExperiment";
import HomeButton from "./homeButton";
import VideoStream from "./videoStream";
import captureVideoFrame from "capture-video-frame";
import "../styling/App.css";

import ReactPlayer from "react-player";
class App extends Component {
  state = { image: null };

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

export default App;
