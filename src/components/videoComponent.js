import React, { Component } from "react";
import flv from "flv.js";
import captureVideoFrame from "capture-video-frame";
import "../styling/videoComponent.css";

export default class VideoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playbackStarted: false,
      hidden: true,
      counter: 15,
      canPlay: false,
      flash: false
    };
    this.videoRef = React.createRef();
  }

  componentDidMount = () => {
    this.setState({ hidden: this.props.hidden });
    this.buildPlayer();
    this.videoRef.current.addEventListener("canplay", () => {
      this.setState({ canPlay: true });
    });
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.hidden !== this.props.hidden) {
      this.setState({ hidden: this.props.hidden });
    }
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
      url: this.props.streamURL,
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
    const id = this.props.id || "video";
    return (
      <div>
        <div>
          <video
            className="videoLayout"
            id="myVideo"
            ref={this.videoRef}
            onPlay={e => {
              this.setState({ playbackStarted: true });
              this.props.playbackHandler(true);
            }}
          />
        </div>

        {this.state.flash && (
          <div
            style={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "640px",
              height: "480px",
              backgroundColor: "white"
            }}
          />
        )}

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
        <div className="refreshButton">
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
              this.props.playbackHandler(false);

              this.setState({ playbackStarted: false, canPlay: false });
            }}
            className="sync icon pointer_cursor"
          />
        </div>

        {this.state.playbackStarted && !this.state.hidden && (
          <div className="cameraButton">
            <i
              style={{
                position: "absolute",
                fontSize: "30px",
                top: "4px"
              }}
              onClick={() => {
                var frame = captureVideoFrame("myVideo", "png");
                this.setState({ flash: true });

                setTimeout(() => {
                  this.setState({ flash: false });
                  this.props.screenshotHandler(frame.dataUri);
                }, 80);
              }}
              className="camera icon large pointer_cursor"
            />
          </div>
        )}
      </div>
    );
  };
}
