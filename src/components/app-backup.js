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
          <ReactPlayer
            ref={player => {
              this.player = player;
            }}
            url="http://localhost:8000/live/testStream/index.mpd"
            playing
            onClick={() => {
              const frame = captureVideoFrame(this.player.getInternalPlayer());
              console.log("captured frame", frame);
              this.setState({ image: frame.dataUri });
            }}
          />
          <img src={this.state.image} width="320px" />;
        </div>
      </div>
    );
  }
}

export default App;

// ffmpeg -fflags nobuffer -f dshow -i video="Logitech HD Webcam C525" -c:v libx264 -preset superfast -tune zerolatency -c:a aac -f flv rtmp://localhost/live/testStream
