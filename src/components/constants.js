import "../styling/App.css";
import React from "react";
export const navigationOptions = [
  {
    text: (
      <div>
        <i className="chevron up icon" /> UP
      </div>
    ),
    value: "UP"
  },
  {
    text: (
      <div>
        <i className="chevron down icon" /> DOWN
      </div>
    ),
    value: "move down"
  },
  {
    text: (
      <div>
        <i className="chevron right icon" /> RIGHT
      </div>
    ),
    value: "move right"
  },
  {
    text: (
      <div>
        <i className="chevron left icon" /> LEFT
      </div>
    ),
    value: "move left"
  },
  {
    text: (
      <div>
        <i className="badge">OK</i> OK
      </div>
    ),
    value: "OK"
  }
];
