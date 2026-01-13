import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FormEditorState, FormStep, EditorElement, FormSettings, FormBehavior } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const initialSettings: FormSettings = {
    width: 600,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    overlayColor: 'rgba(0, 0, 0, 0.5)',
    overlayOpacity: 0.5,
    position: 'center'
};

const initialBehavior: FormBehavior = {
    triggerConfig: {
        timeoutSeconds: 5,
        exitIntent: true
    },
    displayFrequency: 'once_per_user',
    deviceTargeting: 'all'
};

const initialStep: FormStep = {
    id: uuidv4(),
    name: 'Email Opt-in',
    elements: []
};

const initialState: FormEditorState = {
    steps: [initialStep],
    currentStepId: initialStep.id,
    formSettings: initialSettings,
    behavior: initialBehavior,
    selectedElementId: null,
    history: {
        past: [],
        future: []
    }
};

const formEditorSlice = createSlice({
    name: 'formEditor',
    initialState,
    reducers: {
        // --- Step Management ---
        addStep: (state, action: PayloadAction<{ name: string }>) => {
            saveHistory(state);
            const newStep: FormStep = {
                id: uuidv4(),
                name: action.payload.name,
                elements: []
            };
            state.steps.push(newStep);
            state.currentStepId = newStep.id;
        },
        removeStep: (state, action: PayloadAction<string>) => {
            saveHistory(state);
            state.steps = state.steps.filter(s => s.id !== action.payload);
            if (state.currentStepId === action.payload && state.steps.length > 0) {
                state.currentStepId = state.steps[0].id;
            }
        },
        setActiveStep: (state, action: PayloadAction<string>) => {
            state.currentStepId = action.payload;
            state.selectedElementId = null;
        },
        renameStep: (state, action: PayloadAction<{ id: string; name: string }>) => {
            saveHistory(state);
            const step = state.steps.find(s => s.id === action.payload.id);
            if (step) {
                step.name = action.payload.name;
            }
        },

        // --- Global Settings ---
        updateFormSettings: (state, action: PayloadAction<Partial<FormSettings>>) => {
            saveHistory(state);
            state.formSettings = { ...state.formSettings, ...action.payload };
        },
        updateBehavior: (state, action: PayloadAction<Partial<FormBehavior>>) => {
            saveHistory(state);
            state.behavior = { ...state.behavior, ...action.payload };
        },

        // --- Element Management (Scoped to Current Step) ---
        addElement: (state, action: PayloadAction<{ type: EditorElement['type']; index?: number }>) => {
            saveHistory(state);
            const currentStep = state.steps.find(s => s.id === state.currentStepId);
            if (!currentStep) return;

            const newElement: EditorElement = {
                id: uuidv4(),
                type: action.payload.type,
                content: getDefaultContent(action.payload.type),
                style: getDefaultStyle(action.payload.type),
            };

            if (action.payload.index !== undefined && action.payload.index >= 0) {
                currentStep.elements.splice(action.payload.index, 0, newElement);
            } else {
                currentStep.elements.push(newElement);
            }
            state.selectedElementId = newElement.id;
        },
        updateElement: (state, action: PayloadAction<{ id: string; changes: Partial<EditorElement> }>) => {
            saveHistory(state);
            const currentStep = state.steps.find(s => s.id === state.currentStepId);
            if (!currentStep) return;

            const index = currentStep.elements.findIndex(el => el.id === action.payload.id);
            if (index !== -1) {
                currentStep.elements[index] = { ...currentStep.elements[index], ...action.payload.changes };
            }
        },
        removeElement: (state, action: PayloadAction<string>) => {
            saveHistory(state);
            const currentStep = state.steps.find(s => s.id === state.currentStepId);
            if (!currentStep) return;

            currentStep.elements = currentStep.elements.filter(el => el.id !== action.payload);
            if (state.selectedElementId === action.payload) {
                state.selectedElementId = null;
            }
        },
        selectElement: (state, action: PayloadAction<string | null>) => {
            state.selectedElementId = action.payload;
        },
        moveElement: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number }>) => {
            saveHistory(state);
            const currentStep = state.steps.find(s => s.id === state.currentStepId);
            if (!currentStep) return;

            const { dragIndex, hoverIndex } = action.payload;
            const dragElement = currentStep.elements[dragIndex];
            currentStep.elements.splice(dragIndex, 1);
            currentStep.elements.splice(hoverIndex, 0, dragElement);
        },

        // --- History ---
        undo: (state) => {
            if (state.history.past.length > 0) {
                const previous = state.history.past[state.history.past.length - 1];
                const newPast = state.history.past.slice(0, -1);

                state.history.future.unshift({
                    steps: state.steps,
                    formSettings: state.formSettings,
                    behavior: state.behavior,
                    currentStepId: state.currentStepId
                });

                state.steps = previous.steps;
                state.formSettings = previous.formSettings;
                state.behavior = previous.behavior;
                state.currentStepId = previous.currentStepId;
                state.history.past = newPast;
            }
        },
        redo: (state) => {
            if (state.history.future.length > 0) {
                const next = state.history.future[0];
                const newFuture = state.history.future.slice(1);

                state.history.past.push({
                    steps: state.steps,
                    formSettings: state.formSettings,
                    behavior: state.behavior,
                    currentStepId: state.currentStepId
                });

                state.steps = next.steps;
                state.formSettings = next.formSettings;
                state.behavior = next.behavior;
                state.currentStepId = next.currentStepId;
                state.history.future = newFuture;
            }
        }
    }
});

function saveHistory(state: FormEditorState) {
    // Limit history size if needed
    if (state.history.past.length > 20) {
        state.history.past.shift();
    }
    state.history.past.push({
        steps: JSON.parse(JSON.stringify(state.steps)), // Deep copy
        formSettings: { ...state.formSettings },
        behavior: { ...state.behavior },
        currentStepId: state.currentStepId
    });
    state.history.future = [];
}

function getDefaultContent(type: EditorElement['type']) {
    switch (type) {
        case 'text': return { text: '<strong>Sign up for updates</strong><br>Get news and special offers.' };
        case 'image': return { url: 'https://via.placeholder.com/150', alt: 'Placeholder' };
        case 'form-input': return { label: 'Email Address', placeholder: 'Enter your email', required: true, inputType: 'email' };
        case 'form-submit': return { label: 'Subscribe', width: '100%' };
        case 'button': return { label: 'No thanks', url: '#', width: 'auto' };
        case 'spacer': return {};
        case 'divider': return {};
        default: return {};
    }
}

function getDefaultStyle(type: EditorElement['type']) {
    const base = { padding: '10px', margin: '0px' };
    switch (type) {
        case 'form-submit': return {
            ...base,
            backgroundColor: '#333333',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '4px',
            textAlign: 'center' as const,
            fontWeight: 'bold',
            width: '100%',
            cursor: 'pointer'
        };
        case 'form-input': return {
            ...base,
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '10px',
            width: '100%',
            backgroundColor: '#fff',
            color: '#333'
        };
        case 'text': return { ...base, textAlign: 'center' as const, color: '#333' };
        case 'button': return { ...base, color: '#666', textDecoration: 'underline', fontSize: '14px', textAlign: 'center' as const };
        default: return base;
    }
}


export const {
    addStep, removeStep, setActiveStep, renameStep,
    updateFormSettings, updateBehavior,
    addElement, updateElement, removeElement, selectElement, moveElement,
    undo, redo
} = formEditorSlice.actions;

export default formEditorSlice.reducer;
