import React, { useEffect, useState } from "react";
import "./reservation-card.css";
import { getReservation } from "../../../services/Reservation.service";
import { getItemById } from "../../../services/Item.service";

function ReservationCard(props) {

    const reservation = props.reservation;
    const status = props.status;

    const [ resWithItems, setResWithItems ] = useState({});
    const [ itemNames, setItemNames ] = useState([]);
    const [ items, setItems ] = useState([]);

    // functions
    const renderReservationStatus = () => {
        if (status == "current") {
            return <p className="card-text text-primary">Due: {new Date(reservation.loan_end).toLocaleString()}</p>;
        } else if (status == "upcoming") {
            return <p className="card-text text-primary">Starting: {new Date(reservation.loan_start).toLocaleString()}</p>;
        } else if (status == "overdue") {
            return <p className="card-text text-primary">Ended: {new Date(reservation.loan_end).toLocaleString()}</p>;
        } else if (status === "checkout" || status === "checkin" ) {
            return <p className="card-text text-primary">User: {reservation.user_id}</p>;
        }
    }

    const getReservationInfo = () => {
        if (status === "checkin") {
            getReservation(reservation.reservation_id).then((info) => {
                setResWithItems(info);
                getItemNames(info.items);
                setItems(info.items);
            });
        } else {
            getReservation(reservation.id).then((info) => {
                setResWithItems(info);
                getItemNames(info.items);
                setItems(info.items);
            });
        }
    }

    const getCheckOut = () => {
        let d = new Date(); 
		let NoTimeDate = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate(); 

        return {
            reservation_id: reservation.id,
            user_id: reservation.user_id,
            checkout_date: NoTimeDate,
            items: items
        };
    }

    const getItemNames = (items) => {
        setItemNames([]);
        items.forEach(item_id => {
            getItemById(item_id).then((info) => {
                setItemNames(names => [...names, info.name]);
            });
        });
    }

    const renderItemsList = () => {
        if (resWithItems.items === undefined) {
            return;
        }

        const itemsList = itemNames.map((name, index) => {
            return <li className="text-light" key={index}>{ name }</li>;
        });

        return (
            <ul>
                { itemsList }
            </ul>
        );
    }

    const renderButton = () => {
        if (status == "checkin") {
            return <button type="button" className="btn btn-primary text-light" onClick={(e) => { props.checkIn(reservation.reservation_id, reservation.id) }}>Check In</button>
        } else if (status == "checkout"){
            return <button type="button" className="btn btn-primary text-light" onClick={(e) => { props.checkout(getCheckOut()) }}>Check Out</button>
        }
        
    }

    useEffect(() => {
        getReservationInfo();
    }, []);

    return (
        <div className="card card border-0 reservation-container-card">
            <div className="card-body">
                {(status === "checkin") ? <h5 className="card-title">Reservation #{reservation.reservation_id}</h5> : <h5 className="card-title">Reservation #{resWithItems.id}</h5>}
                { renderReservationStatus() }
                { renderItemsList() }
                { renderButton() }
            </div>
        </div>
    );
}

export default ReservationCard;