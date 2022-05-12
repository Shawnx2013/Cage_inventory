import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthed } from "../../utils/User.profile";

function ProtectedRoute({ children }) {
    const auth = isAuthed();
    
    return auth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;