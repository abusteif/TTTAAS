const INITIAL_STATE = {
  isDoubleClicked: false
};
export const editTextReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "DOUBLE_CLICK":
      return {
        isDoubleClicked: true
      };
    case "NO_DOUBLE_CLICK":
      return {
        isDoubleClicked: false
      };
    default:
      return state;
  }
};
