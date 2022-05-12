import { KIT_ROUTE } from "../constants/api-routes";
import axios from "axios";

// get all
export const getAllKits = () => {
    return axios.get(KIT_ROUTE).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
}

// get by id
export const getKitById = (kit_id) => {
    return axios.get(`${KIT_ROUTE}/${kit_id}`).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    })
}

// search
export const searchKits = (search) => {
    return axios.get(`${KIT_ROUTE}/search/${search}`).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    })
}

// new
export const createKit = (kit_name, creator, desc, count, long_term, location, items) => {
    const kitData = {
        name: kit_name,
        creator_id: creator,
        description: desc,
        count: count,
        long_term_loanable: long_term,
        location: location,
        items: items
    }

    console.log(kitData);

    return axios.post(`${KIT_ROUTE}`, kitData).then((response) => {
        return response.data;
    }).catch((error) => {
        return error;
    });
}