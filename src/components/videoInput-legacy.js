import React, { Component } from "react";
import captureVideoFrame from "capture-video-frame";

export default class VideoInput extends Component {
  constructor(props) {
    super(props);
    this.state = { image: null };
    this.videoTag = React.createRef();
  }

  componentDidMount = () => {
    // getting access to webcam
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(stream => (this.videoTag.current.srcObject = stream))
      .catch(console.log);
  };

  render() {
    return (
      <div>
        <video
          id="testStream"
          ref={this.videoTag}
          autoPlay
          onClick={() => {
            const frame = captureVideoFrame("testStream", "jpeg", 1);
            this.setState({ image: frame.dataUri });
          }}
        />
        <img src={this.state.image} width="640px" />
      </div>
    );
  }
}
