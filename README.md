# Email Newsletter Builder

![Email Newsletter Builder Banner](https://placehold.co/1200x400/2563eb/ffffff?text=Email+Newsletter+Builder)

A professional, drag-and-drop email newsletter builder for React and Next.js applications. Built with Tailwind CSS, Redux Toolkit, and React DnD.

[![NPM Version](https://img.shields.io/npm/v/email-newsletter-builder)](https://www.npmjs.com/package/email-newsletter-builder)
[![License](https://img.shields.io/npm/l/email-newsletter-builder)](https://github.com/sunsoftny/email-newsletter-builder/blob/main/LICENSE)
[![GitHub](https://img.shields.io/github/stars/sunsoftny/email-newsletter-builder?style=social)](https://github.com/sunsoftny/email-newsletter-builder)

## Features

- 🎨 **Drag & Drop Interface**: Intuitive WYSIWYG editor.
- 📱 **Responsive Output**: Generates HTML optimized for email clients.
- 🧩 **Modular Components**: Text, Image, Button, Divider, Spacer, and Social blocks.
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

The editor is designed to be purely frontend. To save templates, you need to connect it to your API.

### Customizing Data Persistence

The editor operates on a JSON state. You can extract this state to save it, and load it back later.

*(Note: Currently, the header contains a default persistence logic pointing to local API routes. In a future version, we will expose props to override `onSave` and `onLoad` directly on the `<EmailEditor />` component.)*

For now, the easiest way to customize persistence is to fork the component or mount the internal Redux store if you need deep control.

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
