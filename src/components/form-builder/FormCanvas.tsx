"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useDrop } from 'react-dnd';
import { RootState } from '@/store';
import { addElement, selectElement } from '@/store/formEditorSlice';
import { cn } from '@/lib/utils';
import { EditorElement } from '@/lib/types';
import { CanvasElement } from '@/components/editor/CanvasElement';

import { FormCanvasElement } from './FormCanvasElement';


interface FormCanvasProps {
    viewMode: 'desktop' | 'mobile';
}

const FormCanvas: React.FC<FormCanvasProps> = ({ viewMode }) => {
    const dispatch = useDispatch();
    const { formSettings, currentStepId, steps, selectedElementId } = useSelector((state: RootState) => state.formEditor);

    const currentStep = steps.find(s => s.id === currentStepId);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'tool',
        drop: (item: { type: string }, monitor) => {
            // Need to handle drop coordinates or just append for now
            dispatch(addElement({ type: item.type as EditorElement['type'] }));
            return { name: 'FormCanvas' };
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    }));

    const containerStyle = {
        width: viewMode === 'mobile' ? '320px' : `${formSettings.width}px`,
        backgroundColor: formSettings.backgroundColor,
        borderRadius: `${formSettings.borderRadius}px`,
        padding: formSettings.padding,
        fontFamily: formSettings.fontFamily,
    };

    if (!currentStep) return <div>No Step Selected</div>;

    return (
        <div
            ref={drop as unknown as React.Ref<HTMLDivElement>}
            className={cn(
                "relative transition-all duration-300 shadow-xl min-h-[400px]",
                isOver ? "ring-2 ring-blue-500 ring-offset-2" : ""
            )}
            style={containerStyle}
            onClick={() => dispatch(selectElement(null))} // Deselect on background click
        >
            {currentStep.elements.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                    <p>Drag elements here</p>
                </div>
            ) : (
                <div className="flex flex-col space-y-4">
                    {/* We need to use a renderer compatible with form actions. 
                         For speed, I might need to adapt CanvasElement or create a FormCanvasElement wrapper.
                         For now, assuming I can reuse CanvasElement but I need to ensure it dispatches to formEditorSlice actions,
                         which might require passing custom handlers or wrapping it.
                         
                         Actually, CanvasElement likely uses specific hooks that import 'editorSlice'. 
                         I should probably create a `FormElementRenderer` to handle the specific actions for forms to avoid cross-wiring.
                      */}
                    {currentStep.elements.map((element, index) => (
                        <FormCanvasElement
                            key={element.id}
                            element={element}
                            index={index}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default FormCanvas;
