import React, { useState, useCallback } from 'react';
import { useReadContract } from 'wagmi';
import { useDropzone } from 'react-dropzone';
import { ShieldCheck, XCircle, FileSearch, Loader2, UploadCloud } from 'lucide-react';
import { generateDocHash } from '../utils/hash';
import EduAuthenticateArtifact from '../contracts/EduAuthenticate.json';
import { EDU_AUTHENTICATE_ADDRESS } from '../contracts/address';

const Verify = () => {
    const [certIdInput, setCertIdInput] = useState('');
    const [docHash, setDocHash] = useState(null); // '0x...'
    const [verificationMode, setVerificationMode] = useState('ID'); // 'ID' or 'FILE'
    const [fileProcessing, setFileProcessing] = useState(false);

    // Hooks for reading contract
    const { data: certData, isError: isCertError, isLoading: isCertLoading } = useReadContract({
        address: EDU_AUTHENTICATE_ADDRESS,
        abi: EduAuthenticateArtifact.abi,
        functionName: 'verifyCertificate',
        args: [certIdInput],
        query: {
            enabled: verificationMode === 'ID' && !!certIdInput
        }
    });

    const { data: fileData, isError: isFileError, isLoading: isFileLoading } = useReadContract({
        address: EDU_AUTHENTICATE_ADDRESS,
        abi: EduAuthenticateArtifact.abi,
        functionName: 'verifyByDocHash',
        args: [docHash],
        query: {
            enabled: verificationMode === 'FILE' && !!docHash
        }

    });

    const onDrop = useCallback(async (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
            setFileProcessing(true);
            try {
                const hash = await generateDocHash(acceptedFiles[0]);
                setDocHash(hash);
                setVerificationMode('FILE');
            } catch (err) {
                console.error(err);
                alert("Error hashing file");
            } finally {
                setFileProcessing(false);
            }
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'application/pdf': ['.pdf'] } });

    // Result Display Helper
    const renderResult = () => {
        if (fileProcessing || isCertLoading || isFileLoading) {
            return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-brand-600" size={48} /></div>;
        }

        let isValid = false;
        let data = null;

        if (verificationMode === 'ID' && certData) {
            isValid = certData[0]; // bool isValid
            data = certData;
        } else if (verificationMode === 'FILE' && fileData) {
            isValid = fileData[0]; // bool isValid
        }

        if (!data && !fileData && !isCertError && !isFileError) return null; // No search yet

        if (isValid) {
            return (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-xl animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-3 rounded-full">
                            <ShieldCheck className="text-green-600 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-800">Certificate Authentic</h3>
                            <p className="text-green-700">This credential has been verified on the Polygon blockchain.</p>
                            {verificationMode === 'ID' && (
                                <p className="text-sm text-green-600 mt-1">Issued: {new Date(Number(data[3]) * 1000).toLocaleDateString()}</p>
                            )}
                        </div>
                    </div>
                </div>
            );
        } else if ((verificationMode === 'ID' && certIdInput && !isCertLoading) || (verificationMode === 'FILE' && docHash)) {
            return (
                <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-xl animate-fade-in">
                    <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-3 rounded-full">
                            <XCircle className="text-red-600 w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-red-800">Verification Failed</h3>
                            <p className="text-red-700">This certificate is either invalid, revoked, or does not exist.</p>
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-[80vh] py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Verify Credentials</h2>
                <p className="mt-4 text-lg text-slate-600">
                    Verify the authenticity of a certificate using its unique ID or by uploading the original PDF.
                </p>
            </div>

            <div className="glass-card overflow-hidden">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => setVerificationMode('ID')}
                        className={`flex-1 py-4 text-center font-medium ${verificationMode === 'ID' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Verify by ID
                    </button>
                    <button
                        onClick={() => setVerificationMode('FILE')}
                        className={`flex-1 py-4 text-center font-medium ${verificationMode === 'FILE' ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        Verify by Document
                    </button>
                </div>

                <div className="p-8">
                    {verificationMode === 'ID' ? (
                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-slate-700">Certificate ID</label>
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={certIdInput}
                                    onChange={(e) => setCertIdInput(e.target.value)}
                                    placeholder="e.g. EDU-2024-001"
                                    className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-3 border"
                                />
                            </div>
                        </div>
                    ) : (
                        <div {...getRootProps()} className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-colors ${isDragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400'}`}>
                            <input {...getInputProps()} />
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                            <p className="mt-4 text-sm text-gray-600">Drag & drop the original PDF certificate here, or click to select.</p>
                            <p className="mt-2 text-xs text-slate-400">Privacy Note: The file never leaves your browser. A cryptographic hash is generated locally.</p>
                        </div>
                    )}

                    {renderResult()}
                </div>
            </div>
        </div>
    );
};

export default Verify;
