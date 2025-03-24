import React from "react";
import { Navigate } from "react-router-dom";

const withAuth = ({children}: { children: React.ReactNode }) => {
    const token = localStorage.getItem('RefreshToken')
    if (!token) {
        return <Navigate to="/clientLogin" replace />
    }
    return <>{children}</>
}

export default withAuth