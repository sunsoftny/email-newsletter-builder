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
                if (parent && (parent.type === 'columns' || parent.type === 'columns-3' || parent.type === 'section') && parent.content.columns) {
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
        loadState: (state, action: PayloadAction<EditorState>) => {
            state.elements = action.payload.elements;
            state.canvasSettings = action.payload.canvasSettings;
            state.history = { past: [], future: [] }; // Reset history
            state.selectedElementId = null;
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
        case 'section': return {
            columns: [
                { id: uuidv4(), elements: [] }
            ]
        };
        case 'product': return {
            imageUrl: 'https://via.placeholder.com/300x300',
            text: 'Amazing Product Title',
            price: '99.99',
            currency: '$',
            url: '#',
            label: 'Buy Now'
        };
        case 'video': return {
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnailUrl: 'https://via.placeholder.com/600x337.png?text=Video+Thumbnail',
            alt: 'Watch Video'
        };
        case 'countdown': return {
            endTime: new Date(Date.now() + 86400000).toISOString(), // 24 hours from now
            style: { backgroundColor: '#f0f0f0', padding: '10px' }
        };
        case 'html': return {
            html: '<div style="background:#f8f9fa;padding:20px;text-align:center;border:1px dashed #ccc;"><strong>HTML Block</strong><br/>Edit to add custom code</div>'
        };
        default: return {};
    }
}

function getDefaultStyle(type: EditorElement['type']) {
    const base = { padding: '10px', margin: '0px', mobile: {} }; // Init mobile defaults
    switch (type) {
        case 'button': return { ...base, padding: '10px 20px', backgroundColor: '#007bff', color: '#ffffff', borderRadius: '4px', textAlign: 'center' as const, width: 'auto', display: 'inline-block' };
        case 'image': return { ...base, width: '100%', textAlign: 'center' as const };
        case 'spacer': return { ...base, height: '32px' };
        case 'divider': return { ...base, borderTopWidth: '1px', borderTopColor: '#eeeeee', borderTopStyle: 'solid', paddingTop: '10px', paddingBottom: '10px' };
        case 'section': return { padding: '20px 0px', margin: '0px', backgroundColor: '#ffffff', width: '100%', mobile: {} };
        case 'product': return { ...base, backgroundColor: '#ffffff', textAlign: 'center' as const };
        case 'video': return { ...base, width: '100%', textAlign: 'center' as const };
        case 'countdown': return { ...base, padding: '20px', backgroundColor: '#333333', color: '#ffffff', textAlign: 'center' as const };
        default: return base;
    }
}

export const { addElement, updateElement, removeElement, selectElement, moveElement, updateCanvasSettings, undo, redo, loadState } = editorSlice.actions;
export default editorSlice.reducer;
