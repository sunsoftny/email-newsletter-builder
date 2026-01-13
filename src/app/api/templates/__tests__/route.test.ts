import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '../route';
import { NextResponse } from 'next/server';

// Mock the DB module
vi.mock('@/lib/db', () => ({
    getDb: vi.fn().mockResolvedValue({
        data: { templates: [] },
        update: vi.fn().mockImplementation((cb) => {
            const dbStart = { templates: [] as any[] };
            cb(dbStart);
        })
    }),
}));

describe('API Route: /api/templates', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('GET returns templates', async () => {
        const response = await GET();
        const data = await response.json();
        expect(Array.isArray(data)).toBe(true);
    });

    it('POST saves a new template', async () => {
        const mockRequest = {
            json: async () => ({
                name: 'Test Template',
                data: { some: 'editor state' }
            })
        } as unknown as Request;

        const response = await POST(mockRequest);
        const savedTemplate = await response.json();

        expect(savedTemplate.name).toBe('Test Template');
        expect(savedTemplate.id).toBeDefined();
        expect(savedTemplate.data).toEqual({ some: 'editor state' });
    });
});
