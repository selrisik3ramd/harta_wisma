import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const MainLayout = ({ children, currentView, setCurrentView, onOpenScanner, onOpenSettings, onOpenLogin }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50/70 font-sans relative isolate selection:bg-amber-500 selection:text-white">
            {/* Modern Subtle Ambient Gradient Background */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-amber-200/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-slate-200/40 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/3 w-[400px] h-[400px] bg-yellow-100/30 rounded-full blur-[100px]" />
            </div>

            <Sidebar
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                currentView={currentView}
                setCurrentView={setCurrentView}
                onOpenSettings={onOpenSettings}
                onOpenLogin={onOpenLogin}
            />

            <div className={`lg:pl-72 flex flex-col min-h-screen transition-all duration-300 relative`}>
                <Header 
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
                    onOpenScanner={onOpenScanner}
                    onOpenLogin={onOpenLogin}
                />

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
