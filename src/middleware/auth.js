import axios from "axios";
import {SERVER, SOCKET} from "../constants";

export default function checkLogin() {
    return axios.post(SERVER + 'session/check', {
        withCredentials: true,
        headers:
            {
                Authorization: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IlJlbXkiLCJ1c2VyRW1haWwiOiJpbmZvQHNlYXNpZGVjb2RpbmcuY29tIiwiaWF0IjoxNjMyOTA5MTEzfQ.nWKsruZQ7z_ewkD1s7bPyp6XlQ8XjDPQxG_sN0FWkdA"
            }
    })

}
