import axios from "axios";
import { EMAIL_ROUTE } from "../constants/api-routes";

// send a post request to send an email
// body requires: type, name, email address, reservation info
// type is CONFIRMATION, CHECKOUT, or CHECKIN
// reservation contains: name, loan_start, loan_end
export const sendEmail = (type, name, address, reservation) => {
    const emailInfo = {
        type: type,
        name: name,
        email: address,
        reservation: [ reservation ]
    };

    console.log(emailInfo);

    return axios.post(`${EMAIL_ROUTE}`, emailInfo).then((response) => {
        return response.body;
    }).catch((error) => {
        console.log(error);
    });
}