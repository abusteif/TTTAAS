import axios from "axios";
import { appIp } from "../configs.js";

export default axios.create({
  baseURL: `http://${appIp}:5000`,
  headers: { "Access-Control-Allow-Origin": "*" }
});
