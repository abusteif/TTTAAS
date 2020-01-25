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
  updateNodeName,
  unselectNode
} from "../actions/tree";
import {
  //initializeTestCaseTable,
  getTestCaseStepsFromApi,
  resetTable
} from "../actions/table";
import tree from "../apis/tree.js";

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

const shouldHaveDeleteButton = node =>
  node.attributes.name === "app" ? false : true;

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

class Tree extends Component {
  state = {
    dataReady: false
  };

  componentDidMount = async () => {
    var treeData = await this.mapTestCasesToTreeData(testApps);
    console.log(treeData);
    this.props.updateTree(treeData);
    this.setState({ dataReady: true });
  };

  getApps = () => {
    return tree.get(`/apps`);
  };

  getTestSuites = appId => {
    return tree.get(`/test-suites/${appId}`);
  };

  getTestCases = testSuiteId => {
    return tree.get(`/test-cases/${testSuiteId}`);
  };

  getTestCase = testCaseId => {
    return tree.get(`/test-case/${testCaseId}`);
  };

  postTestCase = testCaseData => {
    return tree.put(`/test-case/${testCaseData["testCase"].id}`, testCaseData, {
      "Content-Type": "application/json"
    });
  };
  postTestSuite = (id, parentId, name) => {
    return tree.put(`/test-suite/${id}`, { testSuite: { id, parentId, name } });
  };

  deleteTestSuite = id => {
    return tree.delete(`/test-suite/${id}`);
  };

  deleteTestCase = id => {
    return tree.delete(`/test-case/${id}`);
  };

  updateBackend = async (operation, node, nodeType, oldNode) => {
    switch (operation) {
      case "delete":
        switch (nodeType) {
          case "test_case":
            return await this.deleteTestCase(node.id).then(result => {
              return result.status === 204;
            });
          //return this.deleteTestCase(node.id);

          case "test_suite":
            var deleteStatus = true;
            for (var child in node.children) {
              deleteStatus =
                deleteStatus &&
                (await this.deleteTestCase(node.children[child].id).then(
                  result => {
                    return result.status === 204;
                  }
                ));
            }
            deleteStatus =
              deleteStatus &&
              (await this.deleteTestSuite(node.id).then(result => {
                return result.status === 204;
              }));

            return deleteStatus;

          default:
            break;
        }

      case "add":
        return await this.postTestSuite(node.id, node.parentId, node.name).then(
          result => {
            return result.status === 200;
          }
        );
        break;

      case "duplicate":
        const currentTestCase = await this.getTestCase(oldNode.id).then(
          result => {
            return result.data;
          }
        );

        currentTestCase["testCase"] = {
          ...currentTestCase["testCase"],
          name: node.name,
          id: node.id
        };

        return await this.postTestCase(currentTestCase).then(result => {
          return result;
        });

      case "move":
        const currentTestCase = await this.getTestCase(oldNode.id).then(
          result => {
            return result.data;
          }
        );

        currentTestCase["parentId"] = node.parentId;

        return await this.postTestCase(currentTestCase).then(result => {
          return result;
        });

      default:
        break;
    }
  };

  mapTestCasesToTreeData = async () => {
    const response = await this.getApps();
    console.log(response);
    // const response = await tree.get(`/apps`);

    const allApps = response.data.apps;

    let treeData = [];

    for (var a in allApps) {
      var app = allApps[a];
      treeData.push({
        title: app.name,
        attributes: item_types.app,
        id: app.id,
        parentId: null,
        expanded: true,
        children: await (async appId => {
          var children = [];
          let testSuites = await this.getTestSuites(appId);
          testSuites = testSuites.data.testSuites;
          for (var s in testSuites) {
            var ts = testSuites[s];
            children.push({
              title: ts.name,
              attributes: item_types.test_suite,
              id: ts.id,
              parentId: ts.parentId,
              expanded: true,
              children: await (async testSuiteId => {
                let testCases = await this.getTestCases(testSuiteId);
                testCases = testCases.data.testCases;
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

  checkNodeBeforeSelect = node => {
    if (node.attributes.name === "test_case") {
      if (
        _.isEqual(this.props.currentTableData, [{}]) ||
        _.isEqual(this.props.initialTableData, this.props.currentTableData)
      )
        return true;
      else {
        return false;
      }
    } else {
      return true;
    }
  };

  handleOnClick = node => {
    if (node.attributes.name !== "test_case") return;
    if (this.checkNodeBeforeSelect(node))
      this.props.getTestCaseStepsFromApi(node.id);
    else {
      alert("Please save or discard your changes");
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

    const newName = newNameFinder(node, parentNode);
    const newId = uuidv4();
    return {
      treeData: {
        treeData: addNodeUnderParent({
          treeData: this.props.treeData,
          parentKey: path[parentPath.length - 1],
          expandParent: true,
          getNodeKey,
          newNode: {
            title: newName,
            attributes:
              parentNode.attributes.name === "app"
                ? item_types.test_suite
                : item_types.test_case,
            id: newId,
            parentId: parentNode.id
          }
        }).treeData
      },
      newNodeProperties: {
        name: newName,
        parentId: parentNode.id,
        id: newId,
        attributes: {}
      }
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
    if (!this.state.dataReady) return <div />;
    const getNodeKey = ({ treeIndex }) => treeIndex;

    return (
      <div>
        <div style={{ height: "100%", width: "100%", position: "absolute" }}>
          <SortableTree
            rowHeight={30}
            treeData={this.props.treeData}
            onChange={treeData => this.props.updateTree(treeData)}
            canDrag={({ node }) => !node.attributes.isFolder}
            onMoveNode={nodeDetails => {
              if (
                this.updateBackend("move", newNodeProperties, "test_case", node)
              )
                this.handleOnMove(nodeDetails, getNodeKey);
              console.log(this.props.treeData);
            }}
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
                if (this.checkNodeBeforeSelect(node))
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
                      const { treeData, newNodeProperties } = this.addNewNode({
                        node,
                        getNodeKey,
                        path
                      });
                      if (node.attributes.name === "app")
                        this.updateBackend(
                          "add",
                          newNodeProperties,
                          "test_suite"
                        );
                      this.props.updateTree(treeData.treeData);
                    }}
                  />
                ),

                !shouldHaveAddButton(node) && (
                  <i
                    className="copy icon pointer_cursor"
                    onClick={e => {
                      e.stopPropagation();

                      const { treeData, newNodeProperties } = this.addNewNode({
                        node,
                        getNodeKey,
                        path
                      });
                      if (
                        this.updateBackend(
                          "duplicate",
                          newNodeProperties,
                          "test_case",
                          node
                        )
                      )
                        this.props.updateTree(treeData.treeData);
                    }}
                  />
                ),

                shouldHaveDeleteButton(node) && (
                  <i
                    className="trash icon pointer_cursor"
                    onClick={async e => {
                      e.stopPropagation();
                      // if (
                      //   (await this.updateBackend("delete", node).then(result => {
                      //     return result.status;
                      //   })) === 204
                      // ) {

                      if (
                        this.updateBackend("delete", node, node.attributes.name)
                      ) {
                        this.props.updateTreeFunction(() => ({
                          treeData: removeNodeAtPath({
                            treeData: this.props.treeData,
                            path,
                            getNodeKey
                          })
                        }));
                        if (this.props.selectedNode.id === node.id) {
                          this.props.unselectNode();
                          this.props.resetTable();
                        }
                      }
                    }}
                  />
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
    currentTableData: state.table.table
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
    unselectNode
  }
)(Tree);
