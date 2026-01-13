import { EditorState } from './types';

export const SAMPLE_TEMPLATES: { id: string; name: string; data: EditorState }[] = [
    {
        id: 'welcome-1',
        name: 'Welcome Email',
        data: {
            history: { past: [], future: [] },
            selectedElementId: null,
            canvasSettings: {
                width: 600,
                backgroundColor: '#f3f4f6',
                fontFamily: 'Arial, sans-serif'
            },
            elements: [
                {
                    id: 'header-1',
                    type: 'image',
                    content: {
                        url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80',
                        alt: 'Welcome Header'
                    },
                    style: { padding: '0px', width: '100%', height: 'auto', textAlign: 'center' }
                },
                {
                    id: 'text-1',
                    type: 'text',
                    content: {
                        text: '<h1 style="text-align: center;">Welcome to the Family!</h1><p style="text-align: center;">We represent the future of email marketing. Thanks for joining us.</p>'
                    },
                    style: { padding: '20px', backgroundColor: '#ffffff', color: '#333333', textAlign: 'center' }
                },
                {
                    id: 'btn-1',
                    type: 'button',
                    content: {
                        label: 'Get Started',
                        url: 'https://example.com'
                    },
                    style: { padding: '20px', backgroundColor: '#ffffff', textAlign: 'center' }
                }
            ]
        }
    },
    {
        id: 'newsletter-1',
        name: 'Monthly Update',
        data: {
            history: { past: [], future: [] },
            selectedElementId: null,
            canvasSettings: {
                width: 600,
                backgroundColor: '#ffffff',
                fontFamily: "'Helvetica Neue', Helvetica, sans-serif"
            },
            elements: [
                {
                    id: 'nav-1',
                    type: 'text',
                    content: {
                        text: '<div style="display: flex; justify-content: space-between; font-size: 12px; color: #666;"><span>JANUARY 2026</span><span>ISSUE #42</span></div>',
                    },
                    style: { padding: '15px 30px', borderBottom: '1px solid #eee' }
                },
                {
                    id: 'text-intro',
                    type: 'text',
                    content: {
                        text: '<h2>Big Things Coming</h2><p>This month we have been working hard on the new features you requested. Check them out below.</p>',
                    },
                    style: { padding: '30px' }
                },
                {
                    id: 'divider-1',
                    type: 'divider',
                    content: {},
                    style: { padding: '10px', borderTopColor: '#eeeeee' }
                }

            ]
        }
    }
];
