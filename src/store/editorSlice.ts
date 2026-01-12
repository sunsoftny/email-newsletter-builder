import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EditorElement, EditorState, CanvasSettings } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const initialState: EditorState = {
    elements: [],
    selectedElementId: null,
    canvasSettings: {
        width: 600,
        backgroundColor: '#ffffff',
        fontFamily: 'Arial, sans-serif',
    },
    history: {
        past: [],
        future: [],
    },
};

export const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        addElement: (state, action: PayloadAction<{ type: EditorElement['type']; index?: number }>) => {
            const newElement: EditorElement = {
                id: uuidv4(),
                type: action.payload.type,
                content: getDefaultContent(action.payload.type),
                style: getDefaultStyle(action.payload.type),
            };

            if (action.payload.index !== undefined && action.payload.index >= 0) {
                state.elements.splice(action.payload.index, 0, newElement);
            } else {
                state.elements.push(newElement);
            }
            state.selectedElementId = newElement.id;
        },
        updateElement: (state, action: PayloadAction<{ id: string; changes: Partial<EditorElement> }>) => {
            const index = state.elements.findIndex(el => el.id === action.payload.id);
            if (index !== -1) {
                state.elements[index] = { ...state.elements[index], ...action.payload.changes };
            }
        },
        removeElement: (state, action: PayloadAction<string>) => {
            state.elements = state.elements.filter(el => el.id !== action.payload);
            if (state.selectedElementId === action.payload) {
                state.selectedElementId = null;
            }
        },
        selectElement: (state, action: PayloadAction<string | null>) => {
            state.selectedElementId = action.payload;
        },
        moveElement: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
            const { dragIndex, hoverIndex } = action.payload;
            const dragElement = state.elements[dragIndex];
            state.elements.splice(dragIndex, 1);
            state.elements.splice(hoverIndex, 0, dragElement);
        },
        updateCanvasSettings: (state, action: PayloadAction<Partial<CanvasSettings>>) => {
            state.canvasSettings = { ...state.canvasSettings, ...action.payload };
        },
    },
});

function getDefaultContent(type: EditorElement['type']) {
    switch (type) {
        case 'text': return { text: 'Edit this text' };
        case 'button': return { label: 'Click Me', url: '#' };
        case 'image': return { url: 'https://via.placeholder.com/300x200', alt: 'Placeholder' };
        case 'divider': return {};
        case 'social': return { items: [] };
        default: return {};
    }
}

function getDefaultStyle(type: EditorElement['type']) {
    const base = { padding: '10px', margin: '0px' };
    switch (type) {
        case 'button': return { ...base, backgroundColor: '#007bff', color: '#ffffff', borderRadius: '4px', textAlign: 'center' as const, width: 'auto', display: 'inline-block' };
        case 'image': return { ...base, width: '100%', textAlign: 'center' as const };
        default: return base;
    }
}

export const { addElement, updateElement, removeElement, selectElement, moveElement, updateCanvasSettings } = editorSlice.actions;
export default editorSlice.reducer;
