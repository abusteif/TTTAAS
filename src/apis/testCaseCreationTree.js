import axios from "axios";
import { appIp, appPort } from "../configs.js";

export default axios.create({
  baseURL: `http://${appIp}:${appPort}`,
  headers: { "Access-Control-Allow-Origin": "*" }
});
