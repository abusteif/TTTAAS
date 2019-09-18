import React from "react";
import ReactDOM from "react-dom";

class Modal extends React.Component {
  render() {
    return ReactDOM.createPortal(
      <div
        onClick={this.props.closeModalHandler}
        style={{
          display: "table",
          height: "100%",
          width: "100%",
          position: "absolute",
          backgroundColor: "rgba(0,0,0,0.7)"
        }}
        onMouseMove={this.props.onMouseMoveHandler}
      >
        {this.props.children}
      </div>,
      document.querySelector(`#${this.props.anchorId}`)
    );
  }
}

export default Modal;
