'use client';
import React, { useState } from 'react';
import { X, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AiImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (url: string) => void;
    onGenerate: (prompt: string) => Promise<string>;
}

export const AiImageModal: React.FC<AiImageModalProps> = ({
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
            const result = await onGenerate(prompt);
            onSuccess(result);
            onClose();
        } catch (error) {
            console.error(error);
            alert('Failed to generate image');
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
                        <h3 className="font-semibold">AI Image Generator</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X size={18} />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label>Describe the image</Label>
                        <div className="flex gap-2">
                            <Input
                                value={prompt}
                                onChange={e => setPrompt(e.target.value)}
                                placeholder="e.g. 'A futuristic city skyline at sunset'"
                                disabled={isLoading}
                                onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={handleGenerate} disabled={!prompt || isLoading}>
                            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                            Generate
                        </Button>
                    </div>

                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-6 text-muted-foreground animate-pulse">
                            <ImageIcon size={32} className="mb-2" />
                            <p className="text-sm">Creating your masterpiece...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
