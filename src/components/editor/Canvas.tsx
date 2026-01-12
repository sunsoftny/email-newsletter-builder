'use client';
import React from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addElement, selectElement } from '@/store/editorSlice';
import { CanvasElement } from './CanvasElement';

export const Canvas = () => {
    const dispatch = useDispatch();
    const { elements, canvasSettings } = useSelector((state: RootState) => state.editor);

    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'ELEMENT',
        drop: (item: any) => {
            dispatch(addElement({ type: item.type }));
            return undefined;
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

    // Handle background click to deselect
    const handleBackgroundClick = () => {
        dispatch(selectElement(null));
    };

    return (
        <main
            className="flex-1 bg-slate-100/50 p-10 overflow-y-auto flex justify-center relative z-0"
            onClick={handleBackgroundClick}
        >
            <div className="flex flex-col items-center w-full max-w-[1200px] py-12">

                {/* Canvas Header / Ruler (Optional visual aid) */}
                <div className="text-[10px] text-slate-400 mb-3 font-medium uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-slate-200/50 backdrop-blur-sm">
                    Width: {canvasSettings.width}px
                </div>

                <div
                    ref={drop as any}
                    className={`
            bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 min-h-[800px] flex flex-col relative
            ${isOver ? 'ring-4 ring-indigo-500/20 scale-[1.01]' : ''}
            `}
                    style={{
                        width: canvasSettings.width,
                        backgroundColor: canvasSettings.backgroundColor,
                        fontFamily: canvasSettings.fontFamily,
                        maxWidth: '100%'
                    }}
                    onClick={(e) => e.stopPropagation()} // Prevent deselecting when clicking canvas area
                >
                    {elements.length === 0 ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center text-center max-w-sm mx-auto">
                                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl text-slate-300">+</span>
                                </div>
                                <h3 className="text-slate-900 font-medium mb-1">Start Building</h3>
                                <p className="text-slate-500 text-sm">Drag and drop elements from the left panel to begin designing your newsletter.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col w-full h-full">
                            {elements.map((element, index) => (
                                <CanvasElement key={element.id} element={element} index={index} />
                            ))}
                            {/* Spacer at bottom to make dropping easier */}
                            <div className="flex-1 min-h-[50px] transition-colors" />
                        </div>
                    )}
                </div>

                <div className="h-20"></div> {/* Bottom Scroll Padding */}
            </div>
        </main>
    );
};
