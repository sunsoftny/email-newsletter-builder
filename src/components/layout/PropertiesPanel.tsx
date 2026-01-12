'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { updateElement, updateCanvasSettings } from '@/store/editorSlice';
import { Sliders, Type, Palette, Layout, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Upload, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { SpacingControl } from './SpacingControl';
import { ImageGalleryModal } from '@/components/ui/ImageGalleryModal';

// Helper for Image Inputs
const ImageInput = ({ label, value, onChange, onPickImage }: { label: string, value: string, onChange: (val: string) => void, onPickImage?: () => void }) => {
    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <div className="flex gap-2 items-center">
                <Input
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://..."
                    className="flex-1"
                />
                {onPickImage && (
                    <Button
                        variant="secondary"
                        size="icon"
                        onClick={onPickImage}
                        title="Select Image"
                    >
                        <ImageIcon size={16} />
                    </Button>
                )}
            </div>
        </div>
    );
};

interface PropertiesPanelProps {
    onUploadImage?: (file: File) => Promise<string>;
    onFetchImages?: () => Promise<string[]>;
    mergeTags?: { label: string; value: string }[];
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ onUploadImage, onFetchImages, mergeTags }) => {
    const dispatch = useDispatch();
    const { elements, selectedElementId, canvasSettings } = useSelector((state: RootState) => state.editor);

    const [galleryCallback, setGalleryCallback] = React.useState<((url: string) => void) | null>(null);

    const openGallery = (onChange: (url: string) => void) => {
        setGalleryCallback(() => onChange);
    };

    const selectedElement = elements.find(el => el.id === selectedElementId);

    const isMobile = canvasSettings.width <= 480;

    const getStyleValue = (key: string, defaultValue: string = '') => {
        if (isMobile && selectedElement?.style?.mobile?.[key] !== undefined) {
            return selectedElement.style.mobile[key];
        }
        return selectedElement?.style?.[key] || defaultValue;
    };

    const handleStyleChange = (key: string, value: string) => {
        if (!selectedElement) return;

        let newStyle = { ...selectedElement.style };

        if (isMobile) {
            // Mobile Override Mode
            newStyle.mobile = {
                ...newStyle.mobile,
                [key]: value
            };
        } else {
            // Desktop/Base Mode
            newStyle = {
                ...newStyle,
                [key]: value
            };
        }

        dispatch(updateElement({
            id: selectedElement.id,
            changes: { style: newStyle }
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

                <PropertySection title="Global Styles" icon={Type}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Font Family</Label>
                            <select
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                value={canvasSettings.fontFamily}
                                onChange={(e) => handleGlobalChange('fontFamily', e.target.value)}
                            >
                                <optgroup label="Sans Serif">
                                    <option value="Arial, sans-serif">Arial</option>
                                    <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
                                    <option value="'Open Sans', sans-serif">Open Sans</option>
                                    <option value="'Roboto', sans-serif">Roboto</option>
                                    <option value="Verdana, sans-serif">Verdana</option>
                                </optgroup>
                                <optgroup label="Serif">
                                    <option value="'Times New Roman', Times, serif">Times New Roman</option>
                                    <option value="Georgia, serif">Georgia</option>
                                    <option value="'Merriweather', serif">Merriweather</option>
                                    <option value="'Playfair Display', serif">Playfair Display</option>
                                </optgroup>
                                <optgroup label="Monospace">
                                    <option value="'Courier New', Courier, monospace">Courier New</option>
                                </optgroup>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Text Color</Label>
                                <div className="flex gap-2">
                                    <div className="relative w-8 h-8 rounded border overflow-hidden shrink-0">
                                        <input
                                            type="color"
                                            value={canvasSettings.textColor || '#000000'}
                                            onChange={(e) => handleGlobalChange('textColor', e.target.value)}
                                            className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                                        />
                                    </div>
                                    <Input
                                        value={canvasSettings.textColor || '#000000'}
                                        onChange={(e) => handleGlobalChange('textColor', e.target.value)}
                                        className="h-8 font-mono text-xs"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>Link Color</Label>
                                <div className="flex gap-2">
                                    <div className="relative w-8 h-8 rounded border overflow-hidden shrink-0">
                                        <input
                                            type="color"
                                            value={canvasSettings.linkColor || '#007bff'}
                                            onChange={(e) => handleGlobalChange('linkColor', e.target.value)}
                                            className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                                        />
                                    </div>
                                    <Input
                                        value={canvasSettings.linkColor || '#007bff'}
                                        onChange={(e) => handleGlobalChange('linkColor', e.target.value)}
                                        className="h-8 font-mono text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Line Height</Label>
                            <div className="flex items-center gap-4">
                                <Input
                                    type="number"
                                    step="0.1"
                                    min="1"
                                    max="3"
                                    value={canvasSettings.lineHeight || '1.5'}
                                    onChange={(e) => handleGlobalChange('lineHeight', e.target.value)}
                                />
                                <span className="text-xs text-muted-foreground w-12 text-right">
                                    {canvasSettings.lineHeight || 1.5}em
                                </span>
                            </div>
                        </div>
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
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label>Text Content</Label>
                            <textarea
                                value={selectedElement.content.text || ''}
                                onChange={(e) => handleContentChange('text', e.target.value)}
                                className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-xs">Insert Variable</Label>
                            <select
                                className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs"
                                onChange={(e) => {
                                    if (!e.target.value) return;
                                    handleContentChange('text', (selectedElement.content.text || '') + e.target.value);
                                    e.target.value = ''; // Reset
                                }}
                            >
                                <option value="">Select variable...</option>
                                {(mergeTags || [
                                    { value: "{{ first_name }}", label: "First Name" },
                                    { value: "{{ last_name }}", label: "Last Name" },
                                    { value: "{{ email }}", label: "Email Address" },
                                    { value: "{{ unsubscribe_url }}", label: "Unsubscribe Link" },
                                    { value: "{{ current_year }}", label: "Current Year" },
                                    { value: "{{ company_name }}", label: "Company Name" }
                                ]).map(tag => (
                                    <option key={tag.value} value={tag.value}>{tag.label}</option>
                                ))}
                            </select>
                        </div>
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

                {selectedElement.type === 'social' && selectedElement.content.socialLinks && (
                    <div className="space-y-4">
                        <Label>Social Networks</Label>
                        {selectedElement.content.socialLinks.map((link: any, index: number) => (
                            <div key={index} className="grid gap-2 border p-3 rounded-md bg-muted/20">
                                <span className="text-xs font-semibold capitalize">{link.network}</span>
                                <Input
                                    value={link.url}
                                    onChange={(e) => {
                                        const newLinks = [...(selectedElement.content.socialLinks || [])];
                                        newLinks[index] = { ...newLinks[index], url: e.target.value };
                                        handleContentChange('socialLinks', newLinks);
                                    }}
                                    placeholder={`https://${link.network}.com/...`}
                                    className="h-8 text-xs"
                                />
                            </div>
                        ))}
                    </div>
                )}

                {selectedElement.type === 'product' && (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Product Title</Label>
                            <Input
                                value={selectedElement.content.text || ''}
                                onChange={(e) => handleContentChange('text', e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Price</Label>
                                <Input
                                    value={selectedElement.content.price || ''}
                                    onChange={(e) => handleContentChange('price', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Currency</Label>
                                <Input
                                    value={selectedElement.content.currency || '$'}
                                    onChange={(e) => handleContentChange('currency', e.target.value)}
                                />
                            </div>
                        </div>
                        <ImageInput
                            label="Image URL"
                            value={selectedElement.content.imageUrl || ''}
                            onChange={(val) => handleContentChange('imageUrl', val)}
                            onPickImage={() => openGallery((val) => handleContentChange('imageUrl', val))}
                        />
                        <div className="grid gap-2">
                            <Label>Button Label</Label>
                            <Input
                                value={selectedElement.content.label || ''}
                                onChange={(e) => handleContentChange('label', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Product URL</Label>
                            <Input
                                value={selectedElement.content.url || ''}
                                onChange={(e) => handleContentChange('url', e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {selectedElement.type === 'image' && (
                    <div className="space-y-4">
                        <ImageInput
                            label="Image Source"
                            value={selectedElement.content.url || ''}
                            onChange={(val) => handleContentChange('url', val)}
                            onPickImage={() => openGallery((val) => handleContentChange('url', val))}
                        />

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
                {selectedElement.type === 'video' && (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Video URL (YouTube/Vimeo)</Label>
                            <Input
                                value={selectedElement.content.url || ''}
                                onChange={(e) => handleContentChange('url', e.target.value)}
                                placeholder="https://youtube.com/watch?v=..."
                            />
                        </div>
                        <ImageInput
                            label="Thumbnail URL (Optional)"
                            value={selectedElement.content.thumbnailUrl || ''}
                            onChange={(val) => handleContentChange('thumbnailUrl', val)}
                            onPickImage={() => openGallery((val) => handleContentChange('thumbnailUrl', val))}
                        />
                        <div className="grid gap-2">
                            <Label>Alt Text</Label>
                            <Input
                                value={selectedElement.content.alt || ''}
                                onChange={(e) => handleContentChange('alt', e.target.value)}
                            />
                        </div>
                    </div>
                )}
                {selectedElement.type === 'countdown' && (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>End Date & Time</Label>
                            <Input
                                type="datetime-local"
                                value={selectedElement.content.endTime?.slice(0, 16) || ''}
                                onChange={(e) => handleContentChange('endTime', new Date(e.target.value).toISOString())}
                            />
                        </div>
                    </div>
                )}
                {selectedElement.type === 'html' && (
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>HTML Code</Label>
                            <textarea
                                className="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                                value={selectedElement.content.html || ''}
                                onChange={(e) => handleContentChange('html', e.target.value)}
                                placeholder="<div>Your custom HTML here</div>"
                            />
                            <p className="text-xs text-muted-foreground">
                                Warning: Invalid HTML may break the layout.
                            </p>
                        </div>
                    </div>
                )}
                {selectedElement.type === 'spacer' && (
                    <div className="grid gap-2">
                        <Label>Height</Label>
                        <Input
                            type="text"
                            value={selectedElement.style.height || '32px'}
                            onChange={(e) => handleStyleChange('height', e.target.value)}
                            placeholder="e.g. 32px"
                        />
                    </div>
                )}

                {selectedElement.type === 'divider' && (
                    <div className="grid gap-2">
                        <Label>Divider Color</Label>
                        <div className="flex gap-2">
                            <div className="relative w-8 h-8 rounded border overflow-hidden shrink-0">
                                <input
                                    type="color"
                                    value={selectedElement.style.borderTopColor || '#eeeeee'}
                                    onChange={(e) => handleStyleChange('borderTopColor', e.target.value)}
                                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                                />
                            </div>
                            <Input
                                type="text"
                                value={selectedElement.style.borderTopColor || '#eeeeee'}
                                onChange={(e) => handleStyleChange('borderTopColor', e.target.value)}
                                placeholder="#eeeeee"
                                className="font-mono text-xs"
                            />
                        </div>
                    </div>
                )}
            </PropertySection>





            {/* Style Configuration */}
            <PropertySection title={isMobile ? "Appearance (Mobile)" : "Appearance"} icon={Palette}>
                {selectedElement.type === 'section' && (
                    <div className="grid gap-2 mb-4">
                        <Label>Background Image URL</Label>
                        <Input
                            value={getStyleValue('backgroundImage')?.replace(/^url\(['"](.+)['"]\)$/, '$1') || ''}
                            onChange={(e) => handleStyleChange('backgroundImage', e.target.value ? `url('${e.target.value}')` : '')}
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>Background Color</Label>
                        <div className="flex gap-2">
                            <div className="relative w-8 h-8 rounded border overflow-hidden shrink-0">
                                <input
                                    type="color"
                                    value={getStyleValue('backgroundColor', '#ffffff')}
                                    onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                                />
                            </div>
                            <Input
                                value={getStyleValue('backgroundColor', '#ffffff')}
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
                                    value={getStyleValue('color', '#000000')}
                                    onChange={(e) => handleStyleChange('color', e.target.value)}
                                    className="absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                                />
                            </div>
                            <Input
                                value={getStyleValue('color', '#000000')}
                                onChange={(e) => handleStyleChange('color', e.target.value)}
                                className="h-8 font-mono text-xs"
                            />
                        </div>
                    </div>
                </div>

                <Separator />

                <SpacingControl
                    label="Padding"
                    value={getStyleValue('padding', '0px')}
                    onChange={(val) => handleStyleChange('padding', val)}
                />

                <div className="grid gap-2">
                    <Label>Alignment</Label>
                    <div className="flex bg-muted rounded-md p-1">
                        {['left', 'center', 'right', 'justify'].map((align) => (
                            <button
                                key={align}
                                onClick={() => handleStyleChange('textAlign', align)}
                                className={cn(
                                    "flex-1 flex items-center justify-center py-1.5 rounded-sm text-muted-foreground transition-all hover:text-foreground",
                                    getStyleValue('textAlign') === align && "bg-background shadow-sm text-foreground"
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
                            value={getStyleValue('borderRadius', '0px')}
                            onChange={(e) => handleStyleChange('borderRadius', e.target.value)}
                            placeholder="e.g. 4px"
                        />
                    </div>
                )}
            </PropertySection>

            <ImageGalleryModal
                isOpen={!!galleryCallback}
                onClose={() => setGalleryCallback(null)}
                onSelect={(url) => { if (galleryCallback) galleryCallback(url); }}
                onUpload={onUploadImage}
                fetchImages={onFetchImages}
            />
        </aside>
    );
};
