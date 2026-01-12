import React from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch } from 'react-redux';
import { addElement, selectElement } from '@/store/editorSlice';
import { CanvasElement } from './CanvasElement';
import { EditorElement } from '@/lib/types';

interface ColumnDropZoneProps {
    parentId: string;
    columnId: string;
    elements: EditorElement[];
}

export const ColumnDropZone: React.FC<ColumnDropZoneProps> = ({ parentId, columnId, elements }) => {
    const dispatch = useDispatch();

    const [{ isOver, canDrop }, drop] = useDrop(() => ({
        accept: 'ELEMENT',
        drop: (item: any, monitor) => {
            if (monitor.didDrop()) {
                return;
            }
            dispatch(addElement({ type: item.type, parentId, columnId }));
            return { droppedInColumn: true };
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
            canDrop: !!monitor.canDrop(),
        }),
    }));

    return (
        <div
            ref={drop as any}
            className={`flex-1 min-h-[50px] p-2 transition-colors flex flex-col gap-2
                ${isOver ? 'bg-indigo-50 border-2 border-indigo-300 border-dashed ring-2 ring-indigo-200' : 'bg-transparent border border-dashed border-gray-200'}
                ${elements.length === 0 ? 'items-center justify-center' : ''}
            `}
        >
            {elements.length === 0 ? (
                <div className="text-xs text-muted-foreground pointer-events-none">
                    Drop here
                </div>
            ) : (
                elements.map((el, index) => (
                    // Note: We might need to pass context that this is nested if we want nested sorting later
                    <CanvasElement key={el.id} element={el} index={index} />
                ))
            )}
        </div>
    );
};
