import { EditorState } from './types';

export const SAMPLE_TEMPLATES: { id: string; name: string; data: EditorState }[] = [
    {
        id: 'ultimate-launch',
        name: 'Ultimate Product Launch',
        data: {
            history: { past: [], future: [] },
            selectedElementId: null,
            canvasSettings: {
                width: 600,
                backgroundColor: '#ffffff',
                fontFamily: "'Inter', sans-serif"
            },
            elements: [
                // Row 1: Header
                {
                    id: 'header-logo',
                    type: 'image',
                    content: {
                        url: 'https://via.placeholder.com/200x60/ffffff/333333?text=NEXUS+LAUNCH',
                        alt: 'Nexus Logo'
                    },
                    style: { padding: '20px', textAlign: 'center', backgroundColor: '#111827' }
                },
                // Row 2: Hero Video Area
                {
                    id: 'hero-video',
                    type: 'video',
                    content: {
                        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        thumbnailUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=1200&q=80',
                        alt: 'Launch Video'
                    },
                    style: { padding: '0', width: '100%' }
                },
                // Row 3: Countdown Timer
                {
                    id: 'launch-countdown',
                    type: 'countdown',
                    content: {
                        endTime: new Date(Date.now() + 86400000 * 3).toISOString() // 3 days from now
                    },
                    style: { padding: '30px 0', backgroundColor: '#111827', color: '#ffffff' }
                },
                // Row 4: Intro Text
                {
                    id: 'intro-text',
                    type: 'text',
                    content: {
                        text: '<h1 style="text-align: center; color: #111827; margin-bottom: 10px;">The Future is Here</h1><p style="text-align: center; color: #6b7280; font-size: 18px;">We have combined design, speed, and intelligence into one platform.</p>'
                    },
                    style: { padding: '40px 20px 20px 20px', backgroundColor: '#ffffff' }
                },
                // Row 5: 3-Column Features
                {
                    id: 'features-grid',
                    type: 'columns-3',
                    content: {
                        columns: [
                            {
                                id: 'col-1',
                                elements: [
                                    {
                                        id: 'feat-1-img', type: 'image',
                                        content: { url: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', alt: 'Speed' },
                                        style: { width: '48px', margin: '0 auto 10px auto' }
                                    },
                                    {
                                        id: 'feat-1-text', type: 'text',
                                        content: { text: '<h4 style="text-align: center; margin: 0;">Lightning Fast</h4><p style="text-align: center; font-size: 12px; color: #666;">Optimized for speed.</p>' },
                                        style: { padding: '0 10px' }
                                    }
                                ]
                            },
                            {
                                id: 'col-2',
                                elements: [
                                    {
                                        id: 'feat-2-img', type: 'image',
                                        content: { url: 'https://cdn-icons-png.flaticon.com/512/3135/3135768.png', alt: 'Secure' },
                                        style: { width: '48px', margin: '0 auto 10px auto' }
                                    },
                                    {
                                        id: 'feat-2-text', type: 'text',
                                        content: { text: '<h4 style="text-align: center; margin: 0;">Bank Grade</h4><p style="text-align: center; font-size: 12px; color: #666;">Security first design.</p>' },
                                        style: { padding: '0 10px' }
                                    }
                                ]
                            },
                            {
                                id: 'col-3',
                                elements: [
                                    {
                                        id: 'feat-3-img', type: 'image',
                                        content: { url: 'https://cdn-icons-png.flaticon.com/512/3135/3135823.png', alt: 'Global' },
                                        style: { width: '48px', margin: '0 auto 10px auto' }
                                    },
                                    {
                                        id: 'feat-3-text', type: 'text',
                                        content: { text: '<h4 style="text-align: center; margin: 0;">Global Scale</h4><p style="text-align: center; font-size: 12px; color: #666;">Deploy anywhere.</p>' },
                                        style: { padding: '0 10px' }
                                    }
                                ]
                            }
                        ]
                    },
                    style: { padding: '20px', backgroundColor: '#f9fafb' }
                },
                // Spacer
                { id: 'space-1', type: 'spacer', content: {}, style: { height: '40px' } },
                // Row 6: HTML Block (Custom Badge)
                {
                    id: 'custom-html',
                    type: 'html',
                    content: {
                        html: '<div style="border: 2px dashed #6366f1; padding: 20px; text-align: center; border-radius: 8px; background: #eef2ff;"><span style="color: #4f46e5; font-weight: bold;">EARLY BIRD ACCESS</span></div>'
                    },
                    style: { padding: '0 40px' }
                },
                // Row 7: CTA Button
                {
                    id: 'main-cta',
                    type: 'button',
                    content: { label: 'Claim Your Spot Now', url: 'https://example.com' },
                    style: { padding: '40px', textAlign: 'center' }
                },
                // Divider
                { id: 'footer-div', type: 'divider', content: {}, style: { padding: '20px 0', borderTopColor: '#e5e7eb' } },
                // Row 8: Social Links
                {
                    id: 'footer-social',
                    type: 'social',
                    content: {
                        socialLinks: [
                            { network: 'twitter', url: '#' },
                            { network: 'instagram', url: '#' },
                            { network: 'linkedin', url: '#' }
                        ]
                    },
                    style: { padding: '0 0 20px 0' }
                }
            ]
        }
    },
    {
        id: 'fashion-sale',
        name: 'Summer Lookbook',
        data: {
            history: { past: [], future: [] },
            selectedElementId: null,
            canvasSettings: {
                width: 600,
                backgroundColor: '#fff1f2',
                fontFamily: "'Playfair Display', serif"
            },
            elements: [
                {
                    id: 'sale-header',
                    type: 'text',
                    content: {
                        text: '<h1 style="text-align: center; font-size: 42px; margin: 20px 0; color: #be123c;">SUMMER DROP</h1>'
                    },
                    style: { padding: '20px' }
                },
                {
                    id: 'sale-countdown',
                    type: 'countdown',
                    content: {
                        endTime: new Date(Date.now() + 86400000 * 1).toISOString()
                    },
                    style: { padding: '10px 0 30px 0' }
                },
                {
                    id: 'collection-columns',
                    type: 'columns',
                    content: {
                        columns: [
                            {
                                id: 'c-1',
                                elements: [
                                    {
                                        id: 'p-1', type: 'product',
                                        content: {
                                            imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
                                            text: 'Floral Dress', price: '89.00', currency: '$', label: 'Shop', url: '#'
                                        },
                                        style: { padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }
                                    }
                                ]
                            },
                            {
                                id: 'c-2',
                                elements: [
                                    {
                                        id: 'p-2', type: 'product',
                                        content: {
                                            imageUrl: 'https://images.unsplash.com/photo-1529139574466-a302c27e3844?w=600&q=80',
                                            text: 'Summer Hat', price: '45.00', currency: '$', label: 'Shop', url: '#'
                                        },
                                        style: { padding: '10px', backgroundColor: '#fff', borderRadius: '4px' }
                                    }
                                ]
                            }
                        ]
                    },
                    style: { padding: '0 20px 20px 20px' }
                },
                {
                    id: 'free-shipping',
                    type: 'text',
                    content: { text: '<p style="text-align: center; font-style: italic;">Free shipping on all orders over $100</p>' },
                    style: { padding: '20px' }
                }
            ]
        }
    }
];
