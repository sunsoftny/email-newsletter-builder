'use client';
import React, { useEffect, useState } from 'react';
import { X, FileText, Loader2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EditorState } from '@/lib/types';
import { Template } from '@/lib/db'; // We might need to duplicate this type if db code not shared in lib

interface TemplateListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoad: (state: EditorState) => void;
    fetchTemplates?: () => Promise<any[]>; // Optional external fetcher
}

export const TemplateListModal: React.FC<TemplateListModalProps> = ({ isOpen, onClose, onLoad, fetchTemplates }) => {
    const [templates, setTemplates] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            loadTemplates();
        }
    }, [isOpen]);

    const loadTemplates = async () => {
        setLoading(true);
        try {
            if (fetchTemplates) {
                const data = await fetchTemplates();
                setTemplates(data);
            } else {
                // Default API
                const res = await fetch('/api/templates');
                const data = await res.json();
                setTemplates(data);
            }
        } catch (e) {
            console.error(e);
            alert('Failed to load templates');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card border shadow-lg rounded-lg w-[600px] h-[500px] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">Load Template</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X size={18} />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <Loader2 className="animate-spin mb-2" />
                            Loading templates...
                        </div>
                    ) : templates.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <FileText size={48} className="mb-4 opacity-50" />
                            <p>No templates found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {templates.map((template) => (
                                <div key={template.id} className="flex items-center justify-between p-4 rounded-md border bg-muted/20 hover:bg-muted/40 transition-colors">
                                    <div>
                                        <h3 className="font-medium">{template.name}</h3>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(template.updatedAt).toLocaleDateString()} at {new Date(template.updatedAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <Button size="sm" onClick={() => {
                                        onLoad(template.data);
                                        onClose();
                                    }}>
                                        Load
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
