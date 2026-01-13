'use client';
import React, { useState } from 'react';
import { X, Sparkles, Loader2, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AiTextModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (text: string) => void;
    currentText: string;
    onGenerate: (mode: 'rewrite' | 'fix' | 'shorten' | 'expand' | 'tone', text: string, prompt?: string) => Promise<string>;
}

export const AiTextModal: React.FC<AiTextModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    currentText,
    onGenerate
}) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [customMode, setCustomMode] = useState(false);

    const handleGenerate = async (mode: 'rewrite' | 'fix' | 'shorten' | 'expand' | 'tone') => {
        setIsLoading(true);
        try {
            const result = await onGenerate(mode, currentText, prompt);
            onSuccess(result);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to generate text');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background w-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden border">
                {/* Header */}
                <div className="h-14 border-b px-4 flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-2 text-primary">
                        <Sparkles size={18} />
                        <h3 className="font-semibold">AI Assistant</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X size={18} />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Quick Actions</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" className="justify-start" onClick={() => handleGenerate('fix')} disabled={isLoading}>
                                <Wand2 size={14} className="mr-2" />
                                Fix Grammar
                            </Button>
                            <Button variant="outline" className="justify-start" onClick={() => handleGenerate('shorten')} disabled={isLoading}>
                                <Wand2 size={14} className="mr-2" />
                                Shorten
                            </Button>
                            <Button variant="outline" className="justify-start" onClick={() => handleGenerate('expand')} disabled={isLoading}>
                                <Wand2 size={14} className="mr-2" />
                                Expand
                            </Button>
                            <Button variant="outline" className="justify-start" onClick={() => handleGenerate('tone')} disabled={isLoading}>
                                <Wand2 size={14} className="mr-2" />
                                Make Professional
                            </Button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">Or custom prompt</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Custom Instruction</Label>
                        <div className="flex gap-2">
                            <Input
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="e.g. 'Rewrite this to be more exciting'"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={() => handleGenerate('rewrite')}
                                disabled={!prompt || isLoading}
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
