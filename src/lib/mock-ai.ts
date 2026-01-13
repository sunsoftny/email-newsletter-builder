import { AiFeatures } from './types';

export const mockAiFeatures: AiFeatures = {
    onTextConnect: async (mode: string, context: string, prompt?: string) => {
        console.log('AI Text Generation Triggered:', { mode, context, prompt });
        await new Promise(resolve => setTimeout(resolve, 1000));
        return `[AI Generated Text for ${mode}] ${prompt || ''}`;
    },
    onImageConnect: async (prompt: string) => {
        console.log('AI Image Generation Triggered:', prompt);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return "https://picsum.photos/400/300"; // Dummy image
    },
    onLayoutConnect: async (prompt: string) => {
        console.log('AI Layout Generation Triggered:', prompt);
        await new Promise(resolve => setTimeout(resolve, 1000));
        alert('Magic Layout generation simulated! Check console.');
        // Return dummy empty state to satisfy type
        return {
            elements: [],
            canvasSettings: { width: 600, backgroundColor: '#ffffff', globalStyles: {}, fontFamily: 'Recia' },
            selectedElementId: null,
            history: { past: [], future: [] }

        };
    },
    onAnalyzeConnect: async (data: any, html: string) => {
        console.log('AI Analysis Triggered');
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            subjectLines: [
                "🚀 Boost your open rates with this tip",
                "🔥 Exclusive offer inside!",
                "Weekly Digest: What you missed"
            ],
            spamScore: 1.5
        };
    }
};
