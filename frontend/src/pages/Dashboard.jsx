import React from 'react';
import Header from '../components/Header';
import Home from '../components/Home';
import Connections from '../components/Connections';
import Profile from '../components/Profile';
import Error from '../components/Error';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';

const Dashboard = () => {
    return (
        <div>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="network" element={<Connections />} />
                <Route path="profile" element={<Profile />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </div>
    );
};

export default Dashboard;
