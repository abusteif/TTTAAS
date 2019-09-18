import ttvControlApi from "../apis/ttvControlApi.js";

export const pressTtvKey = key => async dispatch => {
  const response = await ttvControlApi.post(`/keypress/${key}`);

  dispatch({ type: "PRESS_TTV_KEY", payload: response.data });
};
