import { EditorState, EditorElement } from './types';

export function scrapeContent(state: EditorState): { plainText: string, html: string } {
    const textParts: string[] = [];

    function traverse(elements: EditorElement[]) {
        elements.forEach(el => {
            if (el.content.text) {
                // Strip HTML tags if any (basic regex)
                const text = el.content.text.replace(/<[^>]*>?/gm, ' ');
                textParts.push(text);
            }
            if (el.content.label) textParts.push(el.content.label);
            if (el.content.alt) textParts.push(el.content.alt);

            // Nested columns
            if (el.content.columns) {
                el.content.columns.forEach(col => traverse(col.elements));
            }
        });
    }

    traverse(state.elements);

    return {
        plainText: textParts.join('\n'), // Joining with newlines for context
        html: '' // We might not need to regenerate HTML here if we just want text for the LLM
    };
}
