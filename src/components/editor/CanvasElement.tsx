'use client';
import React from 'react';
import { EditorElement } from '@/lib/types';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { selectElement, moveElement, removeElement } from '@/store/editorSlice'; // moveElement action needs to be verified
import { RootState } from '@/store';
import { Trash2, Facebook, Twitter, Instagram, Linkedin, Share2 } from 'lucide-react';
import { ColumnDropZone } from './ColumnDropZone';

interface CanvasElementProps {
    element: EditorElement;
    index: number;
}

export const CanvasElement: React.FC<CanvasElementProps> = ({ element, index }) => {
    const dispatch = useDispatch();
    const selectedId = useSelector((state: RootState) => state.editor.selectedElementId);
    const isSelected = selectedId === element.id;

    const ref = React.useRef<HTMLDivElement>(null);

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
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    // eslint-disable-next-line react-hooks/refs
    drag(drop(ref));

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
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
                return <p style={{ fontSize: 'inherit', color: 'inherit' }}>{element.content.text}</p>;
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
            case 'columns':
            case 'columns-3':
                return (
                    <div className="flex w-full" style={{ gap: '0' }}>
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
                ...element.style // Apply user styles
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
