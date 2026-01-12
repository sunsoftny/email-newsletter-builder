'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Loader2, Image as ImageIcon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils'; // Keep using lib/utils as it likely contains standard cn

// Minimal Image Gallery Component
interface ImageGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (url: string) => void;
    onUpload?: (file: File) => Promise<string>;
    fetchImages?: () => Promise<string[]>;
}

export const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({
    isOpen,
    onClose,
    onSelect,
    onUpload,
    fetchImages
}) => {
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Load images on open
    useEffect(() => {
        if (isOpen && fetchImages) {
            setIsLoading(true);
            fetchImages()
                .then(setImages)
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, fetchImages]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !onUpload) return;

        setIsUploading(true);
        try {
            const url = await onUpload(file);
            setImages(prev => [url, ...prev]); // Prepend new image
            onSelect(url); // Auto select? Maybe just add it. Let's just add it.
            // Requirement said: "uploaded images will come from this"
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setIsUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-background w-[800px] h-[600px] rounded-xl shadow-2xl flex flex-col overflow-hidden border">
                {/* Header */}
                <div className="h-16 border-b px-6 flex items-center justify-between shrink-0">
                    <h3 className="font-semibold text-lg">Image Gallery</h3>
                    <div className="flex items-center gap-2">
                        {onUpload && (
                            <>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                />
                                <Button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                                    Upload New
                                </Button>
                            </>
                        )}
                        <Button variant="ghost" size="icon" onClick={onClose}>
                            <X size={20} />
                        </Button>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6 bg-muted/10">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : (
                        images.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((url, i) => (
                                    <div
                                        key={i}
                                        className="group relative aspect-video bg-muted rounded-lg overflow-hidden border hover:ring-2 ring-primary cursor-pointer transition-all"
                                        onClick={() => { onSelect(url); onClose(); }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                            <div className="bg-white/90 p-2 rounded-full shadow-lg">
                                                <Check size={16} className="text-primary" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <ImageIcon size={48} className="mb-4 opacity-50" />
                                <p>No images found</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};
