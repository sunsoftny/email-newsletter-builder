'use client';
import React, { useState } from 'react';
import { X, Sparkles, Loader2, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EditorState } from '@/lib/types';

interface AiLayoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newState: EditorState) => void;
    onGenerate: (prompt: string) => Promise<EditorState>;
}

export const AiLayoutModal: React.FC<AiLayoutModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    onGenerate
}) => {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;
        setIsLoading(true);
        try {
            const newState = await onGenerate(prompt);
            onSuccess(newState);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to generate layout');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background w-[600px] rounded-xl shadow-2xl flex flex-col overflow-hidden border">
                {/* Header */}
                <div className="h-14 border-b px-4 flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-2 text-primary">
                        <Sparkles size={18} />
                        <h3 className="font-semibold">Magic Layout Generator</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X size={18} />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>What would you like to build?</Label>
                        <div className="relative">
                            <textarea
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="e.g. 'A monthly newsletter for a tech startup. Include a hero section with a big announcement, a product showcase with 3 items, and a footer with social links.'"
                                disabled={isLoading}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                                        handleGenerate();
                                    }
                                }}
                            />
                            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                ⌘+Enter to generate
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleGenerate} disabled={!prompt || isLoading} className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Magic Build
                        </Button>
                    </div>

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground animate-pulse">
                            <LayoutTemplate size={48} className="mb-4 opacity-50" />
                            <p className="font-medium">Constructing your layout...</p>
                            <p className="text-xs">This might take a few seconds</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
