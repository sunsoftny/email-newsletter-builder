export type ElementType = 'text' | 'image' | 'button' | 'divider' | 'social' | 'spacer' | 'columns' | 'columns-3' | 'section' | 'product' | 'video' | 'countdown' | 'html';

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

export interface EditorState {
    elements: EditorElement[];
    selectedElementId: string | null;
    canvasSettings: CanvasSettings;
    history: {
        past: any[];
        future: any[];
    };
}
