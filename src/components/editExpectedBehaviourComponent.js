import React, { Component } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import "../styling/expectedBehaviour.css";

export default class EditExpectedBehaviourComponent extends Component {
  _crop = () => {
    // image in dataUrl
    console.log(this.refs.cropper.cropper.cropBoxData);
  };

  render = () => {
    return (
      <div
        onClick={e => e.stopPropagation()}
        style={{
          height: "560px",
          position: "absolute",
          top: "50%",
          left: "50%",
          border: "5px groove",
          margin: "-320px 0 0 -240px",
          borderRadius: "1%"
        }}
      >
        <Cropper
          ref="cropper"
          src={this.props.image}
          guides={false}
          crop={this._crop}
        />

        <div
          className="ui message"
          style={{ position: "absolute", width: "640px", bottom: "0px" }}
        >
          <button className="ui primary button" onClick={() => {}}>
            Save selection
          </button>
          <button className="ui button" onClick={() => {}}>
            Inverse selection
          </button>
          <button className="ui button" onClick={() => {}}>
            Cancel
          </button>
        </div>
      </div>
    );
  };
}
