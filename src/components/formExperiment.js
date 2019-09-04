import React from "react";
import { Field, reduxForm } from "redux-form";
import "../styling/editableText.css";
import "./NodeRendererExtras/node-renderer-default.css";
import {
  updateTree,
  updateTreeFunction,
  selectNode,
  doubleClick,
  noDoubleClick,
  updateNodeName
} from "../actions";
import { connect } from "react-redux";

class StreamForm extends React.Component {
  renderError({ error, touched }) {
    console.log("HERE");
    if (touched && error) {
      return (
        <div className="ui error message">
          <div className="header">{error}</div>
        </div>
      );
    }
  }

  renderInput = ({ input, label, meta }) => {
    const className = `field ${meta.error && meta.touched ? "error" : ""}`;
    return (
      <div className={className}>
        <input {...input} autoComplete="off" />
        {this.renderError(meta)}
      </div>
    );
  };

  overlapRender = ({ input, label, meta }) => {
    console.log(input);
    return (
      <span>
        {input.name === "name" && (
          <input
            {...input}
            ref={input => input && input.focus()}
            className="noBorders"
            onBlur={() => {
              this.props.noDoubleClick();
              this.props.updateNodeName(
                input.value,
                this.props.selectedNode,
                this.props.path,
                this.props.getNodeKey,
                this.props.treeData
              );
            }}
            autoComplete="off"
          />
        )}
      </span>
    );
  };

  onSubmit = formValues => {
    this.props.onSubmit(formValues);
  };

  render() {
    // console.log(this.props.selectedNode.attributes.id == this.props.id)
    // console.log(this.props.id);
    // console.log(this.props.selectedNode.attributes.id);
    // console.log(this.props.isDoubleClicked);
    return (
      <div>
        <form>
          {this.props.selectedNode.attributes.id === this.props.id &&
            this.props.isDoubleClicked && (
              <Field name="name" component={this.overlapRender} />
            )}
        </form>
        {(!this.props.isDoubleClicked ||
          this.props.selectedNode.attributes.id !== this.props.id) && (
          <span
            className="noBorders"
            onDoubleClick={() => this.props.doubleClick()}
          >
            {this.props.initialName}
          </span>
        )}
      </div>
    );
  }
}

const validate = formValues => {
  const errors = {};
  //console.log(formValues);
  if (!formValues.textField) {
    errors.title = "You must enter a title";
  }

  if (!formValues.textBox) {
    errors.description = "You must enter a description";
  }

  return errors;
};

const mapStateToProps = state => {
  //console.log(state.tree.formInitials);
  return {
    treeData: state.tree.tree,
    selectedNode: state.tree.selectedNode,
    path: state.tree.path,
    getNodeKey: state.tree.getNodeKey,
    //    initialValues:state.tree.formInitials,
    isDoubleClicked: state.editableText.isDoubleClicked
  };
};

StreamForm = reduxForm({
  form: "streamForm",
  validate,

  enableReinitialize: true
})(StreamForm);

export default connect(
  mapStateToProps,
  {
    updateTree,
    updateTreeFunction,
    selectNode,
    doubleClick,
    noDoubleClick,
    updateNodeName
  }
)(StreamForm);
