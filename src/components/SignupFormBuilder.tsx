"use client";

import React from 'react';
import { Provider } from 'react-redux';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { store } from '@/store';
import FormLayout from '@/components/form-builder/FormLayout';

interface SignupFormBuilderProps {
    // Optional props for initial configuration
    initialData?: any;
}

export const SignupFormBuilder: React.FC<SignupFormBuilderProps> = (props) => {
    return (
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                <div className="signup-form-builder-container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <FormLayout />
                </div>
            </DndProvider>
        </Provider>
    );
};
