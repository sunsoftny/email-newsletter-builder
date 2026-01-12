'use client';
import React, { useEffect, useState } from 'react';
import { generateHtml } from '@/lib/export';
import { EditorState } from '@/lib/types';
import { X, Smartphone, Monitor, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    editorState: EditorState;
    onSendTestEmail?: (email: string, html: string) => Promise<void>;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose, editorState, onSendTestEmail }) => {
    const [html, setHtml] = useState<string>('');
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [testEmail, setTestEmail] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSendTest = async () => {
        if (!onSendTestEmail || !testEmail) return;
        setIsSending(true);
        try {
            await onSendTestEmail(testEmail, html);
            alert(`Test sent to ${testEmail}`);
        } catch (e) {
            console.error(e);
            alert("Failed to send test email");
        } finally {
            setIsSending(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            const generatedHtml = generateHtml(editorState);
            setHtml(generatedHtml);
        }
    }, [isOpen, editorState]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-sm animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="h-14 border-b flex items-center justify-between px-6 bg-background">
                <div className="flex items-center gap-4">
                    <h2 className="font-semibold text-lg">Preview</h2>
                    <div className="flex items-center bg-muted rounded-lg p-1">
                        <Button
                            variant={viewMode === 'desktop' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('desktop')}
                        >
                            <Monitor size={14} className="mr-2" />
                            Desktop
                        </Button>
                        <Button
                            variant={viewMode === 'mobile' ? 'secondary' : 'ghost'}
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => setViewMode('mobile')}
                        >
                            <Smartphone size={14} className="mr-2" />
                            Mobile
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {onSendTestEmail && (
                        <div className="flex items-center gap-2 mr-4">
                            <Input
                                placeholder="Test email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className="h-8 w-48 text-xs"
                            />
                            <Button size="sm" onClick={handleSendTest} disabled={isSending || !testEmail}>
                                {isSending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="mr-2" />}
                                Send
                            </Button>
                        </div>
                    )}
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X size={20} />
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-slate-100 flex justify-center p-8">
                <div
                    className={`bg-white shadow-2xl transition-all duration-300 origin-top overflow-hidden border border-slate-200
                        ${viewMode === 'mobile' ? 'w-[375px] h-[812px] rounded-[40px] border-8 border-slate-800' : 'w-[800px] h-full rounded-lg'}
                    `}
                >
                    <iframe
                        srcDoc={html}
                        className={`w-full h-full bg-white ${viewMode === 'mobile' ? 'rounded-[32px]' : ''}`}
                        title="Preview"
                        sandbox="allow-same-origin"
                    />
                </div>
            </div>
        </div>
    );
};
