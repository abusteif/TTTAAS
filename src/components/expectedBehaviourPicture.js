import React from "react";
import ReactDOM from "react-dom";
import "../styling/expectedBehaviour.css";
import { videoDimensions } from "../configs.js";

const ExpectedBehaviourPreview = props => {
  //  const previewPic = require(`../mock/${props.pictureLink}`);
  return (
    <img
      className="previewPicture"
      src={props.previewPic}
      style={{
        top: props.top - videoDimensions.height / 2,
        left: props.left + videoDimensions.width / 2,
        width: `${videoDimensions.width}px`,
        height: `${videoDimensions.height}px`
      }}
    />
  );
};

export default ExpectedBehaviourPreview;
