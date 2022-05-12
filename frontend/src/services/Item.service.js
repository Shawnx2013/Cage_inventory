import axios from "axios";
import { ITEM_ROUTE } from "../constants/api-routes";

// contains methods to fetch various item info
// get all items
export const getAllItems = () => {
    return axios.get(`${ITEM_ROUTE}`).then((response) => {
        return response.data;
    });
}

// get item by id
export const getItemById = (item_id) => {
    return axios.get(`${ITEM_ROUTE}/${item_id}`).then((response) => {
        return response.data;
    });
}

// search by term
export const getItemsSearch = (search) => {
    return axios.get(`${ITEM_ROUTE}/search/${search}`).then((response) => {
        return response.data;
    })
}

// search by tag

// add a new item (for staff)
export const addItem = (name, type, description, version, count, long_term, location_id) => {
    const itemInfo = {
        name: name,
        type: type,
        description: description,
        version: version,
        count: count,
        long_term_loanable: long_term,
        location_id: location_id,
        tags: [3]
    };

    console.log(itemInfo);

    return axios.post(`${ITEM_ROUTE}`, itemInfo).then((response) => {
        return response;
    });
}