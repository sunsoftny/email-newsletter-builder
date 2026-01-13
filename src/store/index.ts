import { configureStore } from '@reduxjs/toolkit';
import editorReducer from './editorSlice';
import formEditorReducer from './formEditorSlice';

export const store = configureStore({
    reducer: {
        editor: editorReducer,
        formEditor: formEditorReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
