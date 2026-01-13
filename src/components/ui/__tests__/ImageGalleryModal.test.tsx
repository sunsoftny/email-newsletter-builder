import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ImageGalleryModal } from '../ImageGalleryModal';
import { describe, it, expect, vi } from 'vitest';

describe('ImageGalleryModal', () => {
    const mockOnClose = vi.fn();
    const mockOnSelect = vi.fn();

    it('handles valid image list', async () => {
        const mockImages = ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'];
        render(
            <ImageGalleryModal
                isOpen={true}
                onClose={mockOnClose}
                onSelect={mockOnSelect}
                fetchImages={async () => mockImages}
            />
        );

        await waitFor(async () => {
            const images = await screen.findAllByAltText(/Gallery image/);
            expect(images).toHaveLength(2);
        });
    });

    it('DOMINIC-FIX: handles non-array data safely', async () => {
        // @ts-ignore - Intentional bad data
        const mockFetch = vi.fn().mockResolvedValue("Not an array");

        render(
            <ImageGalleryModal
                isOpen={true}
                onClose={mockOnClose}
                onSelect={mockOnSelect}
                fetchImages={mockFetch}
            />
        );

        await waitFor(() => {
            expect(screen.getByText('No images found')).toBeDefined();
        });
    });
});
