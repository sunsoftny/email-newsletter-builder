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
        textColor: '#000000',
        linkColor: '#007bff',
        lineHeight: '1.5',
    },
    history: {
        past: [],
        future: [],
    },
};

const editorSlice = createSlice({
    name: 'editor',
    initialState,
    reducers: {
        undo: (state) => {
            if (state.history.past.length > 0) {
                const previous = state.history.past[state.history.past.length - 1];
                const newPast = state.history.past.slice(0, -1);

                state.history.future.unshift({
                    elements: state.elements,
                    selectedElementId: state.selectedElementId,
                    canvasSettings: state.canvasSettings
                });

                state.elements = previous.elements;
                state.selectedElementId = previous.selectedElementId;
                state.canvasSettings = previous.canvasSettings;
                state.history.past = newPast;
            }
        },
        redo: (state) => {
            if (state.history.future.length > 0) {
                const next = state.history.future[0];
                const newFuture = state.history.future.slice(1);

                state.history.past.push({
                    elements: state.elements,
                    selectedElementId: state.selectedElementId,
                    canvasSettings: state.canvasSettings
                });

                state.elements = next.elements;
                state.selectedElementId = next.selectedElementId;
                state.canvasSettings = next.canvasSettings;
                state.history.future = newFuture;
            }
        },
        addElement: (state, action: PayloadAction<{ type: EditorElement['type']; index?: number; parentId?: string; columnId?: string }>) => {
            saveHistory(state);
            const newElement: EditorElement = {
                id: uuidv4(),
                type: action.payload.type,
                content: getDefaultContent(action.payload.type),
                style: getDefaultStyle(action.payload.type),
            };

            const { parentId, columnId, index } = action.payload;

            if (parentId && columnId) {
                // Add to nested column
                const parent = state.elements.find(el => el.id === parentId);
                if (parent && (parent.type === 'columns' || parent.type === 'columns-3') && parent.content.columns) {
                    const column = parent.content.columns.find(col => col.id === columnId);
                    if (column) {
                        column.elements.push(newElement);
                    }
                }
            } else {
                // Add to root
                if (index !== undefined && index >= 0) {
                    state.elements.splice(index, 0, newElement);
                } else {
                    state.elements.push(newElement);
                }
            }
            state.selectedElementId = newElement.id;
        },
        updateElement: (state, action: PayloadAction<{ id: string; changes: Partial<EditorElement> }>) => {
            saveHistory(state);
            const index = state.elements.findIndex(el => el.id === action.payload.id);
            if (index !== -1) {
                state.elements[index] = { ...state.elements[index], ...action.payload.changes };
            }
        },
        removeElement: (state, action: PayloadAction<string>) => {
            saveHistory(state);
            state.elements = state.elements.filter(el => el.id !== action.payload);
            if (state.selectedElementId === action.payload) {
                state.selectedElementId = null;
            }
        },
        selectElement: (state, action: PayloadAction<string | null>) => {
            // Selection changes do not save history
            state.selectedElementId = action.payload;
        },
        moveElement: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
            saveHistory(state);
            const { dragIndex, hoverIndex } = action.payload;
            const dragElement = state.elements[dragIndex];
            state.elements.splice(dragIndex, 1);
            state.elements.splice(hoverIndex, 0, dragElement);
        },
        updateCanvasSettings: (state, action: PayloadAction<Partial<CanvasSettings>>) => {
            saveHistory(state);
            state.canvasSettings = { ...state.canvasSettings, ...action.payload };
        },
    },
});

function saveHistory(state: EditorState) {
    state.history.past.push({
        elements: state.elements,
        selectedElementId: state.selectedElementId,
        canvasSettings: state.canvasSettings
    });
    state.history.future = []; // Clear future on new action
}

function getDefaultContent(type: EditorElement['type']) {
    switch (type) {
        case 'text': return { text: 'Edit this text' };
        case 'button': return { label: 'Click Me', url: '#' };
        case 'image': return { url: 'https://via.placeholder.com/300x200', alt: 'Placeholder' };
        case 'divider': return {};
        case 'social': return {
            socialLinks: [
                { network: 'facebook' as const, url: '#' },
                { network: 'twitter' as const, url: '#' },
                { network: 'instagram' as const, url: '#' }
            ]
        };
        case 'columns': return {
            columns: [
                { id: uuidv4(), elements: [] },
                { id: uuidv4(), elements: [] }
            ]
        };
        case 'columns-3': return {
            columns: [
                { id: uuidv4(), elements: [] },
                { id: uuidv4(), elements: [] },
                { id: uuidv4(), elements: [] }
            ]
        };
        default: return {};
    }
}

function getDefaultStyle(type: EditorElement['type']) {
    const base = { padding: '10px', margin: '0px' };
    switch (type) {
        case 'button': return { ...base, backgroundColor: '#007bff', color: '#ffffff', borderRadius: '4px', textAlign: 'center' as const, width: 'auto', display: 'inline-block' };
        case 'image': return { ...base, width: '100%', textAlign: 'center' as const };
        case 'spacer': return { ...base, height: '32px' };
        case 'divider': return { ...base, borderTopWidth: '1px', borderTopColor: '#eeeeee', borderTopStyle: 'solid', paddingTop: '10px', paddingBottom: '10px' };
        default: return base;
    }
}

export const { addElement, updateElement, removeElement, selectElement, moveElement, updateCanvasSettings, undo, redo } = editorSlice.actions;
export default editorSlice.reducer;
