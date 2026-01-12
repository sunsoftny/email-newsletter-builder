'use client';
import React from 'react';
import { Undo, Redo, Eye, Save, Download, Mail, ChevronDown, FileText, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { generateHtml } from '@/lib/export';
import { undo, redo, loadState } from '@/store/editorSlice';
import { PreviewModal } from '@/components/ui/PreviewModal';
import { TemplateListModal } from '@/components/ui/TemplateListModal';

interface HeaderProps {
    onSave?: (data: any) => Promise<void>;
    onLoad?: () => Promise<any[]>; // Return array of templates
    onSendTestEmail?: (email: string, html: string) => Promise<void>;
}

export const Header: React.FC<HeaderProps> = ({ onSave, onLoad, onSendTestEmail }) => {
    const dispatch = useDispatch();
    const editorState = useSelector((state: RootState) => state.editor);
    const { past, future } = editorState.history;

    const handleUndo = () => dispatch(undo());
    const handleRedo = () => dispatch(redo());

    const handleExport = () => {
        const html = generateHtml(editorState);
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'newsletter.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleSave = async () => {
        if (onSave) {
            try {
                await onSave(editorState);
                alert('Saved successfully!');
            } catch (e) {
                console.error(e);
                alert('Error saving.');
            }
            return;
        }

        try {
            const response = await fetch('/api/templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: 'My Newsletter',
                    data: editorState
                })
            });
            if (response.ok) {
                alert('Template saved successfully!');
            } else {
                alert('Failed to save template');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Error saving template');
        }
    };

    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [isTemplatesOpen, setIsTemplatesOpen] = React.useState(false);

    return (
        <>
            <header className="h-16 border-b flex items-center justify-between px-6 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                            <Mail size={18} />
                        </div>
                        <span className="font-semibold text-lg tracking-tight">MailBuilder</span>
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <Input
                        type="text"
                        defaultValue="Untitled Newsletter"
                        className="border-transparent hover:border-input focus:border-input bg-transparent w-[200px] h-9 px-2 font-medium"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setIsTemplatesOpen(true)}>
                            <FileText size={16} className="mr-2" />
                            Templates
                        </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <div className="flex items-center mr-2">
                        <Button variant="ghost" size="icon" title="Undo" onClick={handleUndo} disabled={past.length === 0}>
                            <Undo size={16} className="text-muted-foreground" />
                        </Button>
                        <Button variant="ghost" size="icon" title="Redo" onClick={handleRedo} disabled={future.length === 0}>
                            <Redo size={16} className="text-muted-foreground" />
                        </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <div className="flex items-center bg-muted rounded-lg p-1 mr-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => dispatch({ type: 'editor/updateCanvasSettings', payload: { width: 600 } })}
                            title="Desktop View"
                        >
                            <Monitor size={14} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() => dispatch({ type: 'editor/updateCanvasSettings', payload: { width: 375 } })}
                            title="Mobile View"
                        >
                            <Smartphone size={14} />
                        </Button>
                    </div>

                    <Separator orientation="vertical" className="h-6 mx-2" />

                    <Button variant="ghost" size="sm" className="hidden sm:flex gap-2" onClick={() => setIsPreviewOpen(true)}>
                        <Eye size={16} />
                        Preview
                    </Button>

                    <Button variant="outline" size="sm" className="hidden sm:flex gap-2" onClick={handleSave}>
                        <Save size={16} />
                        Save
                    </Button>

                    <Button size="sm" className="gap-2" onClick={handleExport}>
                        <Download size={16} />
                        Export
                    </Button>
                </div>
            </header>

            <PreviewModal
                isOpen={isPreviewOpen}
                onClose={() => setIsPreviewOpen(false)}
                editorState={editorState}
                onSendTestEmail={onSendTestEmail}
            />

            <TemplateListModal
                isOpen={isTemplatesOpen}
                onClose={() => setIsTemplatesOpen(false)}
                onLoad={(data) => dispatch(loadState(data))}
                fetchTemplates={onLoad}
            />
        </>
    );
};
