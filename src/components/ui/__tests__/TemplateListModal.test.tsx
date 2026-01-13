import { render, screen, waitFor } from '@testing-library/react';
import { TemplateListModal } from '../TemplateListModal';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('TemplateListModal', () => {
    const mockOnClose = vi.fn();
    const mockOnLoad = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders gracefully when open', () => {
        render(
            <TemplateListModal
                isOpen={true}
                onClose={mockOnClose}
                onLoad={mockOnLoad}
                fetchTemplates={async () => []}
            />
        );
        expect(screen.getByText('Load Template')).toBeDefined();
    });

    it('handles valid array data', async () => {
        const mockTemplates = [{ id: '1', name: 'Test Template', updatedAt: new Date().toISOString(), data: {} }];
        render(
            <TemplateListModal
                isOpen={true}
                onClose={mockOnClose}
                onLoad={mockOnLoad}
                fetchTemplates={async () => mockTemplates}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Test Template')).toBeDefined();
        });
    });

    it('handles API failure safely (does not crash)', async () => {
        const mockFetch = vi.fn().mockRejectedValue(new Error('API Error'));
        render(
            <TemplateListModal
                isOpen={true}
                onClose={mockOnClose}
                onLoad={mockOnLoad}
                fetchTemplates={mockFetch}
            />
        );

        await waitFor(() => {
            // Should show empty state or at least not crash
            expect(screen.queryByText('Loading templates...')).toBeNull();
        });
    });

    it('DOMINIC-FIX: handles non-array data safely (prevents .map is not function)', async () => {
        // @ts-ignore - Intentional bad data
        const mockFetch = vi.fn().mockResolvedValue({ error: 'Some error object' });

        render(
            <TemplateListModal
                isOpen={true}
                onClose={mockOnClose}
                onLoad={mockOnLoad}
                fetchTemplates={mockFetch}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('No templates found.')).toBeDefined();
        });
    });
});
