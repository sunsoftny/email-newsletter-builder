import { EditorState } from './types';

export const SAMPLE_TEMPLATES: { id: string; name: string; data: EditorState }[] = [
    {
        id: 'welcome-modern',
        name: 'Modern Welcome',
        data: {
            history: { past: [], future: [] },
            selectedElementId: null,
            canvasSettings: {
                width: 600,
                backgroundColor: '#f8fafc',
                fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif"
            },
            elements: [
                {
                    id: 'logo-area',
                    type: 'image',
                    content: {
                        url: 'https://via.placeholder.com/150x50/transparent/333333?text=BRAND+LOGO',
                        alt: 'Logo'
                    },
                    style: { padding: '20px 0', width: '150px', height: 'auto', textAlign: 'center', margin: '0 auto' }
                },
                {
                    id: 'hero-image',
                    type: 'image',
                    content: {
                        url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80',
                        alt: 'Team'
                    },
                    style: { padding: '0', width: '100%', height: 'auto', borderRadius: '8px 8px 0 0' }
                },
                {
                    id: 'welcome-text',
                    type: 'text',
                    content: {
                        text: '<h1 style="margin: 0 0 16px 0; color: #1e293b; font-size: 28px; line-height: 1.2;">Welcome to the Future.</h1><p style="margin: 0 0 24px 0; color: #475569; font-size: 16px; line-height: 1.6;">We are thrilled to have you on board. Our platform provides everything you need to build stunning automated workflows in minutes.</p>'
                    },
                    style: { padding: '40px 30px', backgroundColor: '#ffffff', textAlign: 'center' }
                },
                {
                    id: 'cta-button',
                    type: 'button',
                    content: {
                        label: 'Start Dashboard',
                        url: '#'
                    },
                    style: { padding: '0 0 40px 0', backgroundColor: '#ffffff', textAlign: 'center', borderRadius: '0 0 8px 8px' }
                },
                {
                    id: 'footer-social',
                    type: 'social',
                    content: {
                        socialLinks: [
                            { network: 'twitter', url: 'https://twitter.com' },
                            { network: 'linkedin', url: 'https://linkedin.com' },
                            { network: 'instagram', url: 'https://instagram.com' }
                        ]
                    },
                    style: { padding: '40px 0 20px 0', color: '#94a3b8' }
                },
                {
                    id: 'footer-text',
                    type: 'text',
                    content: {
                        text: '<p style="font-size: 12px; color: #94a3b8; margin: 0;">© 2026 Your Company Inc. All rights reserved.<br>123 Innovation Dr, Tech City, TC 94043</p>'
                    },
                    style: { padding: '0 20px 40px 20px', textAlign: 'center' }
                }
            ]
        }
    },
    {
        id: 'newsletter-tech',
        name: 'Tech Weekly',
        data: {
            history: { past: [], future: [] },
            selectedElementId: null,
            canvasSettings: {
                width: 600,
                backgroundColor: '#ffffff',
                fontFamily: "'Roboto', sans-serif"
            },
            elements: [
                {
                    id: 'header-strip',
                    type: 'text',
                    content: {
                        text: '<div style="display: flex; justify-content: space-between; align-items: center;"><strong style="font-size: 20px; color: #000;">TECH WEEKLY</strong><span style="font-size: 12px; color: #666; background: #eee; padding: 4px 8px; rounded: 4px;">ISSUE #89</span></div>'
                    },
                    style: { padding: '20px 0', borderBottom: '2px solid #000' }
                },
                {
                    id: 'main-story-img',
                    type: 'image',
                    content: {
                        url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80',
                        alt: 'Coding'
                    },
                    style: { padding: '30px 0 20px 0', width: '100%' }
                },
                {
                    id: 'main-story-text',
                    type: 'text',
                    content: {
                        text: '<h2 style="font-size: 24px; margin-bottom: 12px;">The Rise of AI Agents</h2><p style="color: #444; line-height: 1.6;">Artificial Intelligence is no longer just a chatbot. It is acting, doing, and building. In this weeks deep dive, we explore how agents are reshaping software development.</p>'
                    },
                    style: { padding: '0 0 30px 0' }
                },
                {
                    id: 'read-more-btn',
                    type: 'button',
                    content: {
                        label: 'Read Full Story',
                        url: '#'
                    },
                    style: { padding: '0 0 30px 0', textAlign: 'left' }
                },
                {
                    id: 'divider',
                    type: 'divider',
                    content: {},
                    style: { padding: '20px 0', borderTopColor: '#eeeeee' }
                },
                {
                    id: 'secondary-title',
                    type: 'text',
                    content: {
                        text: '<h3 style="font-size: 18px; margin: 0;">More Highlights</h3>'
                    },
                    style: { padding: '10px 0' }
                },
                {
                    id: 'list-items',
                    type: 'text',
                    content: {
                        text: '<ul style="padding-left: 20px; color: #555; line-height: 1.8;"><li><strong>React 19 Release:</strong> Everything you need to know about the new compiler.</li><li><strong>CSS Container Queries:</strong> Finally supported in all major browsers.</li><li><strong>TypeScript 5.4:</strong> NoInference type utility explained.</li></ul>'
                    },
                    style: { padding: '0 0 30px 0' }
                }
            ]
        }
    },
    {
        id: 'ecommerce-sale',
        name: 'Summer Sale',
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
                    id: 'sale-banner',
                    type: 'text',
                    content: {
                        text: '<div style="background: #e11d48; color: white; padding: 40px 20px; text-align: center;"><h1 style="font-size: 48px; margin: 0;">SUMMER SALE</h1><p style="font-size: 18px; margin: 10px 0 0 0; letter-spacing: 2px;">UP TO 50% OFF</p></div>'
                    },
                    style: { padding: '0', width: '100%' }
                },
                {
                    id: 'product-1',
                    type: 'product',
                    content: {
                        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
                        text: 'Minimal Watch',
                        price: '129.00',
                        currency: '$',
                        label: 'Shop Now',
                        url: '#'
                    },
                    style: { padding: '40px 20px', backgroundColor: '#ffffff', margin: '20px', borderRadius: '8px' }
                },
                {
                    id: 'product-2',
                    type: 'product',
                    content: {
                        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
                        text: 'Premium Headphones',
                        price: '249.00',
                        currency: '$',
                        label: 'Shop Now',
                        url: '#'
                    },
                    style: { padding: '0 20px 40px 20px', backgroundColor: '#ffffff', margin: '0 20px 20px 20px', borderRadius: '8px' }
                },
                {
                    id: 'footer-sale',
                    type: 'text',
                    content: {
                        text: '<p style="text-align: center; font-size: 14px; color: #881337;">Offer ends Sunday at midnight. Free shipping on orders over $50.</p>'
                    },
                    style: { padding: '20px' }
                }
            ]
        }
    }
];
