import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FileCheck, School } from 'lucide-react';

const Landing = () => {
    return (
        <div className="relative isolate overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-500 to-secondary opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
            </div>

            <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
                <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8">
                    <h1 className="mt-10 text-4xl font-bold tracking-tight text-slate-900 sm:text-6xl animate-fade-in">
                        Immutable Academic Credentials
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-slate-600 animate-slide-up">
                        Issue, manage, and verify certificates with the security of the Polygon blockchain.
                        Tamper-proof, privacy-focused, and instantly verifiable.
                    </p>
                    <div className="mt-10 flex items-center gap-x-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <Link to="/verify" className="btn-primary flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" />
                            Verify Certificate
                        </Link>
                        <Link to="/admin" className="btn-secondary flex items-center gap-2">
                            <School className="w-5 h-5" />
                            For Institutions
                        </Link>
                    </div>
                </div>

                {/* Hero Visual */}
                <div className="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mt-0 lg:mr-0 lg:max-w-none lg:flex-none xl:ml-32">
                    <div className="max-w-3xl flex-none sm:max-w-5xl lg:max-w-none">
                        <div className="-m-2 rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                            <div className="glass-card p-6 md:p-8 min-w-[300px] md:min-w-[500px]">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-12 w-12 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                                        <FileCheck size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-lg">Certificate Valid</h3>
                                        <p className="text-sm text-green-600">Verified on Polygon Amoy</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="h-2 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-2 bg-slate-100 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Landing;
