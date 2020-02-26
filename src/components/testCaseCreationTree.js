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
import {
  item_types,
  getApps,
  postTestSuite,
  deleteTestSuite,
  getTestCase,
  postTestCase,
  deleteTestCase,
  mapTestCasesToTreeData
} from "./treeUtils.js";

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

class Tree extends Component {
  state = {
    dataReady: false,
    canAction: true
  };

  componentDidMount = async () => {
    var treeData = await mapTestCasesToTreeData(await getApps());
    this.props.updateTree(treeData);
    this.setState({ dataReady: true });
  };

  shouldHaveAddButton = node =>
    node.attributes.name === "test_case" ? false : true;

  shouldHaveDeleteButton = node =>
    node.attributes.name === "app" ? false : true;

  shouldHaveDuplicateButton = node =>
    node.attributes.name === "test_case" ? true : false;

  updateBackend = async (operation, node, nodeType, oldNode) => {
    var result = false;
    switch (operation) {
      case "delete":
        switch (nodeType) {
          case "test_case":
            result = await deleteTestCase(node.id).then(result => {
              return result.status === 204;
            });
            await this.setState({ canAction: true });
            return result;

          case "test_suite":
            var deleteStatus = true;
            for (var child in node.children) {
              deleteStatus =
                deleteStatus &&
                (await deleteTestCase(node.children[child].id).then(result => {
                  return result.status === 204;
                }));
            }
            deleteStatus =
              deleteStatus &&
              (await deleteTestSuite(node.id).then(result => {
                return result.status === 204;
              }));

            await this.setState({ canAction: true });
            return deleteStatus;

          default:
            break;
        }

      case "add":
        result = await postTestSuite({
          testSuite: { id: node.id, name: node.name, parentId: node.parentId }
        }).then(result => {
          return result.status === 200;
        });
        await this.setState({ canAction: true });
        console.log(result);
        return result;

        break;

      case "duplicate":
        var currentTestCase = await getTestCase(oldNode.id).then(result => {
          return result.data;
        });

        if (currentTestCase.testCase === null) {
          await this.setState({ canAction: true });
          return false;
        }
        currentTestCase["testCase"] = {
          ...currentTestCase["testCase"],
          name: node.name,
          id: node.id
        };

        result = await postTestCase(currentTestCase).then(result => {
          return result.status === 200;
        });

        await this.setState({ canAction: true });
        return result;

      case "move":
        var moveStatus = true;
        currentTestCase = await getTestCase(oldNode.id).then(result => {
          return result.data;
        });
        if (currentTestCase.testCase === null) return true;

        currentTestCase["testCase"]["parentId"] = node.parentId;
        currentTestCase["testCase"]["name"] = node.name;

        moveStatus = await postTestCase(currentTestCase).then(result => {
          return result.status === 200;
        });

        await this.setState({ canAction: true });
        return moveStatus;

      case "changeName":
        var nameUpdateStatus = false;

        switch (nodeType) {
          case "test_case":
            console.log("here");
            var newTestCase = {
              testCase: { id: node.id, name: node.title }
            };

            nameUpdateStatus = await postTestCase(newTestCase).then(result => {
              return result.status === 200;
            });

            break;

          case "test_suite":
            var newTestSuite = {
              testSuite: { id: node.id, name: node.title }
            };

            nameUpdateStatus = await postTestSuite(newTestSuite).then(
              result => {
                return result.status === 200;
              }
            );
            break;
        }
        await this.setState({ canAction: true });

        return nameUpdateStatus;

      default:
        break;
    }
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

  nameChangehandler = async (title, { node, path, getNodeKey }) => {
    if (checkIfNameExists(title, this.getSiblings(node, getNodeKey, path))) {
      alert("Name already exists. Please choose a new name");
      return false;
    }

    const treeData = changeNodeAtPath({
      treeData: this.props.treeData,
      path,
      expandParent: true,
      getNodeKey,
      newNode: { ...node, title }
    });

    node = { ...node, title };
    if (
      (await this.updateBackend("changeName", node, node.attributes.name)) ===
      true
    ) {
      this.props.updateTree(treeData);

      console.log(treeData);

      return true;
    }
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

    return {
      treeData: {
        treeData: changeNodeAtPath({
          treeData: this.props.treeData,
          getNodeKey,
          newNode: { ...node, title, parentId: nextParentNode.id },
          path: nextPath
        })
      },
      newNodeProperties: {
        name: title,
        parentId: nextParentNode.id
      }
    };
  };

  getNodeTitle = (node, path, getNodeKey) => {
    if (node.attributes.name === "app") return node.name;
    else {
      return (
        <EditableText
          text={node.title}
          scaleFactor={8}
          params={{
            node: node,
            path: path,
            getNodeKey: getNodeKey
          }}
          onChange={this.nameChangehandler}
        />
      );
    }
  };
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
            onMoveNode={async nodeDetails => {
              const { treeData, newNodeProperties } = this.handleOnMove(
                nodeDetails,
                getNodeKey
              );
              // console.log(nodeDetails);
              // console.log(newNodeProperties);
              if (
                (await this.updateBackend(
                  "move",
                  newNodeProperties,
                  "test_case",
                  nodeDetails.node
                )) === true
              )
                this.props.updateTree(treeData.treeData);
            }}
            canNodeHaveChildren={node => node.attributes.isFolder}
            canDrop={({ nextParent }) =>
              nextParent && nextParent.attributes.name === "test_suite"
            }
            nodeContentRenderer={NodeRendererDefault}
            scaffoldBlockPxWidth={20}
            generateNodeProps={({ node, path, treeIndex }) => ({
              title: this.getNodeTitle(node, path, getNodeKey),

              onClick: e => {
                if (this.checkNodeBeforeSelect(node))
                  this.props.selectNode(
                    node,
                    this.getSiblings(node, getNodeKey, path),
                    path,
                    getNodeKey
                  );
                this.handleOnClick(node);
              },
              buttons: [
                this.shouldHaveAddButton(node) && (
                  <i
                    className="plus icon pointer_cursor"
                    onClick={async () => {
                      if (!this.state.canAction) return;
                      await this.setState({ canAction: false });
                      const { treeData, newNodeProperties } = this.addNewNode({
                        node,
                        getNodeKey,
                        path
                      });
                      if (node.attributes.name === "app") {
                        if (
                          (await this.updateBackend(
                            "add",
                            newNodeProperties,
                            "test_suite"
                          )) === true
                        )
                          this.props.updateTree(treeData.treeData);
                      } else {
                        await this.setState({ canAction: true });
                        this.props.updateTree(treeData.treeData);
                      }
                    }}
                  />
                ),

                this.shouldHaveDuplicateButton(node) && (
                  <i
                    className="copy icon pointer_cursor"
                    onClick={async e => {
                      e.stopPropagation();

                      if (!this.state.canAction) return;
                      await this.setState({ canAction: false });

                      const { treeData, newNodeProperties } = this.addNewNode({
                        node,
                        getNodeKey,
                        path
                      });
                      if (
                        (await this.updateBackend(
                          "duplicate",
                          newNodeProperties,
                          "test_case",
                          node
                        )) === true
                      )
                        this.props.updateTree(treeData.treeData);
                    }}
                  />
                ),

                this.shouldHaveDeleteButton(node) && (
                  <i
                    className="trash icon pointer_cursor"
                    onClick={async e => {
                      e.stopPropagation();

                      if (!this.state.canAction) return;
                      await this.setState({ canAction: false });

                      if (
                        (await this.updateBackend(
                          "delete",
                          node,
                          node.attributes.name
                        )) === true
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
