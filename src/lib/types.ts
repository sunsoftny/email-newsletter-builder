export type ElementType = 'text' | 'image' | 'button' | 'divider' | 'social' | 'spacer' | 'columns' | 'columns-3' | 'section' | 'product' | 'video' | 'countdown' | 'html' | 'form-input' | 'form-submit';

// Form Builder Interfaces
export interface FormStep {
    id: string;
    name: string; // e.g., "Teaser", "Email Opt-in", "Success"
    elements: EditorElement[];
}

export interface FormSettings {
    width: number;
    backgroundColor: string;
    borderRadius: number;
    padding: string;
    fontFamily: string;
    // Overlay settings
    overlayColor?: string;
    overlayOpacity?: number;
    // Position for teasers
    position?: 'bottom-left' | 'bottom-right' | 'center';
}

export interface FormBehavior {
    triggerConfig: {
        scrolledPercentage?: number;
        exitIntent?: boolean;
        timeoutSeconds?: number;
    };
    displayFrequency: 'always' | 'once_per_session' | 'once_per_user';
    deviceTargeting: 'all' | 'desktop' | 'mobile';
}

export interface FormEditorState {
    steps: FormStep[];
    currentStepId: string;
    formSettings: FormSettings;
    behavior: FormBehavior;
    selectedElementId: string | null;
    history: {
        past: any[]; // simpler typing for internal history
        future: any[];
    };
}


export interface MergeTag {
    value: string;
    label: string;
}

export interface SocialItem {
    network: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
    url: string;
}

export interface Column {
    id: string;
    elements: EditorElement[];
}

export interface ElementStyle {
    padding?: string;
    margin?: string;
    backgroundColor?: string;
    color?: string;
    fontSize?: string;
    fontWeight?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
    width?: string;
    height?: string;
    borderRadius?: string;
    border?: string;
    // Dynamic properties for columns
    flex?: string;
    // Mobile Overrides
    mobile?: Partial<ElementStyle>;
    [key: string]: any;
}

export interface EditorElement {
    id: string;
    type: ElementType;
    content: {
        text?: string;
        url?: string;
        alt?: string;
        label?: string;
        html?: string;
        // Product / Video
        imageUrl?: string;
        thumbnailUrl?: string; // For video
        price?: string;
        currency?: string;
        // Countdown
        endTime?: string;
        // Social
        socialLinks?: SocialItem[];
        // Form Inputs
        inputType?: string;
        placeholder?: string;
        required?: boolean;
        // Columns
        columns?: Column[];
    };
    style: ElementStyle;
}

export interface CanvasSettings {
    width: number;
    backgroundColor: string;
    fontFamily: string;
    textColor?: string;
    linkColor?: string;
    lineHeight?: string;
}

// ... existing types

export interface AiFeatures {
    /**
     * Rewrite or generate text based on a prompt and context.
     * @param mode - The context/goal (e.g., 'rewrite', 'shorten', 'professional')
     * @param currentText - The existing text
     * @param prompt - Optional custom prompt from user
     */
    onTextConnect?: (mode: 'rewrite' | 'fix' | 'shorten' | 'expand' | 'tone', currentText: string, prompt?: string) => Promise<string>;

    /**
     * Generate an image from a prompt.
     * @returns The URL of the generated (and uploaded) image.
     */
    onImageConnect?: (prompt: string) => Promise<string>;

    /**
     * Generate a complete newsletter layout from a description.
     * @returns A partial EditorState to replace the canvas.
     */
    onLayoutConnect?: (prompt: string) => Promise<EditorState>;

    /**
 * Analyze content and return suggestions.
 */
    onAnalyzeConnect?: (fullJson: any, fullHtml: string) => Promise<{
        subjectLines: string[];
        spamScore?: number;
    }>;
}

export interface EditorState {
    elements: EditorElement[];
    selectedElementId: string | null;
    canvasSettings: CanvasSettings;
    history: {
        past: any[];
        future: any[];
    };
}
