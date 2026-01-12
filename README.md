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

### 2. Render the Editor
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
/>
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
