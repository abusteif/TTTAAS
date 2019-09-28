import tree from "../apis/tree.js";

import {
  removeNodeAtPath,
  addNodeUnderParent,
  getNodeAtPath,
  changeNodeAtPath
} from "react-sortable-tree";

const nameChangehandler = (title, node, path, getNodeKey, oldTreeData) => {
  if (
    checkIfNameExists(title, getSiblings(node, getNodeKey, path, oldTreeData))
  ) {
    alert("Name already exists. Please choose a new name");
    return oldTreeData;
  }
  const treeData = changeNodeAtPath({
    treeData: oldTreeData,
    path,
    getNodeKey,
    newNode: { ...node, title }
  });

  return treeData;
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

const getSiblings = (node, getNodeKey, path, treeData) => {
  var allNodes = getParentNode(node, getNodeKey, path, treeData).children;
  return allNodes.filter(n => n.title !== node.title);
};

const getParentNode = (node, getNodeKey, path, treeData) => {
  var newPath = [...path];
  newPath.splice(-1, 1);
  var parentPath = newPath;
  return getNodeAtPath({ treeData: treeData, getNodeKey, path: parentPath })
    .node;
};

export const updateTree = tree => {
  return {
    type: "UPDATE_TREE",
    payload: {
      tree: tree
    }
  };
};

export const updateTreeFunction = treeFunction => {
  return {
    type: "UPDATE_TREE_FUNCTION",
    payload: {
      treeFunction
    }
  };
};

export const selectNode = (selectedNode, siblings, path, getNodeKey) => {
  return {
    type: "SELECT_NODE",
    payload: {
      selectedNode,
      siblings,
      path,
      getNodeKey
    }
  };
};

export const updateName = name => {
  return {
    type: "UPDATE_NAME",
    payload: {
      name
    }
  };
};

export const updateNodeName = (name, node, path, getNodeKey, treeData) => {
  const newTreeData = nameChangehandler(name, node, path, getNodeKey, treeData);

  return {
    type: "UPDATE_TREE",
    payload: {
      tree: newTreeData
    }
  };
};

export const doubleClick = () => {
  return {
    type: "DOUBLE_CLICK"
  };
};

export const noDoubleClick = () => {
  return {
    type: "NO_DOUBLE_CLICK"
  };
};
