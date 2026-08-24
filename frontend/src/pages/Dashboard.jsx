import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

const Dashboard = () => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    return (
        <div>
            {/* Layout stays consistent across sub-pages */}
            <Header />
            <Sidebar
              mobileOpen={mobileSidebarOpen}
              onCloseMobile={() => setMobileSidebarOpen(false)}
            />
            
            {/* Dynamic pages content slots here */}
            <main className="lg:ml-[15.25rem]">
                <Outlet />
            </main>
        </div>
    );
};

export default Dashboard;
