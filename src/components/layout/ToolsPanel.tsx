'use client';
import React from 'react';
import { Type, Image, LayoutTemplate, MousePointerClick, Minus, Share2 } from 'lucide-react';
import { DraggableTool } from '@/components/tools/DraggableTool';
import { Separator } from '@/components/ui/separator';

export const ToolsPanel = () => {
    return (
        <aside className="w-[280px] flex-shrink-0 border-r bg-background/50 flex flex-col h-full overflow-y-auto">
            <div className="p-6">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Components
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <DraggableTool type="text" label="Text" icon={Type} />
                    <DraggableTool type="image" label="Image" icon={Image} />
                    <DraggableTool type="button" label="Button" icon={MousePointerClick} />
                    <DraggableTool type="divider" label="Divider" icon={Minus} />
                    <DraggableTool type="social" label="Social" icon={Share2} />
                    <DraggableTool type="spacer" label="Spacer" icon={LayoutTemplate} />
                </div>
            </div>

            <Separator />

            <div className="p-6 bg-muted/30 flex-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Layouts
                </h3>
                <p className="text-sm text-muted-foreground italic">
                    Advanced layouts coming soon.
                </p>
            </div>
        </aside>
    );
};
