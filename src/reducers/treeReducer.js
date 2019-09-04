const INITIAL_STATE = {
  tree: [{ title: "mainNode" }],
  selectedNode: {
    title: "",
    attributes: {
      id: ""
    }
  },
  formInitials: {
    name: ""
  }
};

export const updateTreeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "UPDATE_TREE":
      return { ...state, tree: action.payload.tree };
    case "UPDATE_TREE_FUNCTION":
      return { ...state, tree: action.payload.treeFunction().treeData };
    case "SELECT_NODE":
      if (!(action.payload.selectedNode.attributes.name === "test_case")) {
        return state;
      }
      return {
        ...state,
        selectedNode: action.payload.selectedNode,
        siblings: action.payload.siblings,
        path: action.payload.path,
        getNodeKey: action.payload.getNodeKey
      };
    case "UPDATE_NAME":
      console.log(action.payload);
      return { ...state, formInitials: { name: action.payload.name } };
    default:
      return state;
  }
};
