'use client';
import React, { useState, useEffect, useRef } from 'react';
import { EditorElement } from '@/lib/types';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { selectElement, moveElement, removeElement, updateElement } from '@/store/editorSlice';
import { RootState } from '@/store';
import { Trash2, Facebook, Twitter, Instagram, Linkedin, Share2 } from 'lucide-react';
import { ColumnDropZone } from './ColumnDropZone';

// Helper for Inline Text Editing
const EditableText = ({
    initialText,
    onChange,
    style,
    isEditing,
    onToggleEdit
}: {
    initialText: string,
    onChange: (val: string) => void,
    style: React.CSSProperties,
    isEditing: boolean,
    onToggleEdit: (edit: boolean) => void
}) => {
    const ref = useRef<HTMLDivElement>(null);

    // Sync from props if not focused
    useEffect(() => {
        if (ref.current) {
            // Only update if NOT focused (to avoid overwriting user typing)
            // and if content is effectively different
            if (document.activeElement !== ref.current && ref.current.innerHTML !== initialText) {
                ref.current.innerHTML = initialText;
            }
        }
    }, [initialText]);

    // Initial render setup
    useEffect(() => {
        if (ref.current && !ref.current.innerHTML) {
            ref.current.innerHTML = initialText;
        }
    }, []);

    // Handle focus when entering edit mode
    useEffect(() => {
        if (isEditing && ref.current) {
            ref.current.focus();
            // Optional: Move cursor to end?
        }
    }, [isEditing]);

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        const text = e.currentTarget.innerHTML;
        onChange(text);
    };

    return (
        <div
            ref={ref}
            contentEditable={isEditing}
            suppressContentEditableWarning
            style={{ ...style, outline: isEditing ? '1px dashed #2563eb' : 'none', cursor: isEditing ? 'text' : 'pointer', minHeight: '1.2em' }}
            onInput={handleInput}
            onBlur={() => onToggleEdit(false)}
            onClick={(e) => {
                if (isEditing) e.stopPropagation();
            }}
        />
    );
};

interface CanvasElementProps {
    element: EditorElement;
    index: number;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({ element, index }) => {
    const dispatch = useDispatch();
    const selectedId = useSelector((state: RootState) => state.editor.selectedElementId);
    const isSelected = selectedId === element.id;
    const [isEditing, setIsEditing] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop({
        accept: 'CANVAS_ELEMENT',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: any, monitor) {
            if (!ref.current) {
                return;
            }
            const dragIndex = item.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            dispatch(moveElement({ dragIndex, hoverIndex }));
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'CANVAS_ELEMENT',
        item: () => {
            return { id: element.id, index };
        },
        canDrag: () => !isEditing, // Disable drag when editing text
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // eslint-disable-next-line react-hooks/refs
    drag(drop(ref));

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        // If already selected and is text, enter edit mode
        if (isSelected && element.type === 'text') {
            setIsEditing(true);
        }
        dispatch(selectElement(element.id));
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(removeElement(element.id));
    };

    // Render content based on type
    const renderContent = () => {
        switch (element.type) {
            case 'text':
                return <EditableText
                    initialText={element.content.text || ''}
                    onChange={(val) => dispatch(updateElement({
                        id: element.id,
                        changes: { content: { ...element.content, text: val } }
                    }))}
                    style={{ fontSize: 'inherit', color: 'inherit' }}
                    isEditing={isEditing}
                    onToggleEdit={setIsEditing}
                />;
            case 'button':
                return <a href={element.content.url} style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}>{element.content.label}</a>;
            case 'image':
                // eslint-disable-next-line @next/next/no-img-element
                return <img src={element.content.url} alt={element.content.alt} style={{ maxWidth: '100%', display: 'block' }} />;
            case 'divider':
                return <hr style={{
                    borderTopWidth: element.style.borderTopWidth || '1px',
                    borderTopColor: element.style.borderTopColor || '#eeeeee',
                    borderTopStyle: element.style.borderTopStyle || 'solid'
                }} />;
            case 'spacer':
                return <div style={{ height: element.style.height || '32px' }}></div>;
            case 'social':
                return (
                    <div className="flex gap-2 justify-center">
                        {element.content.socialLinks?.map((link, i) => {
                            const iconSize = 24;
                            const color = element.style.color || '#374151'; // Default gray-700
                            switch (link.network) {
                                case 'facebook': return <Facebook key={i} size={iconSize} color={color} />;
                                case 'twitter': return <Twitter key={i} size={iconSize} color={color} />;
                                case 'instagram': return <Instagram key={i} size={iconSize} color={color} />;
                                case 'linkedin': return <Linkedin key={i} size={iconSize} color={color} />;
                                default: return <Share2 key={i} size={iconSize} color={color} />;
                            }
                        })}
                        {(!element.content.socialLinks || element.content.socialLinks.length === 0) && (
                            <span className="text-slate-400 italic text-sm">No social links</span>
                        )}
                    </div>
                );
            case 'product':
                return (
                    <div className="flex flex-col items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={element.content.imageUrl}
                            alt={element.content.text}
                            style={{
                                width: '100%',
                                maxHeight: '200px',
                                objectFit: 'contain',
                                marginBottom: '16px'
                            }}
                        />
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', fontWeight: 'bold' }}>{element.content.text}</h3>
                        <p style={{ margin: '0 0 16px 0', fontSize: '16px', color: '#666' }}>
                            {element.content.currency}{element.content.price}
                        </p>
                        <span style={{
                            display: 'inline-block',
                            backgroundColor: '#007bff',
                            color: '#ffffff',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontWeight: 'bold'
                        }}>
                            {element.content.label}
                        </span>
                    </div>
                );
            case 'video':
                return (
                    <div className="relative group/video cursor-pointer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={element.content.thumbnailUrl}
                            alt={element.content.alt}
                            style={{ width: '100%', display: 'block', height: 'auto' }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/30 transition-colors">
                            <div className="bg-white/90 rounded-full p-4 shadow-lg transform transition-transform group-hover/video:scale-110">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                                    <path d="M8 5v14l11-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                );
            case 'countdown':
                // Simple JS Countdown placeholder
                const endTime = new Date(element.content.endTime || Date.now()).getTime();
                const now = Date.now();
                const diff = Math.max(0, endTime - now);
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);

                return (
                    <div className="flex justify-center gap-4 text-center">
                        {[
                            { val: days, label: 'Days' },
                            { val: hours, label: 'Hours' },
                            { val: minutes, label: 'Mins' },
                            { val: seconds, label: 'Secs' }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col min-w-[60px] p-2 rounded bg-black/10">
                                <span className="text-2xl font-bold">{String(item.val).padStart(2, '0')}</span>
                                <span className="text-xs uppercase opacity-70">{item.label}</span>
                            </div>
                        ))}
                    </div>
                );
            case 'html':
                return <div dangerouslySetInnerHTML={{ __html: element.content.html || '' }} />;
            case 'columns':
            case 'columns-3':
            case 'section':
                return (
                    <div className="flex w-full h-full" style={{ gap: '0' }}>
                        {element.content.columns?.map((col, i) => (
                            <ColumnDropZone
                                key={col.id}
                                parentId={element.id}
                                columnId={col.id}
                                elements={col.elements}
                            />
                        ))}
                    </div>
                );
                return <div>Unknown Element</div>;
        }
    };

    // Mobile Style Detection
    const canvasSettings = useSelector((state: RootState) => state.editor.canvasSettings);
    const isMobile = canvasSettings.width <= 480;

    const finalStyle = isMobile && element.style.mobile
        ? { ...element.style, ...element.style.mobile }
        : element.style;

    return (
        <div
            ref={ref}
            onClick={handleClick}
            data-handler-id={handlerId}
            className={`
        relative group
        ${isSelected ? 'ring-2 ring-blue-500 z-10' : 'hover:ring-1 hover:ring-blue-300'}
        cursor-pointer
        transition-all
      `}
            style={{
                opacity: isDragging ? 0.3 : 1,
                ...finalStyle // Use combined style
            }}
        >
            {isSelected && (
                <div className="absolute -top-3 -right-3 bg-white shadow-md rounded-full p-1 cursor-pointer z-50 group-hover:block"
                    onClick={handleDelete}>
                    <Trash2 size={14} className="text-red-500" />
                </div>
            )}

            {renderContent()}
        </div>
    );
};
