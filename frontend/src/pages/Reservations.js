import React, { useState, useEffect } from "react";
import { getAllReservations, getUserReservations } from "../services/Reservation.service";

// components
import Navigation from "../components/Navigation/Navigation";
import ReservationContainer from "../components/ReservationContainer/ReservationContainer";
import { getUserId } from "../utils/User.profile";

function Reservations() {

    // state variables
    const [ reservations, setReservations ] = useState([]);
    const [ isBusy, setBusy ] = useState(true);

    // functions
    const getReservationsForUser = (user_id) => {
        setBusy(true);
        getUserReservations(user_id).then(reservations => {
            if (reservations.length === undefined) {
                setReservations([reservations]);
                setBusy(false);
            } else {
                setReservations(reservations);
                setBusy(false);
            }
        }).catch((error) => {
            setReservations([]);
            setBusy(false);
        })
    }

    const renderCurrentReservations = () => {
        return (
            <div className="reservation-page">
                <h3 className="text-primary">Current Reservations</h3>
                <ReservationContainer reservations={reservations} status={"current"} />
            </div>
        );
    }

    // useeffect stuff to load data
    useEffect(() => {
        getReservationsForUser(getUserId());
    }, []);

    return (
        <div className="outer">
            <div><Navigation currPage='Reservations' /></div>
            <div className="inner">
                { !isBusy && renderCurrentReservations() }
            </div>
        </div>
    );
}

export default Reservations;