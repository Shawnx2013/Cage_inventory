import React, { useEffect, useState } from "react";
import "./kit-card.css";
import { getKitReservations, getReservation } from "../../services/Reservation.service";

function KitCard(props) {

    // may not use this idk rn
    const kit = props.kit;
    const start = props.start;
    const end = props.end;

    // state and effect stuff (idk if necessary rn)
    const [ itemReserved, setitemReserved ] = useState(true);

    // functions to use
    // one for clicking the add to cart button
    const addToCart = () => {
        // is item available?
        if (itemReserved) {
            return;
        }

        // see if any items are currently in session storage, if so add this to it
        if (window.sessionStorage.getItem("cart") != null) {
            let cart = new Array(window.sessionStorage.getItem("cart"));
            cart.push(JSON.stringify(kit));
            window.sessionStorage.setItem("cart", cart);
        } else {
            // if not, create the session variable using the item
            let cart = [JSON.stringify(kit)];
            window.sessionStorage.setItem("cart", cart);
        }

        window.sessionStorage.setItem("start", start);
        window.sessionStorage.setItem("end", end);

        // display some sort of popup to confirm adding to cart worked
        props.setModal(true);
    }

    const getKitReserved = () => {
        getKitReservations(kit.id)
            .then(res => {

                // get the reservation information and compare it to the desired time
                getReservation(res[0].reservation_id).then(res => {
                    console.log(res);
                    // loan_end and loan_start
                    if (res.loan_end < start) {
                        setitemReserved(false);
                    }
                    else if (res.loan_start > end) {
                        setitemReserved(false);
                    }
                    else {
                        setitemReserved(true);
                    }
                })
                .catch(error => {
                    console.log(error);
                })
            })
            .catch(error => {
                if (error.response.status === 404) {
                    setitemReserved(false);
                }
            })
    }

    useEffect(() => {
        // getKitReserved();
        setitemReserved(true);
    }, [])

    // render
    return (
        <div className="card card border-0">
            <div className="card-body">
                <h5 className="card-title">{kit.name}</h5>
                { renderAvailableUnavailable() }
                <p className="card-text">kit</p>
                { renderAddCartButton() }
            </div>
        </div>
    );

    // these will be dependent on the time of the reservation selected and when the start/end date of the item reservation is
    function renderAvailableUnavailable() {
        if (itemReserved) {
            return (
                <h6 className="card-unavailable">Unavailable</h6>
            );
        } else {
            return(<h6 className="card-available">Available</h6>);
        }
    }

    function renderAddCartButton() {
        if (itemReserved) {
            return <button type="button" className="btn btn-info denied text-light" disabled>Unavailable</button>
        } else if (window.sessionStorage.getItem("role") == 2) {
            return <button type="button" className="btn btn-primary denied text-light" disabled>Add to Cart</button>
        } else {
            return <button type="button" className="btn btn-primary" onClick={(e) => addToCart()}>Add to Cart</button>
        }
    }

}

export default KitCard;