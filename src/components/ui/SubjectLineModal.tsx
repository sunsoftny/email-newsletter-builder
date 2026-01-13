'use client';
import React, { useState, useEffect } from 'react';
import { X, Lightbulb, Loader2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SubjectLineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAnalyze: () => Promise<{ subjectLines: string[]; spamScore?: number }>;
}

export const SubjectLineModal: React.FC<SubjectLineModalProps> = ({
    isOpen,
    onClose,
    onAnalyze
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{ subjectLines: string[]; spamScore?: number } | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    useEffect(() => {
        if (isOpen && onAnalyze) {
            setIsLoading(true);
            setResults(null);
            onAnalyze()
                .then(data => {
                    if (data && Array.isArray(data.subjectLines)) {
                        setResults(data);
                    } else {
                        console.error('Analysis returned invalid format:', data);
                        setResults({ subjectLines: [], spamScore: 0 });
                    }
                })
                .catch(err => {
                    console.error(err);
                    alert("Analysis failed.");
                    onClose();
                })
                .finally(() => setIsLoading(false));
        }
    }, [isOpen]);

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background w-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden border">
                {/* Header */}
                <div className="h-14 border-b px-4 flex items-center justify-between bg-muted/20">
                    <div className="flex items-center gap-2 text-primary">
                        <Lightbulb size={18} />
                        <h3 className="font-semibold">Optimize Subject Line</h3>
                    </div>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                        <X size={18} />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 min-h-[200px]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground animate-pulse">
                            <Loader2 size={32} className="mb-2 animate-spin" />
                            <p className="text-sm">Analyzing content...</p>
                        </div>
                    ) : results ? (
                        results.subjectLines.length > 0 ? (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm mb-2">
                                    <span className="font-medium">Recommended Subject Lines</span>
                                    {results.spamScore !== undefined && (
                                        <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${results.spamScore < 3 ? 'bg-green-100 text-green-700' :
                                            results.spamScore < 5 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            Spam Score: {results.spamScore}/10
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    {results.subjectLines.map((line, idx) => (
                                        <div key={idx} className="flex items-center gap-2 p-3 rounded-lg border bg-card hover:border-primary transition-colors group">
                                            <span className="flex-1 text-sm font-medium">{line}</span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleCopy(line, idx)}
                                                title="Copy to clipboard"
                                            >
                                                {copiedIndex === idx ? <Check size={14} className="text-green-600" /> : <Copy size={14} />}
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground p-4">
                                No suggestions found.
                            </div>
                        )
                    ) : (
                        <div className="text-center text-muted-foreground">
                            No result.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
