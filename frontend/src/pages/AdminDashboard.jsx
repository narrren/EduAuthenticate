import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { generateCertIdHash } from '../utils/hash';
import EduAuthenticateArtifact from '../contracts/EduAuthenticate.json';
// import { EDU_AUTHENTICATE_ADDRESS } from '../contracts/address';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { ethers } from 'ethers';

// HARDCODED TO FIX IMPORT ISSUE
const EDU_AUTHENTICATE_ADDRESS = "0x9fE46736679d2D9a65F0992F22722dE9f3c7fa6e0";

const AdminDashboard = () => {
    const { address, isConnected } = useAccount();
    const [activeTab, setActiveTab] = useState('issue');

    // Single Issue State - Default Values
    const [issueForm, setIssueForm] = useState({
        certId: '',
        docHash: '',
        recipient: '',
        metadataURI: 'ipfs://QmDefaultMetadataURI'
    });

    // File Upload Handler for Auto-Hashing
    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                const arrayBuffer = await file.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = '0x' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                setIssueForm(prev => ({ ...prev, docHash: hashHex }));
            } catch (err) {
                console.error("Hashing failed", err);
            }
        }
    };

    // Revoke State
    const [revokeForm, setRevokeForm] = useState({ certId: '', reason: '' });

    const { data: hash, writeContract, error: writeError, isPending: isWritePending } = useWriteContract();
    const { isLoading: isTxLoading, isSuccess: isTxSuccess } = useWaitForTransactionReceipt({ hash });

    // Debug State
    const [debugMsg, setDebugMsg] = useState('');

    const handleIssue = async (e) => {
        e.preventDefault();
        setDebugMsg("Starting process...");

        try {
            if (!writeContract) {
                setDebugMsg("Error: writeContract not available. Connect wallet?");
                return;
            }

            setDebugMsg(`Using Address: ${EDU_AUTHENTICATE_ADDRESS}. Sending tx...`);

            writeContract({
                address: EDU_AUTHENTICATE_ADDRESS,
                abi: EduAuthenticateArtifact.abi,
                functionName: 'issueCertificate',
                args: [issueForm.certId, issueForm.docHash, issueForm.recipient || '0x0000000000000000000000000000000000000000', issueForm.metadataURI],
            }, {
                onError: (err) => setDebugMsg(`Tx Failed: ${err.message}`),
            });

        } catch (err) {
            console.error(err);
            setDebugMsg(`Unexpected Error: ${err.message}`);
        }
    };

    const handleRevoke = async (e) => {
        e.preventDefault();
        writeContract({
            address: ethers.getAddress(EDU_AUTHENTICATE_ADDRESS),
            abi: EduAuthenticateArtifact.abi,
            functionName: 'revokeCertificate',
            args: [revokeForm.certId, revokeForm.reason],
        });
    };

    if (!isConnected) {
        return <div className="p-12 text-center">Please connect your administrative wallet.</div>;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Registrar Dashboard</h1>

            <div className="flex gap-4 mb-8">
                <button onClick={() => setActiveTab('issue')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'issue' ? 'bg-brand-600 text-white' : 'bg-white hover:bg-slate-50'}`}>Issue Certificate</button>
                <button onClick={() => setActiveTab('batch')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'batch' ? 'bg-brand-600 text-white' : 'bg-white hover:bg-slate-50'}`}>Batch Issue</button>
                <button onClick={() => setActiveTab('revoke')} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'revoke' ? 'bg-red-600 text-white' : 'bg-white hover:bg-red-50 text-red-600'}`}>Revoke</button>
            </div>

            <div className="glass-card p-8">
                {isWritePending && <div className="mb-4 text-blue-600 flex items-center gap-2"><Loader2 className="animate-spin" /> Confirming in Wallet...</div>}
                {isTxLoading && <div className="mb-4 text-blue-600 flex items-center gap-2"><Loader2 className="animate-spin" /> Transaction Processing...</div>}
                {isTxSuccess && <div className="mb-4 text-green-600 flex items-center gap-2"><CheckCircle /> Access Successful</div>}

                {/* Debug Message Box */}
                {debugMsg && (
                    <div className="mb-6 p-4 bg-slate-900 text-white font-mono text-sm rounded-lg whitespace-pre-wrap break-all border-l-4 border-yellow-500 shadow-lg">
                        <strong className="text-yellow-400 block mb-1">DEBUG LOG:</strong>
                        {debugMsg}
                    </div>
                )}

                {writeError && <div className="mb-4 text-red-600 flex items-center gap-2"><AlertCircle /> {writeError.shortMessage || writeError.message}</div>}

                {activeTab === 'issue' && (
                    <form onSubmit={handleIssue} className="space-y-6 max-w-2xl">
                        <h2 className="text-xl font-semibold">Issue Single Certificate</h2>
                        <div>
                            <label className="block text-sm font-medium mb-1">Certificate ID (Unique)</label>
                            <input className="w-full p-2 border rounded" value={issueForm.certId} onChange={e => setIssueForm({ ...issueForm, certId: e.target.value })} placeholder="EDU-2024-X" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Document Hash</label>
                            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept=".pdf,.png,.jpg"
                                />
                                <div className="text-slate-600">
                                    <p className="font-medium">Click to upload or drag and drop</p>
                                    <p className="text-sm mt-1">PDF, PNG, JPG (Auto-hashing)</p>
                                </div>
                            </div>
                            {issueForm.docHash && (
                                <div className="mt-2">
                                    <label className="block text-xs text-slate-500 mb-1">Generated Hash</label>
                                    <input className="w-full p-2 border rounded bg-slate-50 text-sm font-mono text-slate-600" value={issueForm.docHash} readOnly />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Recipient Address (Optional)</label>
                            <input className="w-full p-2 border rounded" value={issueForm.recipient} onChange={e => setIssueForm({ ...issueForm, recipient: e.target.value })} placeholder="Defaults to 0x0...0 if empty" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Metadata URI (IPFS)</label>
                            <input className="w-full p-2 border rounded" value={issueForm.metadataURI} onChange={e => setIssueForm({ ...issueForm, metadataURI: e.target.value })} placeholder="ipfs://..." />
                        </div>
                        <button type="submit" className="btn-primary" disabled={isWritePending || isTxLoading}>Issue Certificate</button>
                    </form>
                )}

                {activeTab === 'revoke' && (
                    <form onSubmit={handleRevoke} className="space-y-6 max-w-2xl">
                        <h2 className="text-xl font-semibold text-red-700">Revoke Certificate</h2>
                        <div className="bg-red-50 p-4 rounded border border-red-100 text-sm text-red-800 mb-4">
                            Warning: Revocation is permanent. The certificate will be marked as invalid on-chain.
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Certificate ID</label>
                            <input className="w-full p-2 border rounded" value={revokeForm.certId} onChange={e => setRevokeForm({ ...revokeForm, certId: e.target.value })} placeholder="EDU-2024-X" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Reason</label>
                            <input className="w-full p-2 border rounded" value={revokeForm.reason} onChange={e => setRevokeForm({ ...revokeForm, reason: e.target.value })} placeholder="e.g. Plagiarism detected" required />
                        </div>
                        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors" disabled={isWritePending || isTxLoading}>Revoke Certificate</button>
                    </form>
                )}

                {activeTab === 'batch' && (
                    <div className="text-center py-12 text-slate-500">
                        <p>Batch Issuance UI (CSV Upload) would be implemented here.</p>
                        <p className="text-xs mt-2">Requires parsing CSV to Arrays and calling issueBatch().</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
