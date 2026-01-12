import * as react_jsx_runtime from 'react/jsx-runtime';
import * as _reduxjs_toolkit from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';
import { ClassValue } from 'clsx';

declare const EmailEditor: () => react_jsx_runtime.JSX.Element;

type ElementType = 'text' | 'image' | 'button' | 'divider' | 'social' | 'spacer';
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
        items?: any[];
    };
    style: ElementStyle;
}
interface CanvasSettings {
    width: number;
    backgroundColor: string;
    fontFamily: string;
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

declare const editorSlice: _reduxjs_toolkit.Slice<EditorState, {
    addElement: (state: {
        elements: {
            id: string;
            type: ElementType;
            content: {
                text?: string | undefined;
                url?: string | undefined;
                alt?: string | undefined;
                label?: string | undefined;
                items?: any[] | undefined;
            };
            style: {
                [x: string]: any;
                padding?: string | undefined;
                margin?: string | undefined;
                backgroundColor?: string | undefined;
                color?: string | undefined;
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                textAlign?: "left" | "center" | "right" | "justify" | undefined;
                width?: string | undefined;
                height?: string | undefined;
                borderRadius?: string | undefined;
                border?: string | undefined;
            };
        }[];
        selectedElementId: string | null;
        canvasSettings: {
            width: number;
            backgroundColor: string;
            fontFamily: string;
        };
        history: {
            past: any[];
            future: any[];
        };
    }, action: PayloadAction<{
        type: EditorElement["type"];
        index?: number;
    }>) => void;
    updateElement: (state: {
        elements: {
            id: string;
            type: ElementType;
            content: {
                text?: string | undefined;
                url?: string | undefined;
                alt?: string | undefined;
                label?: string | undefined;
                items?: any[] | undefined;
            };
            style: {
                [x: string]: any;
                padding?: string | undefined;
                margin?: string | undefined;
                backgroundColor?: string | undefined;
                color?: string | undefined;
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                textAlign?: "left" | "center" | "right" | "justify" | undefined;
                width?: string | undefined;
                height?: string | undefined;
                borderRadius?: string | undefined;
                border?: string | undefined;
            };
        }[];
        selectedElementId: string | null;
        canvasSettings: {
            width: number;
            backgroundColor: string;
            fontFamily: string;
        };
        history: {
            past: any[];
            future: any[];
        };
    }, action: PayloadAction<{
        id: string;
        changes: Partial<EditorElement>;
    }>) => void;
    removeElement: (state: {
        elements: {
            id: string;
            type: ElementType;
            content: {
                text?: string | undefined;
                url?: string | undefined;
                alt?: string | undefined;
                label?: string | undefined;
                items?: any[] | undefined;
            };
            style: {
                [x: string]: any;
                padding?: string | undefined;
                margin?: string | undefined;
                backgroundColor?: string | undefined;
                color?: string | undefined;
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                textAlign?: "left" | "center" | "right" | "justify" | undefined;
                width?: string | undefined;
                height?: string | undefined;
                borderRadius?: string | undefined;
                border?: string | undefined;
            };
        }[];
        selectedElementId: string | null;
        canvasSettings: {
            width: number;
            backgroundColor: string;
            fontFamily: string;
        };
        history: {
            past: any[];
            future: any[];
        };
    }, action: PayloadAction<string>) => void;
    selectElement: (state: {
        elements: {
            id: string;
            type: ElementType;
            content: {
                text?: string | undefined;
                url?: string | undefined;
                alt?: string | undefined;
                label?: string | undefined;
                items?: any[] | undefined;
            };
            style: {
                [x: string]: any;
                padding?: string | undefined;
                margin?: string | undefined;
                backgroundColor?: string | undefined;
                color?: string | undefined;
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                textAlign?: "left" | "center" | "right" | "justify" | undefined;
                width?: string | undefined;
                height?: string | undefined;
                borderRadius?: string | undefined;
                border?: string | undefined;
            };
        }[];
        selectedElementId: string | null;
        canvasSettings: {
            width: number;
            backgroundColor: string;
            fontFamily: string;
        };
        history: {
            past: any[];
            future: any[];
        };
    }, action: PayloadAction<string | null>) => void;
    moveElement: (state: {
        elements: {
            id: string;
            type: ElementType;
            content: {
                text?: string | undefined;
                url?: string | undefined;
                alt?: string | undefined;
                label?: string | undefined;
                items?: any[] | undefined;
            };
            style: {
                [x: string]: any;
                padding?: string | undefined;
                margin?: string | undefined;
                backgroundColor?: string | undefined;
                color?: string | undefined;
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                textAlign?: "left" | "center" | "right" | "justify" | undefined;
                width?: string | undefined;
                height?: string | undefined;
                borderRadius?: string | undefined;
                border?: string | undefined;
            };
        }[];
        selectedElementId: string | null;
        canvasSettings: {
            width: number;
            backgroundColor: string;
            fontFamily: string;
        };
        history: {
            past: any[];
            future: any[];
        };
    }, action: PayloadAction<{
        dragIndex: number;
        hoverIndex: number;
    }>) => void;
    updateCanvasSettings: (state: {
        elements: {
            id: string;
            type: ElementType;
            content: {
                text?: string | undefined;
                url?: string | undefined;
                alt?: string | undefined;
                label?: string | undefined;
                items?: any[] | undefined;
            };
            style: {
                [x: string]: any;
                padding?: string | undefined;
                margin?: string | undefined;
                backgroundColor?: string | undefined;
                color?: string | undefined;
                fontSize?: string | undefined;
                fontWeight?: string | undefined;
                textAlign?: "left" | "center" | "right" | "justify" | undefined;
                width?: string | undefined;
                height?: string | undefined;
                borderRadius?: string | undefined;
                border?: string | undefined;
            };
        }[];
        selectedElementId: string | null;
        canvasSettings: {
            width: number;
            backgroundColor: string;
            fontFamily: string;
        };
        history: {
            past: any[];
            future: any[];
        };
    }, action: PayloadAction<Partial<CanvasSettings>>) => void;
}, "editor", "editor", _reduxjs_toolkit.SliceSelectors<EditorState>>;
declare const addElement: _reduxjs_toolkit.ActionCreatorWithPayload<{
    type: EditorElement["type"];
    index?: number;
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

declare function cn(...inputs: ClassValue[]): string;

export { type CanvasSettings, type EditorElement, type EditorState, type ElementStyle, type ElementType, EmailEditor, addElement, cn, editorSlice, generateHtml, moveElement, removeElement, selectElement, updateCanvasSettings, updateElement };
