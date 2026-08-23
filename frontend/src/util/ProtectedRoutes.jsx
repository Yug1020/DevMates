import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../store/userSlice';
import { API_BASE_URL } from './constant.js';

const ProtectedRoutes = ({ children }) => {
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(!user); // only load if user is null

    useEffect(() => {
        // If Redux already has a user (e.g. just logged in), skip the API call
        if (user) return;

        // On page refresh: Redux resets to null, but the cookie is still valid.
        // Hit the profile endpoint to rehydrate the store.
        axios
            .get(API_BASE_URL + '/user/profile', { withCredentials: true })
            .then((res) => {
                dispatch(setUser(res.data));
            })
            .catch(() => {
                // Cookie is invalid / expired — will redirect to /login below
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        // Show a minimal loader while we verify the session
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <span>Loading...</span>
            </div>
        );
    }

    if (user) {
        return children;
    }

    return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;