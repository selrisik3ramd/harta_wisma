import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 font-sans relative isolate">
            {/* Backdrop Image */}
            <div className="fixed inset-0 z-[-1] opacity-25">
                <img
                    src="/backdrop.jpg"
                    alt="Background"
                    className="w-full h-full object-cover"
                />
            </div>

            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className={`lg:pl-64 flex flex-col min-h-screen transition-all duration-300 relative`}>
                <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <main className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
