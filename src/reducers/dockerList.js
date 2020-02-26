const _ = require("lodash");
const DOCKER_LIST = {
  dockerList: [],
  selectedDocker: {}
};

export const dockerList = (state = DOCKER_LIST, action) => {
  switch (action.type) {
    case "GET_DOCKER_LIST":
      return { ...state, dockerList: action.payload.dockers };

      break;
    case "SELECT_DOCKER":
      return { ...state, selectedDocker: action.payload };

    default:
      return state;
  }
};
