'use client';
import React from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@/store'; // Note: In a real lib, you might want props to override store
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Header } from '@/components/layout/Header';
import { ToolsPanel } from '@/components/layout/ToolsPanel';
import { PropertiesPanel } from '@/components/layout/PropertiesPanel';
import { Canvas } from '@/components/editor/Canvas';

import '@/app/globals.css'; // Ensure styles are included in build context if possible

export interface EmailEditorProps {
    initialState?: import('../lib/types').EditorState | null; // [NEW]
    onSave?: (data: any) => Promise<void>;
    onLoad?: () => Promise<any[]>;
    onUploadImage?: (file: File) => Promise<string>;
    onFetchImages?: () => Promise<string[]>;
    onSendTestEmail?: (email: string, html: string) => Promise<void>;
    mergeTags?: { label: string; value: string }[];
    aiFeatures?: import('../lib/types').AiFeatures;
}

const EditorLayout = ({ props }: { props: EmailEditorProps }) => {
    const dispatch = useDispatch();

    // Handle initial state loading
    React.useEffect(() => {
        if (props.initialState) {
            // dynamic import to avoid circular dependency if validation needed, or just dispatch
            import('@/store/editorSlice').then(({ loadState }) => {
                dispatch(loadState(props.initialState!));
            });
        }
    }, [props.initialState, dispatch]);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden bg-background text-foreground">
            <Header
                onSave={props.onSave}
                onLoad={props.onLoad}
                onSendTestEmail={props.onSendTestEmail}
                aiFeatures={props.aiFeatures}
            />
            <div className="flex flex-1 overflow-hidden relative">
                <ToolsPanel />
                <Canvas />
                <PropertiesPanel
                    onUploadImage={props.onUploadImage}
                    onFetchImages={props.onFetchImages}
                    mergeTags={props.mergeTags}
                    aiFeatures={props.aiFeatures}
                />
            </div>
        </div>
    );
};

export const EmailEditor: React.FC<EmailEditorProps> = (props) => {
    return (
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                <EditorLayout props={props} />
            </DndProvider>
        </Provider>
    );
};

