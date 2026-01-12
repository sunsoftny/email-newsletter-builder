'use client';
import React from 'react';
import { useDrag } from 'react-dnd';
import { ElementType } from '@/lib/types';
import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DraggableToolProps {
    type: ElementType;
    label: string;
    icon: LucideIcon;
}

export const DraggableTool: React.FC<DraggableToolProps> = ({ type, label, icon: Icon }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'ELEMENT',
        item: { type },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <Card
            ref={drag as any}
            className={cn(
                "flex flex-col items-center justify-center p-4 h-24 hover:border-primary/50 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 select-none",
                isDragging && "opacity-50 ring-2 ring-primary rotate-2 scale-95"
            )}
        >
            <div className="p-2 bg-muted rounded-full mb-2 group-hover:bg-primary/10 transition-colors">
                <Icon size={20} className="text-muted-foreground group-hover:text-primary" />
            </div>
            <span className="text-xs font-medium text-foreground">{label}</span>
        </Card>
    );
};
