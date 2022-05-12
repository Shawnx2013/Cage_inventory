import React, { useState, useEffect } from "react";
import { getAllReservations, getAllCheckedOut, checkIn, checkout, getCheckedOut, getReservation } from "../services/Reservation.service";
import { sendEmail } from "../services/Email.service";
import { getUser } from "../services/User.service";

// components
import Navigation from "../components/Navigation/Navigation";
import ReservationContainer from "../components/ReservationContainer/ReservationContainer";
import { getUserId } from "../utils/User.profile";
import { getItemById } from "../services/Item.service";

function Checkin() {

    const [ isBusy, setBusy ] = useState(true);
    const [ allReservations, setReservations ] = useState([]);
    const [ allCheckedOut, setCheckedOut ] = useState([]);

    // functions
    const getReservationsForAllUsers = () => {
        getAllReservations().then(reservations => {
            setReservations(reservations);
            checkReservations();
            setBusy(false);
        });
    }

    async function sendCheckoutEmail(checkout_id) {
        // get the reservation info
        let reservation_info = await getReservation(checkout_id);

        console.log(reservation_info);

        let reservation_name = '';

        // shape the reservation info
        let reservation = {
            name: reservation_name,
            checkout_date: new Date()
        }

        let user = await getUser(reservation_info.user_id);
        let email = user.email_address;
        let name = user.username;
        let type = 'CHECKOUT';

        // call the service to send the message
        sendEmail(type, name, email, reservation);
    }

    async function sendCheckinEmail(checkin_info) {
        console.log(checkin_info);
        let reservation_obj = await getItemById(checkin_info.items[0]);

        // shape the reservation info
        let reservation = {
            name: reservation_obj.name
        }

        let user = await getUser(checkin_info.user_id);
        let email = user.email_address;
        let name = user.username;
        let type = 'CHECKIN';

        // call the service to send the message
        sendEmail(type, name, email, reservation);
    }

    const getCheckedOutForAllUsers = () => {
        setBusy(true);
        getAllCheckedOut().then(reservations => {
            // console.log(reservations);
            setCheckedOut(reservations);
            getReservationsForAllUsers();
            setBusy(false);
        });
    }

    async function checkReservations() {
        let tempRes = [];

        let all_res = await getAllReservations();
        let all_out = await getAllCheckedOut();

        all_res.forEach(reservation => {
            if (all_out.find((out) => { return out.reservation_id === reservation.id}) === undefined) {
                tempRes.push(reservation);
            }
        });

        if (tempRes.length > 0) {
            setReservations(tempRes);
        }

        console.log(all_out);

        setCheckedOut(all_out);
        setBusy(false);
    }

    const checkoutItem = (info) => {
        let tempRes = [];
        allReservations.forEach(reservation => {
            if (reservation.id !== info.reservation_id) {
                tempRes.push(reservation);
            }
        });
        // console.log(tempRes);
        setReservations(tempRes);

        checkout(info).then((response) => {
            sendCheckoutEmail(info.reservation_id);
            checkReservations();
        }).catch(error => {
            console.log(error);
        });
    }

    async function checkinItem(reservation_id, checkin_id) {
        let tempRes = [];

        allCheckedOut.forEach(out => {
            if (out.id === checkin_id) {
                return;
            } else {
                tempRes.push(out);
            }
        });

        // setCheckedOut(tempRes);  

        // get the reservation info
        let reservation_info = await getReservation(reservation_id);

        checkIn(checkin_id).then((response) => {
            console.log(response);
            checkReservations();
            sendCheckinEmail(reservation_info);
        }).catch((error) => {
            console.log(error);
        });
    }

    const renderCheckOut = () => {
        return (
            <div className="reservation-page-half">
                <h3 className="text-primary">Check Out</h3>
                <ReservationContainer reservations={allReservations} status={"checkout"} checkout={checkoutItem} />
            </div>
        );
    }

    const renderCheckIn = () => {
        return (
            <div className="reservation-page-half">
                <h3 className="text-primary">Check In</h3>
                <ReservationContainer reservations={allCheckedOut} status={"checkin"} checkIn={checkinItem} />
            </div>
        );
    }

    const renderAll = () => {
        return (
            <div className="reservation-page-both">
                { renderCheckOut() }
                { renderCheckIn() }
            </div>
        );
    }

    useEffect(() => {
        checkReservations();
    }, []);

    return (
        <div className="outer">
            <div><Navigation currPage='Check In/Out' /></div>
            <div className="inner">
                { !isBusy && renderAll() }
            </div>
        </div>
    );
}

export default Checkin;