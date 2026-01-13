"use client";

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import StepNavigator from './StepNavigator';
import FormCanvas from './FormCanvas';
import BlocksPanel from './panels/BlocksPanel';
import StylesPanel from './panels/StylesPanel';
import TargetingPanel from './panels/TargetingPanel';
import { Button } from '@/components/ui/button';
import { Eye, Smartphone, Save, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const FormLayout = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState<'blocks' | 'styles' | 'targeting'>('blocks');
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

    const handleSave = () => {
        // Logic to save/publish the form
        console.log("Saving form...");
    };

    return (
        <div className="flex h-full w-full bg-slate-50 overflow-hidden">
            {/* Left Sidebar - Panels */}
            <div className="w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="h-14 border-b border-slate-200 flex items-center px-4 font-semibold text-slate-800">
                    Form Builder
                </div>

                <div className="flex border-b border-slate-200">
                    <button
                        onClick={() => setActiveTab('blocks')}
                        className={cn("flex-1 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'blocks' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}
                    >
                        Blocks
                    </button>
                    <button
                        onClick={() => setActiveTab('styles')}
                        className={cn("flex-1 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'styles' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}
                    >
                        Styles
                    </button>
                    <button
                        onClick={() => setActiveTab('targeting')}
                        className={cn("flex-1 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === 'targeting' ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800")}
                    >
                        Targeting
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {activeTab === 'blocks' && <BlocksPanel />}
                    {activeTab === 'styles' && <StylesPanel />}
                    {activeTab === 'targeting' && <TargetingPanel />}
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col relative">
                {/* Top Bar */}
                <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
                    <StepNavigator />

                    <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-lg">
                        <button
                            onClick={() => setViewMode('desktop')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'desktop' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900")}
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('mobile')}
                            className={cn("p-1.5 rounded-md transition-all", viewMode === 'mobile' ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900")}
                        >
                            <Smartphone size={18} />
                        </button>
                    </div>

                    <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" onClick={() => console.log('Exit')}>Exit</Button>
                        <Button size="sm" onClick={handleSave}>Publish</Button>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 overflow-hidden relative bg-slate-100 flex items-center justify-center p-8">
                    <FormCanvas viewMode={viewMode} />
                </div>
            </div>
        </div>
    );
};

export default FormLayout;
