import React, { Component } from "react";
import "react-sortable-tree/style.css";
import SortableTree from "react-sortable-tree";

import NodeRendererDefault from "./NodeRendererExtras/myNodeRenderer";
import { testApps, testSuites, testCases } from "../static/mockData";

import { connect } from "react-redux";
import {
  updateTree,
  updateTreeFunction,
  selectNode,
  updateName,
  updateNodeName,
  unselectNode
} from "../actions/testCaseCreationTree";
import {
  //initializeTestCaseTable,
  getTestCaseStepsFromApi,
  resetTable
} from "../actions/table";
import tree from "../apis/testCaseCreationTree.js";
import {
  item_types,
  getApps,
  getTestSuites,
  postTestSuite,
  deleteTestSuite,
  getTestCases,
  getTestCase,
  postTestCase,
  deleteTestCase,
  mapTestCasesToTreeData,
  getParentNode
} from "./treeUtils.js";

import { addToSelectedTestSuite } from "../actions/selectedTestCasesList";

const uuidv4 = require("uuid/v4");

const produceNewName = (name, children, nameFunction) => {
  var nameExists = true;
  var i = 1;
  while (nameExists) {
    var newName = nameFunction(name, i);
    if ((nameExists = checkIfNameExists(newName, children))) i++;
  }
  return (newName = nameFunction(name, i));
};

const checkIfNameExists = (name, children) => {
  var counter = 0;
  for (let child in children) {
    if (children[child].title.valueOf() === name) {
      counter++;
    }
  }
  //console.log(counter);
  return counter > 0 ? counter : false;
};

const newNameFinder = (node, { title, children }) => {
  var name;
  var nameFunction;

  switch (node.attributes.name) {
    case "app":
      name = "test_suite";
      break;
    case "test_suite":
      name = "test_case";
      break;
    case "test_case":
      name = node.title + "_copy";
      break;
    default:
      break;
  }
  nameFunction = (name, i) => name + i;
  return produceNewName(name, children, nameFunction);
};

class TestCaseSelectionTree extends Component {
  state = {
    dataReady: false,
    canAction: true
  };

  componentDidMount = async () => {
    var treeData = await mapTestCasesToTreeData(testApps);
    console.log(treeData);
    this.props.updateTree(treeData);
    this.setState({ dataReady: true });
  };

  shouldHaveAddButton = node => (node.attributes.name === "app" ? false : true);

  handleOnClick = (node, getNodeKey, path) => {
    switch (node.attributes.name) {
      case "test_case":
        const parentNode = getParentNode(
          node,
          getNodeKey,
          path,
          this.props.treeData
        );

        return {
          type: "test_suite",
          name: parentNode.title,
          id: parentNode.id,
          testCases: [
            {
              type: "test_case",
              id: node.id,
              parentId: node.parentId,
              name: node.title
            }
          ]
        };

      case "test_suite":
        var testCases = [];
        for (var testCase in node.children) {
          testCases = [
            ...testCases,
            {
              type: "test_case",
              id: node.children[testCase].id,
              parentId: node.id,
              name: node.children[testCase].title
            }
          ];
        }

        return {
          type: "test_suite",
          name: node.title,
          id: node.id,
          testCases
        };

      default:
        return {};
    }
  };

  getNodeClassName = type => {
    return type !== "app" ? "pointer_cursor" : "";
  };

  render() {
    if (
      !this.state.dataReady ||
      Object.keys(this.props.selectedDocker).length === 0
    )
      return <div />;
    const getNodeKey = ({ treeIndex }) => treeIndex;

    return (
      <div>
        <div style={{ height: "100%", width: "100%", position: "absolute" }}>
          <SortableTree
            rowHeight={30}
            treeData={this.props.treeData}
            canDrag={false}
            onChange={treeData => this.props.updateTree(treeData)}
            canNodeHaveChildren={node => node.attributes.isFolder}
            nodeContentRenderer={NodeRendererDefault}
            scaffoldBlockPxWidth={20}
            generateNodeProps={({ node, path, treeIndex }) => ({
              title: node.name,
              className: this.getNodeClassName(node.attributes.name),

              onClick: e => {
                if (node.attributes.name === "app") return;
                this.props.addToSelectedTestSuite(
                  this.handleOnClick(node, getNodeKey, path)
                );
                console.log(this.props.selectedTestCaseList);
              },
              buttons: [
                this.shouldHaveAddButton(node) && (
                  <i className="right arrow icon pointer_cursor " />
                )
              ]
            })}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    treeData: state.tree.tree,
    selectedNode: state.tree.selectedNode,
    initialTableData: state.table.initialTable,
    currentTableData: state.table.table,
    selectedTestCaseList: state.testCaseSelect.selectedTestCaseList,
    selectedDocker: state.dockerList.selectedDocker
  };
};

export default connect(
  mapStateToProps,
  {
    updateTree,
    updateTreeFunction,
    selectNode,
    updateName,
    updateNodeName,
    //  initializeTestCaseTable,
    getTestCaseStepsFromApi,
    resetTable,
    unselectNode,
    addToSelectedTestSuite
  }
)(TestCaseSelectionTree);
