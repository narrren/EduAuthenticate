import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import EduAuthenticateArtifact from '../contracts/EduAuthenticate.json';
import { EDU_AUTHENTICATE_ADDRESS } from '../contracts/address';
import { Download, Share2, Linkedin, ExternalLink, Loader2, Award } from 'lucide-react';

const StudentPortal = () => {
    const { address, isConnected } = useAccount();
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isConnected || !address) return;
        fetchCertificates();
    }, [address, isConnected]);

    const fetchCertificates = async () => {
        setLoading(true);
        try {
            // Use Ethers for simple log querying
            // In production, use The Graph for better performance
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const contract = new ethers.Contract(EDU_AUTHENTICATE_ADDRESS, EduAuthenticateArtifact.abi, provider);

                // Filter: CertificateIssued(string certId, address recipient, ... )
                // recipient is the 2nd indexed argument (index 1 in args, but actually index 2 in topics because topic0 is event sig)
                const filter = contract.filters.CertificateIssued(null, address);
                const events = await contract.queryFilter(filter);

                const certs = events.map(event => ({
                    id: event.args[0], // certId
                    recipient: event.args[1], // recipient
                    docHash: event.args[2],
                    metadataURI: event.args[3], // metadataURI
                    txHash: event.transactionHash,
                    date: new Date().toLocaleDateString() // Block timestamp requires extra fetch, using current for demo or we can fetch block
                }));

                setCertificates(certs);
            }
        } catch (err) {
            console.error("Error fetching certs:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleShare = (certId) => {
        // Copy a verify link
        const url = `${window.location.origin}/verify?id=${certId}`;
        navigator.clipboard.writeText(certId);
        alert(`Certificate ID "${certId}" copied to clipboard! Share this ID with employers.`);
    };

    const handleLinkedIn = (cert) => {
        // Construct LinkedIn Add-to-Profile URL
        const linkedInUrl = `https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=Blockchain%20Certificate&organizationName=EduAuthenticate&certId=${cert.id}&issueYear=${new Date().getFullYear()}`;
        window.open(linkedInUrl, '_blank');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-slate-900 flex items-center gap-3">
                <Award className="text-brand-600" /> My Credential Wallet
            </h1>

            {!isConnected ? (
                <div className="p-12 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                    <p className="text-lg text-slate-600 mb-4">Connect your wallet to access your academic achievements.</p>
                </div>
            ) : (
                <>
                    <div className="mb-8 p-4 bg-brand-50 text-brand-900 rounded-lg flex justify-between items-center">
                        <span className="font-mono text-sm">{address}</span>
                        <span className="text-xs font-semibold bg-brand-200 px-2 py-1 rounded-full uppercase">Student</span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-600 w-8 h-8" /></div>
                    ) : certificates.length === 0 ? (
                        <div className="text-center p-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                            <p className="text-slate-500">No certificates found for this account.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {certificates.map((cert, index) => (
                                <div key={index} className="glass-card hover:shadow-xl transition-all duration-300 group">
                                    <div className="h-32 bg-gradient-to-r from-brand-500 to-indigo-600 rounded-t-xl relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="absolute bottom-4 left-4 text-white">
                                            <p className="text-xs opacity-75 uppercase tracking-wider">Credential</p>
                                            <h3 className="font-bold text-lg">Academic Certificate</h3>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="mb-4">
                                            <p className="text-sm text-slate-500 mb-1">Certificate ID</p>
                                            <p className="font-mono font-medium text-slate-800">{cert.id}</p>
                                        </div>

                                        <div className="mb-6">
                                            <p className="text-sm text-slate-500 mb-1">Status</p>
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
                                                Blockchain Verified
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3 mt-auto">
                                            <button
                                                onClick={() => handleLinkedIn(cert)}
                                                className="flex-1 btn-secondary text-xs py-2 px-3 flex items-center justify-center gap-2"
                                                title="Add to LinkedIn"
                                            >
                                                <Linkedin size={14} /> Add
                                            </button>
                                            <button
                                                onClick={() => handleShare(cert.id)}
                                                className="flex-1 btn-primary text-xs py-2 px-3 flex items-center justify-center gap-2"
                                            >
                                                <Share2 size={14} /> Share
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default StudentPortal;
