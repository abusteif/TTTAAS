import React from "react";
import ReactDOM from "react-dom";
import "../styling/expectedBehaviour.css";

const ExpectedBehaviourPreview = props => {
  //  const previewPic = require(`../mock/${props.pictureLink}`);
  return (
    <img
      className="previewPicture"
      src={props.previewPic}
      style={{
        top: props.top - 240,
        left: props.left + 320
      }}
    />
  );
};

export default ExpectedBehaviourPreview;
