import { logout } from "../utils/User.profile";
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function Logout() {
    
    useEffect(() => {
        logout();
    }, []);

    return <Navigate to='/login' />

}

export default Logout;