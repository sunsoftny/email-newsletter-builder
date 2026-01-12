import React from 'react';
import * as _reduxjs_toolkit from '@reduxjs/toolkit';
import { ClassValue } from 'clsx';

interface EmailEditorProps {
    onSave?: (data: any) => Promise<void>;
    onLoad?: () => Promise<any[]>;
    onUploadImage?: (file: File) => Promise<string>;
    onFetchImages?: () => Promise<string[]>;
    onSendTestEmail?: (email: string, html: string) => Promise<void>;
    mergeTags?: {
        label: string;
        value: string;
    }[];
}
declare const EmailEditor: React.FC<EmailEditorProps>;

type ElementType = 'text' | 'image' | 'button' | 'divider' | 'social' | 'spacer' | 'columns' | 'columns-3' | 'section' | 'product' | 'video' | 'countdown' | 'html';
interface MergeTag {
    value: string;
    label: string;
}
interface SocialItem {
    network: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
    url: string;
}
interface Column {
    id: string;
    elements: EditorElement[];
}
interface ElementStyle {
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    width?: string;
    height?: string;
    borderRadius?: string;
    border?: string;
    flex?: string;
    mobile?: Partial<ElementStyle>;
    [key: string]: any;
}
interface EditorElement {
    id: string;
    type: ElementType;
    content: {
        text?: string;
        url?: string;
        alt?: string;
        label?: string;
        html?: string;
        imageUrl?: string;
        thumbnailUrl?: string;
        price?: string;
        currency?: string;
        endTime?: string;
        socialLinks?: SocialItem[];
        columns?: Column[];
    };
    style: ElementStyle;
}
interface CanvasSettings {
    width: number;
    backgroundColor: string;
    fontFamily: string;
    textColor?: string;
    linkColor?: string;
    lineHeight?: string;
}
interface EditorState {
    elements: EditorElement[];
    selectedElementId: string | null;
    canvasSettings: CanvasSettings;
    history: {
        past: any[];
        future: any[];
    };
}

declare function generateHtml(state: EditorState): string;

declare const addElement: _reduxjs_toolkit.ActionCreatorWithPayload<{
    type: EditorElement["type"];
    index?: number;
    parentId?: string;
    columnId?: string;
}, "editor/addElement">;
declare const updateElement: _reduxjs_toolkit.ActionCreatorWithPayload<{
    id: string;
    changes: Partial<EditorElement>;
}, "editor/updateElement">;
declare const removeElement: _reduxjs_toolkit.ActionCreatorWithPayload<string, "editor/removeElement">;
declare const selectElement: _reduxjs_toolkit.ActionCreatorWithPayload<string | null, "editor/selectElement">;
declare const moveElement: _reduxjs_toolkit.ActionCreatorWithPayload<{
    dragIndex: number;
    hoverIndex: number;
}, "editor/moveElement">;
declare const updateCanvasSettings: _reduxjs_toolkit.ActionCreatorWithPayload<Partial<CanvasSettings>, "editor/updateCanvasSettings">;
declare const undo: _reduxjs_toolkit.ActionCreatorWithoutPayload<"editor/undo">;
declare const redo: _reduxjs_toolkit.ActionCreatorWithoutPayload<"editor/redo">;
declare const loadState: _reduxjs_toolkit.ActionCreatorWithPayload<EditorState, "editor/loadState">;

declare function cn(...inputs: ClassValue[]): string;

export { type CanvasSettings, type Column, type EditorElement, type EditorState, type ElementStyle, type ElementType, EmailEditor, type EmailEditorProps, type MergeTag, type SocialItem, addElement, cn, generateHtml, loadState, moveElement, redo, removeElement, selectElement, undo, updateCanvasSettings, updateElement };
