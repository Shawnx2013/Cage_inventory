import { RESERVATION_ROUTE, CHECKOUT_ROUTE } from "../constants/api-routes";
import axios from "axios";

// function to get the reservations for an item (or return 404 for none)
export const getItemReservations = (item_id) => {
    return axios.get(`${RESERVATION_ROUTE}/item/${item_id}`).then((response) => {
        return response.data;
    });
}

export const getKitReservations = (kit_id) => {
    return axios.get(`${RESERVATION_ROUTE}/kit/${kit_id}`).then((response) => {
        return response.data;
    });
}

// get reservations for a user
export const getUserReservations = (user_id) => {
    return axios.get(`${RESERVATION_ROUTE}/usr/${user_id}`).then((response) => {
        return response.data;
    });
}

// create a new reservation
export const createNewReservation = (user_id, start, end, items) => {
    const reservation_info = {
        user_id: user_id,
        loan_start: start,
        loan_end: end,
        items: items
    };

    return axios.post(`${RESERVATION_ROUTE}`, reservation_info).then((response) => {
        return response;
    });
}

export const createKitReservation = (user_id, start, end, kit_id) => {
    const kit_info = {
        user_id: user_id,
        loan_start: start,
        loan_end: end,
        kit: kit_id
    }

    return axios.post(`${RESERVATION_ROUTE}/kit`, kit_info).then((response) => {
        return response;
    });
}

// get a single reservation info
export const getReservation = (res_id) => {
    return axios.get(`${RESERVATION_ROUTE}/${res_id}`).then((response) => {
        return response.data;
    })
}

// get all reservations
export const getAllReservations = () => {
    return axios.get(`${RESERVATION_ROUTE}`).then((response) => {
        return response.data;
    })
}

// get all checked out
export const getAllCheckedOut = () => {
    return axios.get(`${CHECKOUT_ROUTE}`).then((response) => {
        return response.data;
    })
}

// get a single checked out info
export const getCheckedOut = (res_id) => {
    return axios.get(`${CHECKOUT_ROUTE}/${res_id}`).then((response) => {
        return response.data;
    })
}

// checkout
export const checkout = (res) => {
    return axios.post(`${RESERVATION_ROUTE}/checkout`, res).then((response) => {
        return response.data;
    });
}

// checkin
export const checkIn = (id) => {
    // const data = {
    //     reservation_id: reservation,
    //     checkout_id: checkout
    // }
    return axios.delete(`${RESERVATION_ROUTE}/checkin/${id}`).then((response) => {
        return response;
    });
}