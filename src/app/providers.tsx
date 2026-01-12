'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <DndProvider backend={HTML5Backend}>
                {children}
            </DndProvider>
        </Provider>
    );
}
