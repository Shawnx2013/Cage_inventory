import React, { useState, useEffect } from "react";
import { getAllReservations } from "../services/Reservation.service";

// components
import Navigation from "../components/Navigation/Navigation";
import ReservationContainer from "../components/ReservationContainer/ReservationContainer";

function Dashboard() {

    const [ isBusy, setBusy ] = useState(true);
    const [ upcomingReservations, setUpcomingReservations ] = useState([]);
    const [ overdueReservations, setOverdueReservations ] = useState([]);

    // functions
    const getReservationsForAllUsers = () => {
        getAllReservations().then(reservations => {
            reservations.forEach((reservation) => {
                console.log(reservation);
                const status = reservationStatus(reservation.loan_start, reservation.loan_end);
                if (status == "upcoming") {
                    setUpcomingReservations(reservations => [...reservations, reservation]);
                } else if (status == "overdue") {
                    setOverdueReservations(reservations => [...reservations, reservation]);
                }
            });

            setBusy(false);
        });
    }

    const reservationStatus = (start, end) => {
        const today = new Date();

        if (start > today.toISOString()) {
            return "upcoming";
        } else if (today.toISOString() > end) {
            return "overdue";
        } else {
            return "current";
        }
    }

    const renderUpcomingReservations = () => {
        return (
            <div className="reservation-page-half">
                <h3 className="text-primary">Upcoming Reservations</h3>
                <ReservationContainer reservations={upcomingReservations} status={"upcoming"} />
            </div>
        );
    }

    const renderOverdueReservations = () => {
        return (
            <div className="reservation-page-half">
                <h3 className="text-primary">Overdue Reservations</h3>
                <ReservationContainer reservations={overdueReservations} status={"overdue"} />
            </div>
        );
    }

    const renderReservations = () => {
        return (
            <div className="reservation-page-both">
                { renderUpcomingReservations() }
                { renderOverdueReservations() }
            </div>
        );
    }

    useEffect(() => {
        getReservationsForAllUsers();
    }, []);

    return (
        <div className="outer">
            <div><Navigation currPage='Dashboard' /></div>
            <div className="inner">
                { !isBusy && renderReservations() }
            </div>
        </div>
    );
}

export default Dashboard;