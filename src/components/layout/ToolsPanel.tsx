'use client';
import React from 'react';
import { Type, Image, LayoutTemplate, MousePointerClick, Minus, Share2, Columns, RectangleHorizontal, ShoppingBag, Video, Timer, Code } from 'lucide-react';

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
                    <DraggableTool type="product" label="Product" icon={ShoppingBag} />
                    <DraggableTool type="button" label="Button" icon={MousePointerClick} />
                    <DraggableTool type="divider" label="Divider" icon={Minus} />
                    <DraggableTool type="social" label="Social" icon={Share2} />
                    <DraggableTool type="spacer" label="Spacer" icon={LayoutTemplate} />
                    <DraggableTool type="video" label="Video" icon={Video} />
                    <DraggableTool type="countdown" label="Timer" icon={Timer} />
                    <DraggableTool type="html" label="HTML" icon={Code} />
                </div>
            </div>

            <Separator />

            <div className="p-6 bg-muted/30 flex-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                    Layouts
                </h3>
                <div className="grid grid-cols-2 gap-3">
                    <DraggableTool type="section" label="Section" icon={RectangleHorizontal} />
                    <DraggableTool type="columns" label="2 Columns" icon={Columns} />
                    <DraggableTool type="columns-3" label="3 Columns" icon={Columns} />
                </div>
            </div>
        </aside>
    );
};
