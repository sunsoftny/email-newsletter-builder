import { render, screen, waitFor } from '@testing-library/react';
import { SubjectLineModal } from '../SubjectLineModal';
import { describe, it, expect, vi } from 'vitest';

describe('SubjectLineModal', () => {
    const mockOnClose = vi.fn();

    it('handles valid analysis result', async () => {
        const mockResult = { subjectLines: ['Subject 1', 'Subject 2'], spamScore: 2 };
        render(
            <SubjectLineModal
                isOpen={true}
                onClose={mockOnClose}
                onAnalyze={async () => mockResult}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('Subject 1')).toBeDefined();
            expect(screen.getByText('Spam Score: 2/10')).toBeDefined();
        });
    });

    it('DOMINIC-FIX: handles invalid AI response format safely', async () => {
        // @ts-ignore - Intentional bad data
        const mockAnalyze = vi.fn().mockResolvedValue({ somethingElse: 'error' });

        render(
            <SubjectLineModal
                isOpen={true}
                onClose={mockOnClose}
                onAnalyze={mockAnalyze}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('No suggestions found.')).toBeDefined();
        });
    });
});
