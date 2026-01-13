"use client";

import React, { useState, useRef } from 'react';
import { EditorElement } from '@/lib/types';
import { useDrag, useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { selectElement, moveElement, removeElement, updateElement } from '@/store/formEditorSlice';
import { RootState } from '@/store';
import { Trash2 } from 'lucide-react';

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
    const ref = useRef<HTMLParagraphElement>(null);

    React.useEffect(() => {
        if (ref.current && document.activeElement !== ref.current && ref.current.innerText !== initialText) {
            ref.current.innerText = initialText;
        }
    }, [initialText]);

    React.useEffect(() => {
        if (isEditing && ref.current) {
            ref.current.focus();
        }
    }, [isEditing]);

    return (
        <p
            ref={ref}
            contentEditable={isEditing}
            suppressContentEditableWarning
            style={{ ...style, outline: isEditing ? '1px dashed #2563eb' : 'none', cursor: isEditing ? 'text' : 'pointer', minHeight: '1.2em' }}
            onInput={(e) => onChange(e.currentTarget.innerText)}
            onBlur={() => onToggleEdit(false)}
            onClick={(e) => { if (isEditing) e.stopPropagation(); }}
        />
    );
};

interface FormCanvasElementProps {
    element: EditorElement;
    index: number;
}

export const FormCanvasElement: React.FC<FormCanvasElementProps> = ({ element, index }) => {
    const dispatch = useDispatch();
    const selectedId = useSelector((state: RootState) => state.formEditor.selectedElementId);
    const isSelected = selectedId === element.id;
    const [isEditing, setIsEditing] = useState(false);

    const ref = useRef<HTMLDivElement>(null);

    const [{ handlerId }, drop] = useDrop({
        accept: 'FORM_ELEMENT',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        hover(item: any, monitor) {
            if (!ref.current) return;
            const dragIndex = item.index;
            const hoverIndex = index;
            if (dragIndex === hoverIndex) return;

            dispatch(moveElement({ dragIndex, hoverIndex }));
            item.index = hoverIndex;
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'FORM_ELEMENT',
        item: () => ({ id: element.id, index }),
        canDrag: () => !isEditing,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    drag(drop(ref));

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isSelected && element.type === 'text') {
            setIsEditing(true);
        }
        dispatch(selectElement(element.id));
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(removeElement(element.id));
    };

    const renderContent = () => {
        switch (element.type) {
            case 'text':
                return <div dangerouslySetInnerHTML={{ __html: element.content.text || '' }} />;
            case 'form-input':
                return (
                    <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-1 pointer-events-none">{element.content.label}</label>
                        <input
                            type={element.content.inputType || 'text'}
                            placeholder={element.content.placeholder}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pointer-events-none"
                            disabled
                        />
                    </div>
                );
            case 'form-submit':
                return (
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded pointer-events-none">
                        {element.content.label}
                    </button>
                );
            case 'image':
                return <img src={element.content.url} alt="Element" className="max-w-full h-auto" />;
            case 'button':
                return <button className="underline text-sm text-gray-600">{element.content.label}</button>;
            case 'spacer':
                return <div style={{ height: '32px' }}></div>;
            default:
                return <div className="p-2 border border-dashed text-gray-400">Unknown Element: {element.type}</div>;
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
                cursor-pointer transition-all
            `}
            style={{
                opacity: isDragging ? 0.3 : 1,
                ...element.style
            }}
        >
            {isSelected && (
                <div className="absolute -top-3 -right-3 bg-white shadow-md rounded-full p-1 cursor-pointer z-50 hover:bg-red-50"
                    onClick={handleDelete}>
                    <Trash2 size={14} className="text-red-500" />
                </div>
            )}
            {renderContent()}
        </div>
    );
};
