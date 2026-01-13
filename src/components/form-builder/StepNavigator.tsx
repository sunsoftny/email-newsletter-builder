"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setActiveStep, addStep, removeStep } from '@/store/formEditorSlice';
import { ChevronRight, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const StepNavigator = () => {
    const dispatch = useDispatch();
    const { steps, currentStepId } = useSelector((state: RootState) => state.formEditor);

    const handleAddStep = () => {
        dispatch(addStep({ name: 'New Step' }));
    };

    return (
        <div className="flex items-center space-x-1">
            {steps.map((step, index) => (
                <React.Fragment key={step.id}>
                    <div className={cn(
                        "group relative flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer border",
                        currentStepId === step.id
                            ? "bg-blue-50 border-blue-200 text-blue-700"
                            : "bg-white border-transparent hover:bg-slate-100 text-slate-600"
                    )}
                        onClick={() => dispatch(setActiveStep(step.id))}
                    >
                        {step.name}
                        {steps.length > 1 && (
                            <button
                                className="ml-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(removeStep(step.id));
                                }}
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                    {index < steps.length - 1 && (
                        <ChevronRight size={14} className="text-slate-300" />
                    )}
                </React.Fragment>
            ))}

            <Button variant="ghost" size="sm" className="h-7 px-2 text-slate-400 hover:text-blue-600" onClick={handleAddStep}>
                <Plus size={14} />
            </Button>
        </div>
    );
};

export default StepNavigator;
