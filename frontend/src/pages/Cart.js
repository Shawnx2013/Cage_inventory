import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// components
import Navigation from "../components/Navigation/Navigation";
import CartCard from "../components/CartCard/CartCard";
import { getItemById } from "../services/Item.service";
import { getKitById } from "../services/Kit.service";
import { createKitReservation, createNewReservation } from "../services/Reservation.service";
import { getUser } from "../services/User.service";
import { sendEmail } from "../services/Email.service";
import { getReservation } from "../services/Reservation.service";
import { getUserId } from "../utils/User.profile";

function Cart() {

    // states
    const [ items, setItems ] = useState([]);
    const [ cartEmpty, setCartEmpty ] = useState(true);
    const [ isBusy, setIsBusy ] = useState(true);
    const [ modal, setModal ] = useState(false);
    const [ user, setUser ] = useState({});

    // functions
    const getItemsFromIds = () => {
        setIsBusy(true);
        setItems([]);

        if (window.sessionStorage.getItem("cart") == null) {
            setCartEmpty(true);
            return;
        } else if (window.sessionStorage.getItem("cart") === '') {
            setCartEmpty(true);
            window.sessionStorage.removeItem("cart");
        } else {
            window.sessionStorage.getItem("cart").split(/},|}/).forEach((item) => {
                if (item === '') {
                    return;
                }

                let json_item = JSON.parse(`${item + "}"}`);
                setItems(items => [...items, json_item]);
            });

            setCartEmpty(false);
            setIsBusy(false);
        }
    }

    const getUserInfo = () => {
        getUser(getUserId()).then((response) => {
            console.log(response);
            setUser(response);
        }).catch((error) => {
            console.log(error);
        });
    }

    async function sendConfirmationEmail(reservation_id) {
        // get the reservation info
        let reservation_info = await getReservation(reservation_id);

        console.log(reservation_info);

        let reservation_name = '';
        // for each item/kit in the reservation get the name and create one string
        items.forEach(item => {
            reservation_name = reservation_name + item.name + ", ";
        });

        // shape the reservation info
        let reservation = {
            name: reservation_name,
            loan_start: new Date(reservation_info.loan_start).toLocaleString(),
            loan_end: new Date(reservation_info.loan_end).toLocaleString()
        }

        // hard coding email as mine for now
        let email = user.email_address;
        let name = user.username;
        let type = 'CONFIRMATION';

        // call the service to send the message
        sendEmail(type, name, email, reservation);
    }

    const renderItemCards = () => {
        const itemCards = items.map((item, index) => {
            return <CartCard item={item} key={index} getItemsFromIds={getItemsFromIds} />
        });

        return (
            <div>
                {itemCards}
                <br />
                {!isBusy && <button type="button" className="btn btn-primary" onClick={(e) => attemptReservation()}>Confirm Reservation</button> }
            </div>
        )
    }

    const attemptReservation = () => {
        // check start and end are set
        let start = window.sessionStorage.getItem("start");
        let end = window.sessionStorage.getItem("end");

        if (start == '' || start == undefined || end == '' || end == undefined) {
            return;
        }

        start = start.slice(0, 19).replace('T', ' ');
        end = end.slice(0, 19).replace('T', ' ');

        items.forEach((item) => {
            if (item.count) {
                createKitReservation(getUserId(), start, end, items[0].id).then((reservation) => {
                    console.log(reservation);
                    // if successful show modal
                    setModal(true);
    
                    // clear cart
                    window.sessionStorage.removeItem("cart");
    
                    // reset times
                    window.sessionStorage.setItem("start", '');
                    window.sessionStorage.setItem("end", '');
                    
                    getItemsFromIds();
    
                    // tell backend to send a confirmation email
                    sendConfirmationEmail(reservation.data.id);

                    return;
                }).catch((error) => {
                    console.log(error);
                });
            }
        })

        let itemIds = [];
        items.forEach((item) => {
            itemIds.push(item.id);
        });

        // call services here
        createNewReservation(getUserId(), start, end, itemIds).then((reservation) => {
            console.log(reservation);
            // if successful show modal
            setModal(true);

            // clear cart
            window.sessionStorage.removeItem("cart");

            // reset times
            window.sessionStorage.setItem("start", '');
            window.sessionStorage.setItem("end", '');
            
            getItemsFromIds();

            // tell backend to send a confirmation email
            sendConfirmationEmail(reservation.data.id);
        }).catch((error) => {
            console.log(error);
        });
    }

    // onload stuff
    useEffect(() => {
        getItemsFromIds();
        getUserInfo();
    }, [])

    return (
        <div className="outer">
            <div><Navigation currPage='My Cart' /></div>
            <br />
            { modal &&
                <div className="modal" id="addToCartModal" tabIndex="-1">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content content-light">
                        <div className="modal-header">
                            <h5 className="modal-title text-dark" id="addToCartModal">Reservation Successfully Placed</h5>
                            <button type="button" className="close" onClick={(e) => setModal(false)}  aria-label="Close">
                            <span aria-hidden="true" className="text-dark">&times;</span>
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={(e) => setModal(false)}>Ok</button>
                        </div>
                        </div>
                    </div>
                </div>
            }
            <div className="inner">
                <div className="cart">
                    { cartEmpty ? <p>Add items to reserve from the <Link to="/inventory" className="text-primary">inventory</Link></p> : renderItemCards()}
                </div>
            </div>
        </div>
    );
}

export default Cart;