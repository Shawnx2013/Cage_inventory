import React from "react";
import "./reservation-container.css";
import ReservationCard from "./ReservationCard/ReservationCard";

function ReservationContainer(props) {

    const reservations = props.reservations;
    const status = props.status;

    return (
        <div className="reservation-card-container">
            { reservations.length > 0 && reservations.map((reservation) => {
                return <ReservationCard reservation={reservation} status={status} key={`reservation-${reservation.id}`} {...props} />
            })}
        </div>
    );
}

export default ReservationContainer;