import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col pt-16 bg-slate-50 text-slate-900 font-sans">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="bg-white border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-500 text-sm">
                        &copy; {new Date().getFullYear()} EduAuthenticate. Secured by Ethereum.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
