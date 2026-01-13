"use client";

import React from 'react';
import { useDrag } from 'react-dnd';
import { Type, Image as ImageIcon, MousePointerClick, Box, CreditCard, FormInput } from 'lucide-react';

const tools = [
    { type: 'text', label: 'Text', icon: Type },
    { type: 'image', label: 'Image', icon: ImageIcon },
    { type: 'spacer', label: 'Spacer', icon: Box },
    { type: 'form-input', label: 'Input Field', icon: FormInput }, // New
    { type: 'form-submit', label: 'Submit Button', icon: MousePointerClick }, // New
    { type: 'button', label: 'Button', icon: MousePointerClick },
];

const BlocksPanel = () => {
    return (
        <div className="grid grid-cols-2 gap-3">
            {tools.map((tool) => (
                <DraggableTool key={tool.type} tool={tool} />
            ))}
        </div>
    );
};

const DraggableTool = ({ tool }: { tool: any }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'tool',
        item: { type: tool.type },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    const Icon = tool.icon;

    return (
        <div
            ref={drag as unknown as React.Ref<HTMLDivElement>}
            className={`
                flex flex-col items-center justify-center p-4 
                bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm
                rounded-lg cursor-grab active:cursor-grabbing transition-all
                ${isDragging ? 'opacity-50' : 'opacity-100'}
            `}
        >
            <div className="bg-slate-200 p-2 rounded-md mb-2 text-slate-600">
                <Icon size={20} />
            </div>
            <span className="text-xs font-medium text-slate-700">{tool.label}</span>
        </div>
    );
};

export default BlocksPanel;
