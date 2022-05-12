import React from "react";
import { Navigate } from "react-router-dom";

// components
import { getRole } from "../utils/User.profile";

function Home() {
    // this will handle navigating to the correct page based on the user role (definitely could just be added to the login page)
    const role = getRole();

    if (parseInt(role) === 2) {
        return <Navigate to="/dashboard" />;
    } else if (parseInt(role) === 1) {
        return <Navigate to="/reservations" />;
    } else {
        return <Navigate to="/reservations" />;
    }
}

export default Home;