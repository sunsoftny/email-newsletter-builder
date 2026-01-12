'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store'; // Note: In a real lib, you might want props to override store
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from '@/components/layout/Header';
import { ToolsPanel } from '@/components/layout/ToolsPanel';
import { PropertiesPanel } from '@/components/layout/PropertiesPanel';
import { Canvas } from '@/components/editor/Canvas';

import '@/app/globals.css'; // Ensure styles are included in build context if possible

export const EmailEditor = () => {
    return (
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                <div className="flex flex-col h-full w-full overflow-hidden bg-background text-foreground">
                    <Header />
                    <div className="flex flex-1 overflow-hidden relative">
                        <ToolsPanel />
                        <Canvas />
                        <PropertiesPanel />
                    </div>
                </div>
            </DndProvider>
        </Provider>
    );
};
