'use client';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateElement, updateCanvasSettings } from '@/store/editorSlice';
import { Sliders, Type, Palette, Layout, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const PropertiesPanel = () => {
    const dispatch = useDispatch();
    const { elements, selectedElementId, canvasSettings } = useSelector((state: RootState) => state.editor);

    const selectedElement = elements.find(el => el.id === selectedElementId);

    const handleStyleChange = (key: string, value: string) => {
        if (!selectedElement) return;
        dispatch(updateElement({
            id: selectedElement.id,
            changes: {
                style: { ...selectedElement.style, [key]: value }
            }
        }));
    };

    const handleContentChange = (key: string, value: any) => {
        if (!selectedElement) return;
        dispatch(updateElement({
            id: selectedElement.id,
            changes: {
                content: { ...selectedElement.content, [key]: value }
            }
        }));
    };

    const handleGlobalChange = (key: string, value: any) => {
        dispatch(updateCanvasSettings({ [key]: value }));
    };

    const PropertySection = ({ title, icon: Icon, children }: { title: string, icon?: any, children: React.ReactNode }) => (
        <div className="border-b last:border-0 border-border">
            <div className="px-6 py-4 flex items-center gap-2 bg-muted/20">
                {Icon && <Icon size={14} className="text-muted-foreground" />}
                <span className="text-xs font-medium text-foreground uppercase tracking-widest">{title}</span>
            </div>
            <div className="p-6 space-y-4">
                {children}
            </div>
        </div>
    );

    // Global Settings View (Empty Selection)
    if (!selectedElement) {
        return (
            <aside className="w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto">
                <div className="p-6 border-b flex items-center gap-2">
                    <Sliders size={18} />
                    <h2 className="font-semibold text-lg">Settings</h2>
                </div>

                <PropertySection title="Canvas Dimensions" icon={Layout}>
                    <div className="space-y-3">
                        <div className="grid gap-2">
                            <Label>Width (px)</Label>
                            <Input
                                type="number"
                                value={canvasSettings.width}
                                onChange={(e) => handleGlobalChange('width', parseInt(e.target.value))}
                            />
                        </div>
                        <p className="text-[0.8rem] text-muted-foreground">Standard email width is 600px.</p>
                    </div>
                </PropertySection>

                <PropertySection title="Background" icon={Palette}>
                    <div className="grid gap-2">
                        <Label>Color</Label>
                        <div className="flex gap-2">
                            <div className="relative w-10 h-10 rounded-md border overflow-hidden shadow-sm shrink-0">
                                <input
                                    type="color"
                                    value={canvasSettings.backgroundColor}
                                    onChange={(e) => handleGlobalChange('backgroundColor', e.target.value)}
                                    className="absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
                                />
                            </div>
                            <Input
                                type="text"
                                value={canvasSettings.backgroundColor}
                                onChange={(e) => handleGlobalChange('backgroundColor', e.target.value)}
                                className="font-mono"
                            />
                        </div>
                    </div>
                </PropertySection>

                <PropertySection title="Typography" icon={Type}>
                    <div className="grid gap-2">
                        <Label>Default Font Family</Label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={canvasSettings.fontFamily}
                            onChange={(e) => handleGlobalChange('fontFamily', e.target.value)}
                        >
                            <option value="Arial, sans-serif">Arial</option>
                            <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                            <option value="'Times New Roman', Times, serif">Times New Roman</option>
                            <option value="'Courier New', Courier, monospace">Courier New</option>
                            <option value="Georgia, serif">Georgia</option>
                        </select>
                    </div>
                </PropertySection>
            </aside>
        );
    }

    // Selected Element View
    return (
        <aside className="w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between bg-muted/10">
                <h2 className="font-semibold text-lg capitalize">{selectedElement.type}</h2>
                <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                    {selectedElement.id.slice(0, 4)}
                </span>
            </div>

            {/* Content Configuration */}
            <PropertySection title="Content" icon={Type}>
                {selectedElement.type === 'text' && (
                    <div className="grid gap-2">
                        <Label>Text Content</Label>
                        <textarea
                            value={selectedElement.content.text || ''}
                            onChange={(e) => handleContentChange('text', e.target.value)}
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                )}

                {selectedElement.type === 'button' && (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Button Label</Label>
                            <Input
                                type="text"
                                value={selectedElement.content.label || ''}
                                onChange={(e) => handleContentChange('label', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Link URL</Label>
                            <div className="relative">
                                <LinkIcon size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    value={selectedElement.content.url || ''}
                                    onChange={(e) => handleContentChange('url', e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {selectedElement.type === 'image' && (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Image Source URL</Label>
                            <div className="relative">
                                <ImageIcon size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
                                <Input
                                    type="text"
                                    value={selectedElement.content.url || ''}
                                    onChange={(e) => handleContentChange('url', e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="rounded-lg border bg-muted/20 p-4 flex items-center justify-center min-h-[120px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={selectedElement.content.url}
                                className="max-w-full max-h-[150px] object-contain rounded shadow-sm"
                                alt="preview"
                                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150?text=Invalid+Image'; }}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Alt Text</Label>
                            <Input
                                value={selectedElement.content.alt || ''}
                                onChange={(e) => handleContentChange('alt', e.target.value)}
                                placeholder="Description for accessibility"
                            />
                        </div>
                    </div>
                )}
            </PropertySection>

            {/* Style Configuration */}
            <PropertySection title="Appearance" icon={Palette}>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Background</Label>
                        <div className="flex gap-2">
                            <div className="relative w-8 h-8 rounded border overflow-hidden shrink-0">
                                <input
                                    type="color"
                                    value={selectedElement.style.backgroundColor || '#ffffff'}
                                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                                />
                            </div>
                            <Input
                                value={selectedElement.style.backgroundColor || '#ffffff'}
                                onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                className="h-8 font-mono text-xs"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Text Color</Label>
                        <div className="flex gap-2">
                            <div className="relative w-8 h-8 rounded border overflow-hidden shrink-0">
                                <input
                                    type="color"
                                    value={selectedElement.style.color || '#000000'}
                                    onChange={(e) => handleStyleChange('color', e.target.value)}
                                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                                />
                            </div>
                            <Input
                                value={selectedElement.style.color || '#000000'}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                                className="h-8 font-mono text-xs"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="grid gap-2">
                    <Label>Padding</Label>
                    <Input
                        type="text"
                        value={selectedElement.style.padding || '0px'}
                        onChange={(e) => handleStyleChange('padding', e.target.value)}
                        placeholder="e.g. 10px 20px"
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Alignment</Label>
                    <div className="flex bg-muted rounded-md p-1">
                        {['left', 'center', 'right', 'justify'].map((align) => (
                            <button
                                key={align}
                                onClick={() => handleStyleChange('textAlign', align)}
                                className={cn(
                                    "flex-1 flex items-center justify-center py-1.5 rounded-sm text-muted-foreground transition-all hover:text-foreground",
                                    selectedElement.style.textAlign === align && "bg-background shadow-sm text-foreground"
                                )}
                                title={align.charAt(0).toUpperCase() + align.slice(1)}
                            >
                                {align === 'left' && <AlignLeft size={16} />}
                                {align === 'center' && <AlignCenter size={16} />}
                                {align === 'right' && <AlignRight size={16} />}
                                {align === 'justify' && <AlignJustify size={16} />}
                            </button>
                        ))}
                    </div>
                </div>

                {selectedElement.type === 'button' && (
                    <div className="grid gap-2">
                        <Label>Border Radius</Label>
                        <Input
                            type="text"
                            value={selectedElement.style.borderRadius || '0px'}
                            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                            placeholder="e.g. 4px"
                        />
                    </div>
                )}
            </PropertySection>
        </aside>
    );
};
