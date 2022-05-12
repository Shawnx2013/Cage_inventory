import axios from "axios";
import { LOCATION_ROUTE } from "../constants/api-routes";

// get all locations
export const getAllLocations = () => {
    return axios.get(`${LOCATION_ROUTE}`).then((response) => {
        return response.data;
    });
}

// get one location
export const getLocationById = (loc_id) => {
    return axios.get(`${LOCATION_ROUTE}/${loc_id}`).then((response) => {
        return response.data;
    });
}

// add new location
export const addLocation = (location) => {
    const locationInfo = {
        location: location
    };

    return axios.post(`${LOCATION_ROUTE}`, locationInfo).then((response) => {
        return response.data;
    });
}