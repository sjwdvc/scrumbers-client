import axios from "axios";
import {SERVER} from "../constants";

export default function checkLogin() {
    return axios.get(SERVER + 'session/check', {withCredentials: true})
}