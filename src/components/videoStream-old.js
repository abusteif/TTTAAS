import React, { Component } from "react";
import { connect } from "react-redux";
import { showVideoStream } from "../actions/videoStream";
import flv from "flv.js";
import captureVideoFrame from "capture-video-frame";
import "../styling/videoStream.css";

class VideoStream extends Component {
  constructor(props) {
    super(props);
    this.streamCode = "testStream";
    this.myIp = "192.168.42.245";
    this.state = {
      image: null,
      playbackStarted: false,
      counter: 15,
      canPlay: false
    };
    this.videoRef = React.createRef();
  }

  componentDidMount = () => {
    this.buildPlayer();
    this.videoRef.current.addEventListener("canplay", () => {
      this.setState({ canPlay: true });
    });
  };

  componentDidUpdate = () => {
    console.log("update");
    this.buildPlayer();
    console.log(this.videoRef.current.readyState);
  };

  componentWillUnmount = () => {
    console.log("unmount");
    this.player.destroy();
  };

  buildPlayer = () => {
    if (this.player) {
      console.log("player exists");
      return;
    }
    this.buildActualPlayer();
  };

  buildActualPlayer = () => {
    console.log("building player");
    this.player = flv.createPlayer({
      type: "flv",
      url: `http://${this.myIp}:8000/live/${this.streamCode}.flv`,
      isLive: true,
      hasAudio: false
    });
    this.player.attachMediaElement(this.videoRef.current);
    this.player.load();
  };

  syncPlayer = () => {
    this.videoRef.current.currentTime =
      this.videoRef.current.seekable.end(0) - 0.1;
  };

  render = () => {
    return (
      <div>
        <div hidden={this.props.videoStream.hidden}>
          <video
            className="videoLayout"
            id="myVideo"
            ref={this.videoRef}
            onPlay={e => {
              this.setState({ playbackStarted: true });
            }}
          />
        </div>
        <div
          className={`ui big loader ${this.state.canPlay ? null : " active"}`}
          style={{
            position: "absolute",
            top: "220px",
            left: "300px"
          }}
        />
        <div
          hidden={this.state.playbackStarted}
          className="playOverlay"
          onClick={e => {
            this.videoRef.current.play();
            this.syncPlayer();
          }}
        >
          {this.state.canPlay && (
            <i
              className="icon play circle outline pointer_cursor playIcon"
              style={{ fontSize: "100px" }}
            />
          )}
        </div>
        <div hidden={this.props.videoStream.hidden} className="refreshButton">
          <i
            style={{
              position: "absolute",
              fontSize: "30px",
              top: "-4px",
              color: "rgba(255,255,255,0.6)"
            }}
            onClick={() => {
              this.player.destroy();
              this.buildActualPlayer();
              this.setState({ playbackStarted: false, canPlay: false });
            }}
            className="sync icon pointer_cursor"
          />
        </div>
        <i
          onClick={() => {
            var frame = captureVideoFrame("myVideo", "png");
            this.setState({ image: frame.dataUri });
            this.props.showVideoStream(true);
          }}
          className="camera icon large pointer_cursor"
        />
        <img src={this.state.image} width="100%" />
      </div>
    );
  };
}

const mapStateToProps = state => {
  return {
    videoStream: state.videoStream
  };
};

export default connect(
  mapStateToProps,
  { showVideoStream }
)(VideoStream);
