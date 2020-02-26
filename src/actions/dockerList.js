import dockerList from "../apis/dockerList.js";

export const getDockerList = id => async dispatch => {
  const response = await dockerList.get(`/dockers/${id}`);
  console.log(response);
  dispatch({ type: "GET_DOCKER_LIST", payload: response.data });
};

export const updateDocker = (id, newDocker) => async dispatch => {
  console.log({
    docker: newDocker
  });
  const response = await dockerList.put(
    `/docker/${id}`,
    {
      docker: newDocker
    },
    { "Content-Type": "application/json" }
  );
  dispatch({ type: "UPDATE_DOCKER", payload: response.data });
};

export const selectDocker = docker => {
  return {
    type: "SELECT_DOCKER",
    payload: docker
  };
};
