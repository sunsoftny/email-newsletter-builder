export type ElementType = 'text' | 'image' | 'button' | 'divider' | 'social' | 'spacer';

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
    items?: any[];
  };
  style: ElementStyle;
}

export interface CanvasSettings {
  width: number;
  backgroundColor: string;
  fontFamily: string;
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
