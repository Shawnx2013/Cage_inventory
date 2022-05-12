import React, { useEffect, useState } from "react";
import "./item-card.css";
import { getItemReservations, getReservation } from "../../services/Reservation.service";

function ItemCard(props) {

    // may not use this idk rn
    const item = props.item;
    const start = props.start;
    const end = props.end;

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
            cart.push(JSON.stringify(item));
            window.sessionStorage.setItem("cart", cart);
        } else {
            // if not, create the session variable using the item
            let cart = [JSON.stringify(item)];
            window.sessionStorage.setItem("cart", cart);
        }

        window.sessionStorage.setItem("start", start);
        window.sessionStorage.setItem("end", end);

        // display some sort of popup to confirm adding to cart worked
        props.setModal(true);
    }

    const getItemReserved = () => {
        getItemReservations(item.id)
            .then(res => {

                // get the reservation information and compare it to the desired time
                getReservation(res[0].reservation_id).then(res => {
                    // loan_end and loan_start
                    if (new Date(res.loan_end).toUTCString() < new Date(start).toUTCString()) {
                        setitemReserved(false);
                    }
                    else if (new Date(res.loan_start).toUTCString() > new Date(end).toUTCString()) {
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

    // state and effect stuff (idk if necessary rn)
    const [ itemReserved, setitemReserved ] = useState(true);

    // function to check if item is already in cart
    const checkIfInCart = () => {
        let valid = false;

        if (window.sessionStorage.getItem("cart")) {
            let cart = window.sessionStorage.getItem("cart").split(/},|}/);
            cart.forEach((cart_item) => {
                if (cart_item.length < 1) {
                    return false;
                }
                
                cart_item = JSON.parse(cart_item + "}");
                if (cart_item.id === item.id) {
                    valid = true;
                }
            });
        }

        return valid;
    }

    useEffect(() => {
        getItemReserved();
    }, [])

    // render
    return (
        <div className="card card border-0">
            <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                { renderAvailableUnavailable() }
                <p className="card-text">{item.type}</p>
                { renderAddCartButton() }
            </div>
        </div>
    );

    // these will be dependent on the time of the reservation selected and when the start/end date of the item reservation is
    function renderAvailableUnavailable() {if (itemReserved) {
            return (
                <h6 className="card-unavailable">Unavailable</h6>
            );
        } else {
            return(<h6 className="card-available">Available</h6>);
        }
    }

    function renderAddCartButton() {
        if (checkIfInCart()) {
            return <button type="button" className="btn btn-info denied text-light" disabled>In Cart</button>
        } else if (itemReserved) {
            return <button type="button" className="btn btn-info denied text-light" disabled>Unavailable</button>
        } else if (window.sessionStorage.getItem("role") == 2) {
            return <button type="button" className="btn btn-primary denied text-light" disabled>Add to Cart</button>
        } else {
            return <button type="button" className="btn btn-primary" onClick={(e) => addToCart()}>Add to Cart</button>
        }
    }

}

export default ItemCard;