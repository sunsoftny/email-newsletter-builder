# Email Newsletter Builder

![Email Newsletter Builder Banner](https://placehold.co/1200x400/2563eb/ffffff?text=Email+Newsletter+Builder)

A professional, drag-and-drop email newsletter builder for React and Next.js applications. Built with Tailwind CSS, Redux Toolkit, and React DnD.

[![NPM Version](https://img.shields.io/npm/v/email-newsletter-builder)](https://www.npmjs.com/package/email-newsletter-builder)
[![License](https://img.shields.io/npm/l/email-newsletter-builder)](https://github.com/sunsoftny/email-newsletter-builder/blob/main/LICENSE)
[![GitHub](https://img.shields.io/github/stars/sunsoftny/email-newsletter-builder?style=social)](https://github.com/sunsoftny/email-newsletter-builder)

## 🚀 [Live Demo](https://email-newsletter-builder.vercel.app/)

## Features

- 🎨 **Drag & Drop Interface**: Intuitive WYSIWYG editor.
- 📱 **Responsive Output**: Generates HTML optimized for email clients.
- 🧩 **Modular Components**: Text, Image, Button, Product, Video, Countdown, Divider, Spacer, HTML, and Social blocks.
- 🏗️ **Advanced Features**: Custom HTML block and dynamic Merge Tags for personalization.
- 💅 **Professional UI**: Built with a clean, modern aesthetic using Tailwind CSS.
- 💾 **State Managment**: Powered by Redux Toolkit for robust undo/redo and persistence.
- 🔌 **Backend Agnostic**: Easily integrate with any backend (Node, PHP, Python, etc.).

## Installation

Install the package via npm:

```bash
npm install email-newsletter-builder
```

You also need peer dependencies if not already installed:

```bash
npm install react react-dom @reduxjs/toolkit react-redux react-dnd react-dnd-html5-backend lucide-react tailwind-merge clsx
```

## Quick Start

### 1. Import Styles
Import the CSS globally in your application (e.g., in `_app.tsx`, `layout.tsx`, or `main.tsx`).

```tsx
import 'email-newsletter-builder/dist/index.css';
```

### Loading Saved Templates

You can preload a template by passing the `initialState` prop. This is perfect for loading data from an API or database.

```tsx
import { useState, useEffect } from 'react';
import { EmailEditor } from 'email-newsletter-builder';

const MyEditorPage = ({ templateId }) => {
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // Fetch your template JSON from your API
    fetch(`/api/templates/${templateId}`)
      .then(res => res.json())
      .then(data => setInitialData(data.content));
  }, [templateId]);

  if (!initialData) return <div>Loading...</div>;

  return (
    <EmailEditor
      initialState={initialData}
      onSave={async (data) => {
        console.log('Saving updated template:', data);
      }}
    />
  );
};
```

### Customizing the Editor
Use the `EmailEditor` component in your page.

```tsx
import { EmailEditor } from 'email-newsletter-builder';

export default function Page() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <EmailEditor />
    </div>
  );
}
```

## Integrating with a Backend

The editor is designed to be backend-agnostic. It provides callback props for all major actions (Save, Load, Upload Image, Send Test Email).

For a detailed walkthrough on connecting AWS S3, Supabase, Resend, or SendGrid, please read the **[Integration Guide](INTEGRATION_GUIDE.md)**.

For integrating with **Django, PHP, or Laravel**, see the [Non-React Integration](INTEGRATION_GUIDE.md#4-integration-with-non-react-backends-django-php-laravel-etc) section.

### Props API

```tsx
<EmailEditor
  // Save the JSON state to your DB
  onSave={async (data) => await saveToDb(data)}
  
  // Load templates from your DB
  onLoad={async () => await fetchTemplates()}
  
  // Handle image uploads (S3/Supabase)
  onUploadImage={async (file) => await uploadToS3(file)}
  
  // Handle test emails (Resend/SendGrid)
  onSendTestEmail={async (email, html) => await sendTest(email, html)}

  // [NEW] AI Features (Optional)
  aiFeatures={{
      onTextConnect: async (mode, context, prompt) => { 
        // Call your AI text API (OpenAI/Anthropic)
        return "Generated text..."; 
      },
      onImageConnect: async (prompt) => {
        // Call your image generation API (DALL-E/Midjourney)
        return "https://image.url";
      },
      onLayoutConnect: async (prompt) => {
        // Call your AI layout generator
        return editorState;
      },
      onAnalyzeConnect: async (data, html) => {
        // Call your analysis API
        return { subjectLines: ["Suggesion 1"], spamScore: 0.5 };
      }
  }}
/>
```

## 🤖 AI Integration

The builder supports 4 key AI modules:

1.  **AI Text Assistant**: Rewrite, fix grammar, or expand text directly in the Properties Panel.
2.  **AI Image Generation**: Generate images from prompts within any image input.
3.  **Magic Layout Generator**: Build entire newsletters from a single text description.
4.  **Smart Subject Line Optimizer**: Analyze content and suggest optimized subject lines.

To enable these, simply providing the `aiFeatures` prop with your async callbacks. The builder handles all the UI/UX (modals, loading states, error handling).

## 📊 Data Structure

The editor persists its state as a JSON object (`EditorState`). You can programmatically generate or manipulate this JSON to create dynamic templates.

### Schema Overview

```typescript
interface EditorState {
  canvasSettings: {
    width: number;           // e.g. 600
    backgroundColor: string; // e.g. "#ffffff"
    fontFamily: string;      // e.g. "Open Sans"
    // ...
  };
  elements: EditorElement[]; // Ordered list of content blocks
}
```

### Element Structure

Each block in the `elements` array follows this pattern:

```json
{
  "id": "unique-uuid-v4",
  "type": "text", // or 'image', 'button', 'columns', etc.
  "content": {
    "text": "<p>Hello World</p>",
    "url": "https://...",
    "imageUrl": "..."
  },
  "style": {
    "padding": "20px",
    "backgroundColor": "transparent",
    "textAlign": "left"
  }
}
```

## Exporting HTML

The library includes a utility to generate email-ready HTML from the editor state.

```typescript
import { generateHtml } from 'email-newsletter-builder';

// Assuming you have access to the editor state (e.g., via a custom save handler)
const html = generateHtml(editorState);
console.log(html);
```

## Development

If you want to run this project locally to contribute:

```bash
git clone git@github.com:sunsoftny/email-newsletter-builder.git
cd email-newsletter-builder
npm install
npm run dev
```

## License

MIT © [Sunsoft NY](https://github.com/sunsoftny)
