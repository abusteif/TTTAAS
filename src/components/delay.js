import React, { Component } from "react";
import "../styling/table.css";

export default class Delay extends Component {
  state = {
    delayValue: 0
  };

  componentDidMount() {
    this.setState({
      delayValue: this.props.initialValue
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.initialValue !== this.props.initialValue) {
      this.setState({
        delayValue: this.props.initialValue
      });
    }
  }
  handleOnDownButtonClick = () => {
    if (this.state.delayValue - 1 < 0) return;
    this.setState({ delayValue: this.state.delayValue - 1 });
    this.handleButtonClick(this.state.delayValue - 1);
  };

  handleOnUpButtonClick = () => {
    this.setState({ delayValue: this.state.delayValue + 1 });
    this.handleButtonClick(this.state.delayValue + 1);
  };

  handleButtonClick = newDelay => {
    this.props.handleButtonClick(this.props.stepId, newDelay);
  };

  render() {
    return (
      <div style={{ position: "absolute", left: "25%" }}>
        {this.state.delayValue}
        <i
          className="caret square down icon pointer_cursor"
          style={{ position: "absolute", top: "50%", left: "15px" }}
          onClick={this.handleOnDownButtonClick}
        ></i>
        <i
          className="caret square up icon pointer_cursor"
          style={{ position: "absolute", top: "-10%", left: "15px" }}
          onClick={this.handleOnUpButtonClick}
        ></i>
      </div>
    );
  }
}
