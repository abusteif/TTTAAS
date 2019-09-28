import React, { Component } from "react";
import _ from "lodash";
import "react-sortable-tree/style.css";
import SortableTree from "react-sortable-tree";
import {
  removeNodeAtPath,
  addNodeUnderParent,
  getNodeAtPath,
  changeNodeAtPath
} from "react-sortable-tree";
import NodeRendererDefault from "./NodeRendererExtras/myNodeRenderer";
import EditableText from "./editableText";
import { testApps, testSuites, testCases } from "../static/mockData";

import { connect } from "react-redux";
import {
  updateTree,
  updateTreeFunction,
  selectNode,
  updateName,
  updateNodeName
} from "../actions";
import {
  initializeTestCaseTable,
  getTestCaseStepsFromApi
} from "../actions/table";

const uuidv4 = require("uuid/v4");

const item_types = {
  app: { name: "app", child: "test_suite", parent: null, isFolder: true },
  test_suite: {
    name: "test_suite",
    child: "test_case",
    parent: "app",
    isFolder: true
  },
  test_case: {
    name: "test_case",
    child: null,
    parent: "test_suite",
    isFolder: false
  }
};

const shouldHaveAddButton = node =>
  node.attributes.name === "test_case" ? false : true;

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

const getApps = () => testApps;

const getTestSuites = appId => {
  return testSuites.filter(testSuite => testSuite.parentId === appId);
};

const getTestCases = testSuiteId => {
  return testCases.filter(testCase => testCase.parentId === testSuiteId);
};

const mapTestCasesToTreeData = allApps => {
  let treeData = [];

  for (var a in allApps) {
    var app = allApps[a];
    treeData.push({
      title: app.name,
      attributes: item_types.app,
      id: app.id,
      parentId: null,
      expanded: true,
      children: (appId => {
        var children = [];
        var testSuites = getTestSuites(appId);
        for (var s in testSuites) {
          var ts = testSuites[s];
          children.push({
            title: ts.name,
            attributes: item_types.test_suite,
            id: ts.id,
            parentId: ts.parentId,
            expanded: true,
            children: (testSuiteId => {
              var testCases = getTestCases(testSuiteId);
              var children = [];
              for (var c in testCases) {
                var tc = testCases[c];
                children.push({
                  title: tc.name,
                  attributes: item_types.test_case,
                  id: tc.id,
                  parentId: tc.parentId
                });
              }
              return children;
            })(ts.id)
          });
        }
        return children;
      })(app.id)
    });
  }
  return treeData;
};

class Tree extends Component {
  componentDidMount() {
    this.props.updateTree(mapTestCasesToTreeData(testApps));
  }

  handleOnClick = node => {
    if (node.attributes.name === "test_case") {
      this.props.initializeTestCaseTable(node.id);
      this.props.getTestCaseStepsFromApi(node.id);
    }
  };

  getParentNode = (node, getNodeKey, path) => {
    var newPath = [...path];
    newPath.splice(-1, 1);
    var parentPath = newPath;
    return getNodeAtPath({
      treeData: this.props.treeData,
      getNodeKey,
      path: parentPath
    }).node;
  };

  getSiblings = (node, getNodeKey, path) => {
    var allNodes = this.getParentNode(node, getNodeKey, path).children;
    return allNodes.filter(n => n.title !== node.title);
  };

  addNewNode = ({ node, getNodeKey, path }) => {
    var newPath = [...path];
    newPath.splice(-1, 1);

    var parentNode, parentPath;
    node.attributes.name === "test_case"
      ? (parentPath = newPath)
      : (parentPath = path);

    parentNode = getNodeAtPath({
      treeData: this.props.treeData,
      getNodeKey,
      path: parentPath
    }).node;

    const newAttribute =
      parentNode.attributes.name === "app"
        ? item_types.test_suite
        : item_types.test_case;
    return {
      treeData: addNodeUnderParent({
        treeData: this.props.treeData,
        parentKey: path[parentPath.length - 1],
        expandParent: true,
        getNodeKey,
        newNode: {
          title: newNameFinder(node, parentNode),
          attributes:
            parentNode.attributes.name === "app"
              ? item_types.test_suite
              : item_types.test_case,
          id: uuidv4(),
          parentId: parentNode.id
        }
      }).treeData
    };
  };

  nameChangehandler = (title, node, path, getNodeKey) => {
    if (checkIfNameExists(title, this.getSiblings(node, getNodeKey, path))) {
      alert("Name already exists. Please choose a new name");
      return false;
    }

    this.props.updateTreeFunction(state => ({
      treeData: changeNodeAtPath({
        treeData: this.props.treeData,
        path,
        getNodeKey,
        newNode: { ...node, title }
      })
    }));
    return true;
  };

  handleOnMove = ({ node, nextParentNode, prevPath, nextPath }, getNodeKey) => {
    var counter = !(checkIfNameExists(node.title, nextParentNode.children) > 1);

    if (!counter && !_.isEqual(prevPath, nextPath)) {
      var title = produceNewName(
        node.title,
        nextParentNode.children,
        (name, i) => name + "_" + i
      );
    } else {
      var title = node.title;
    }

    this.props.updateTreeFunction(state => ({
      treeData: changeNodeAtPath({
        treeData: this.props.treeData,
        path: nextPath,
        getNodeKey,
        newNode: { ...node, title, parentId: nextParentNode.id }
      })
    }));
  };

  //  title:(<EditableText text={node.title} nodeParams={{node:node, path:path, getNodeKey:getNodeKey}} onChange={this.nameChangehandler}/>),

  render() {
    const getNodeKey = ({ treeIndex }) => treeIndex;

    return (
      <div>
        <div style={{ height: "100%", width: "100%", position: "absolute" }}>
          <SortableTree
            rowHeight={30}
            treeData={this.props.treeData}
            onChange={treeData => this.props.updateTree(treeData)}
            canDrag={({ node }) => !node.attributes.isFolder}
            onMoveNode={nodeDetails =>
              this.handleOnMove(nodeDetails, getNodeKey)
            }
            canNodeHaveChildren={node => node.attributes.isFolder}
            canDrop={({ nextParent }) =>
              nextParent && nextParent.attributes.name === "test_suite"
            }
            nodeContentRenderer={NodeRendererDefault}
            scaffoldBlockPxWidth={20}
            generateNodeProps={({ node, path, treeIndex }) => ({
              title: (
                <EditableText
                  text={node.title}
                  nodeParams={{
                    node: node,
                    path: path,
                    getNodeKey: getNodeKey
                  }}
                  onChange={this.nameChangehandler}
                />
              ),
              onClick: e => {
                this.props.selectNode(
                  node,
                  this.getSiblings(node, getNodeKey, path),
                  path,
                  getNodeKey
                );
                this.handleOnClick(node);
                // this.props.updateName(node.title)
                // this.props.updateNodeName("newNodeName", node, path, getNodeKey, this.props.treeData)
                //console.log(node);
                // console.log(this.props.treeData);
              },
              buttons: [
                shouldHaveAddButton(node) && (
                  <i
                    className="plus icon pointer_cursor"
                    onClick={() => {
                      this.props.updateTree(
                        this.addNewNode({ node, getNodeKey, path }).treeData
                      );
                    }}
                  />
                ),

                !shouldHaveAddButton(node) && (
                  <i
                    className="copy icon pointer_cursor"
                    onClick={() =>
                      this.props.updateTree(
                        this.addNewNode({ node, getNodeKey, path }).treeData
                      )
                    }
                  />
                ),

                <i
                  className="trash icon pointer_cursor"
                  onClick={() =>
                    this.props.updateTreeFunction(state => ({
                      treeData: removeNodeAtPath({
                        treeData: this.props.treeData,
                        path,
                        getNodeKey
                      })
                    }))
                  }
                />
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
    selectedNode: state.tree.selectedNode
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
    initializeTestCaseTable,
    getTestCaseStepsFromApi
  }
)(Tree);
