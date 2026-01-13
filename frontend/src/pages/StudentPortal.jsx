import React from 'react';
import { useAccount } from 'wagmi';

const StudentPortal = () => {
    const { address, isConnected } = useAccount();

    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-4 text-slate-900">Student Portal</h1>

            {!isConnected ? (
                <div className="p-8 bg-blue-50 text-blue-800 rounded-xl">
                    Please connect your wallet to view your academic credentials.
                </div>
            ) : (
                <div className="space-y-6">
                    <p className="text-slate-600">
                        Welcome, <span className="font-mono bg-slate-100 p-1 rounded">{address}</span>
                    </p>

                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Placeholder for retrieved certificates */}
                        <div className="glass-card p-6 border-l-4 border-brand-500">
                            <h3 className="font-bold text-lg">Bachelor of Computer Science</h3>
                            <p className="text-sm text-slate-500 mb-4">Issued: 2024-05-20</p>
                            <div className="flex justify-between items-center">
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">Valid</span>
                                <button className="text-brand-600 text-sm font-medium hover:underline">View Details</button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-500">
                        <p>
                            Note: In a production environment, this page would query a Subgraph (The Graph) or an indexing API to retrieve all `CertificateIssued` events associated with your address.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentPortal;
