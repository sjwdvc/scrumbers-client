import axios from "axios";
import {SERVER, TOKEN} from "../constants";

// Global middleware function to request a login boolean : Promise
export default () => axios.post(SERVER + 'session/check')