import React, { useEffect, useState } from "react";
import "./cart-card.css";

function CartCard(props) {

    const item = props.item;

    // functions
    const removeFromCart = (item_id) => {
        
        // search session storage for the item and remove it
        let cart = window.sessionStorage.getItem("cart").split(/},|}/);
        let new_cart = new Array();
        cart.forEach((cart_item) => {
            if (cart_item === '') {
                return;
            }

            let json_item = JSON.parse(`${cart_item + "}"}`);
            if (json_item.id !== item_id) {
                new_cart.push(JSON.stringify(json_item));
            }
        });

        window.sessionStorage.setItem("cart", new_cart);
        props.getItemsFromIds();
    }

    return (
        <div className="card card border-0">
            <div className="card-body">
                <h5 className="card-title">{item.name}</h5>
                <p className="card-text">Start: {new Date(window.sessionStorage.getItem("start")).toLocaleString()}</p>
                <p className="card-text">End: {new Date(window.sessionStorage.getItem("end")).toLocaleString()}</p>
                <button type="button" className="btn btn-secondary" onClick={(e) => removeFromCart(item.id)}>Remove</button>
            </div>
        </div>
    );
}

export default CartCard;