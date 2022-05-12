import { TAG_ROUTE } from "../constants/api-routes";
import axios from "axios";

// get all tags
export const getAllTags = () => {
    return axios.get(TAG_ROUTE).then((response) => {
        return response.data
    });
}