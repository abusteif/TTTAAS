import React, { Component } from "react";

const Tooltip = props => {
  return (
    <div
      style={{
        top: props.top + 30,
        left: props.left - 90,
        position: "fixed"
      }}
      className="ui  label"
    >
      {props.text}
    </div>
  );
};

export default Tooltip;
