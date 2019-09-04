import React, { Component } from "react";
import "../styling/editableText.css";
import "./NodeRendererExtras/node-renderer-default.css";

class EditText extends Component {
  componentDidMount() {
    this.setState({
      textValue: this.props.text,
      originalState: this.props.text
    });
  }

  state = {
    textValue: "",
    showText: false,
    originalState: ""
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.text !== this.props.text) {
      this.setState({
        textValue: this.props.text,
        originalState: this.props.text
      });
    }
  }

  handleSubmit = e => {
    //console.log(this.props.selectedNode);
    console.log(this.state.originalState);
    if (
      this.props.onChange(
        e.target.value,
        this.props.nodeParams.node,
        this.props.nodeParams.path,
        this.props.nodeParams.getNodeKey
      )
    ) {
      this.setState({
        textValue: e.target.value,
        showText: !this.state.showText,
        originalState: e.target.value
      });
    } else {
      this.setState({ textValue: this.state.originalState });
    }
    // console.log(this.props.selectedNode);
    // this.props.updateNodeName("testingnewname", this.props.selectedNode, this.props.siblings)
  };

  handleChange = e => {
    this.setState({ textValue: e.target.value });
  };

  render() {
    return (
      <span>
        {this.state.showText && (
          <input
            ref={input => input && input.focus()}
            style={{ width: `${this.state.textValue.length * 8}px` }}
            className=" noBorders"
            onBlur={this.handleSubmit}
            value={this.state.textValue}
            onChange={this.handleChange}
          />
        )}

        {!this.state.showText && (
          <span
            onDoubleClick={() => {
              this.setState({ showText: !this.state.showText });
            }}
          >
            {this.state.textValue}
          </span>
        )}
      </span>
    );
  }
}

export default EditText;
