import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen((open) => !open);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar: overlays on mobile, always open on desktop */}
            <Sidebar open={sidebarOpen} onClose={closeSidebar} />
            {/* Overlay for mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden" onClick={closeSidebar}></div>
            )}
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-2 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout; 