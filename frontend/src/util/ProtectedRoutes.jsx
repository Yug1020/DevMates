import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../store/userSlice';
import { API_BASE_URL } from './constant.js';

const ProtectedRoutes = () => {
    // 1. Check if the user is in the Redux store
    const user = useSelector((store) => store.user);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(!user);

    useEffect(() => {
        if (user) return;

        // 2. Page refresh logic: fetch user data if Redux is empty
        axios
            .get(API_BASE_URL + '/user/profile', { withCredentials: true })
            .then((res) => {
                dispatch(setUser(res.data));
            })
            .catch(() => {
                // Session expired or invalid cookie
            })
            .finally(() => {
                setLoading(false);
            });
    }, [user, dispatch]);

    // 3. Show loader while checking credentials on refresh
    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-100vh'>
                <span>Loading...</span>
            </div>
        );
    }

    // 4. If user exists, render the active child route layout using Outlet
    if (user) {
        return <Outlet />;
    }

    // 5. Kick unauthenticated users back to login
    return <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
