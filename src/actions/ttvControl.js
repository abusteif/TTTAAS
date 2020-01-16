import { ttvIp, ttvPort } from "../configs.js";
import ttvControlApi from "../apis/ttvControlApi.js";

export const pressTtvKey = key => async dispatch => {
  const endpoint = `/keypress/${key}`;
  const response = await ttvControlApi.post(
    "/TTV-command/",
    { endpoint: endpoint, baseURL: `http://${ttvIp}:${ttvPort}` },
    {
      "Content-Type": "application/json"
    }
  );
  dispatch({ type: "RUN_TEST_CASE", payload: response.data });
};
