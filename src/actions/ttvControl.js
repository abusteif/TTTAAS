import ttvControlApi from "../apis/ttvControlApi.js";

export const pressTtvKey = key => async dispatch => {
  const endpoint = `/keypress/${key}`;
  const response = await ttvControlApi.post(
    "/TTV-command/",
    { endpoint: endpoint },
    {
      "Content-Type": "application/json"
    }
  );
  dispatch({ type: "RUN_TTV_COMMAND", payload: response.data });
};

export const executeStep = (key, expectedBehaviour, delay) => {
  return dispatch => {
    const endpoint = `/keypress/${key}`;

    return ttvControlApi
      .post(
        "/TTV-execute/",
        {
          testStep: {
            endpoint,
            expectedBehaviour,
            delay
          }
        },
        {
          "Content-Type": "application/json"
        }
      )
      .then(res => {
        console.log(res);
        return res.data;
      });
  };
};
