import axios from "axios";
import { ttvIp } from "../configs.js";

export default axios.create({
  baseURL: `http://${ttvIp}:8060`
});
