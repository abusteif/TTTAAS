import React, { Component } from "react";
import { connect } from "react-redux";
import { getDockerList, selectDocker } from "../actions/dockerList";
import { getSelectedTestCases } from "../actions/selectedTestCasesList";
import { updateDocker } from "../actions/dockerList";

import { getApps } from "./treeUtils";
import { appId } from "../configs";
import EditableText from "./editableText";

class DockerList extends Component {
  componentDidMount = () => {
    this.props.getDockerList(appId);
  };

  handleOnClick = docker => {
    this.props.selectDocker(docker);
    this.props.getSelectedTestCases(docker.id);
  };

  getClassName = id => {
    return id === this.props.selectedDocker.id
      ? "list-group-item list-group-item-action active"
      : "list-group-item list-group-item-action";
  };

  nameChangehandler = (name, docker) => {
    const checkName = async (name, docker) => {
      if (this.props.dockerList.find(x => x.name === name)) {
        alert("Name already exists. Please choose a new name");
        return false;
      } else {
        await this.props.updateDocker(docker.id, { ...docker, name });
        this.props.selectDocker({ ...docker, name });
        this.props.getDockerList(appId);

        return true;
      }
    };
    return checkName(name, docker.docker);
  };

  renderRows = () => {
    return this.props.dockerList.map(docker => {
      return (
        <div
          key={docker.name}
          onClick={() => {
            this.handleOnClick(docker);
          }}
        >
          <div
            className={this.getClassName(docker.id)}
            style={{ display: "table", cursor: "pointer" }}
          >
            <EditableText
              text={docker.name}
              scaleFactor={15}
              params={{ docker }}
              onChange={this.nameChangehandler}
            />{" "}
          </div>
        </div>
      );
    });
  };

  render() {
    console.log(this.props.dockerList);
    if (
      !Array.isArray(this.props.dockerList) ||
      !this.props.dockerList.length > 0
    )
      return <div />;
    return (
      <div>
        <div>{this.renderRows()}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    selectedTestCaseList: state.testCaseSelect.selectedTestCaseList,
    dockerList: state.dockerList.dockerList,
    selectedDocker: state.dockerList.selectedDocker
  };
};

export default connect(
  mapStateToProps,
  { getDockerList, selectDocker, getSelectedTestCases, updateDocker }
)(DockerList);
