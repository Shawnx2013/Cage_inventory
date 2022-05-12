import axios from "axios";
import { USER_ROUTE } from "../constants/api-routes";

// /auth for login
// /:id for user specific info

// get all users
export const getAllUsers = () => {
    return axios.get(`${USER_ROUTE}`).then((response) => {
        return response.data;
    });
}

// get info for user by id
export const getUser = (id) => {
    return axios.get(`${USER_ROUTE}/${id}`).then((response) => {
        return response.data;
    }).catch((error) => {
        console.log(error);
    })
}

// login user
export const attemptLogin = (user, pwd) => {
    const userInfo = { username: user, password: pwd };
    console.log(document.session)
    return axios.post(`${USER_ROUTE}/auth`, userInfo);
}