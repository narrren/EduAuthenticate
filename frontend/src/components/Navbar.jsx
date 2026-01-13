import React from 'react';
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { ShieldCheck } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="p-2 bg-brand-50 rounded-lg group-hover:bg-brand-100 transition-colors">
                            <ShieldCheck className="w-6 h-6 text-brand-600" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">EduAuthenticate</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/verify" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Verify Credential</Link>
                        <Link to="/student" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Student Portal</Link>
                        <Link to="/admin" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">Registrar Access</Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ConnectButton showBalance={false} accountStatus="avatar" chainStatus="icon" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
