# Integration Guide: Email Newsletter Builder

This library is a pure UI component. It does not handle backend logic (like uploading files or sending emails) directly. Instead, it exposes callback props (`onUploadImage`, `onSendTestEmail`, `onSave`) that allow you to connect it to **any** backend service or API.

## 1. Architecture

```
[ EmailEditor (Client Component) ]
       |
       | calls prop functions
       v
[ Your Next.js Page/Component ]
       |
       | calls your API routes
       v
[ Your Next.js API Routes ]  <-- Environment Variables live here
       |
       | calls external services
       v
[ AWS S3 / Supabase / Resend / SendGrid ]
```

---

## 2. Environment Variables

You should add these to your Next.js application's `.env.local` file. **Do not** add them to the library package itself.

### For Image Upload

**Option A: AWS S3**
```bash
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your_bucket
```

**Option B: Supabase Storage**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=public_key
SUPABASE_SERVICE_ROLE_KEY=secret_key
```

### For Sending Emails

**Option A: Resend**
```bash
RESEND_API_KEY=re_123456789
```

**Option B: SendGrid**
```bash
SENDGRID_API_KEY=SG.123456789
```

---

## 3. Implementation Examples

### A. The Client Page (`app/editor/page.tsx`)

This is how you wire up the editor in your application.

```tsx
'use client';

import { EmailEditor } from 'email-newsletter-builder';

export default function EditorPage() {

    // 1. Image Upload Handler
    const handleUpload = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        });
        
        if (!response.ok) throw new Error('Upload failed');
        const data = await response.json();
        return data.url; // Must return the public image URL
    };

    // 2. Test Email Handler
    const handleSendTest = async (email: string, html: string) => {
        const response = await fetch('/api/send-test', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, html }),
        });
        
        if (!response.ok) throw new Error('Failed to send');
    };

    // 3. Image Gallery Fetcher
    const handleFetchImages = async (): Promise<string[]> => {
        const response = await fetch('/api/upload'); // Assuming GET returns list
        if (!response.ok) return [];
        const data = await response.json();
        return data.images || []; 
    };

    return (
        <div className="h-screen w-screen">
            <EmailEditor
                onUploadImage={handleUpload}
                onFetchImages={handleFetchImages}
                onSendTestEmail={handleSendTest}
                mergeTags={[
                    { value: '{{ first_name }}', label: 'First Name' },
                    { value: '{{ order_id }}', label: 'Order ID' },
                ]}
                onSave={async (data) => {
                    console.log('Saved JSON:', data);
                    // Save to your DB here
                }}
            />
        </div>
    );
}
```

### B. Upload API Route (`app/api/upload/route.ts`)

**Example using Supabase:**

```ts
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${Date.now()}-${file.name}`;

    const { data, error } = await supabase
        .storage
        .from('newsletter-images')
        .upload(fileName, buffer, { contentType: file.type });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    
    // Get Public URL
    const { data: { publicUrl } } = supabase
        .storage
        .from('newsletter-images')
        .getPublicUrl(fileName);

    return NextResponse.json({ url: publicUrl });
}
```

### C. Email API Route (`app/api/send-test/route.ts`)

**Example using Resend:**

```ts
import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    const { email, html } = await req.json();

    try {
        const data = await resend.emails.send({
            from: 'Test <noreply@yourdomain.com>',
            to: [email],
            subject: 'Newsletter Test Preview',
            html: html,
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
```
---

## 4. Integration with Non-React Backends (Django, PHP, Laravel, etc.)

Since this library is a React component, it cannot be directly imported into templates like Django (Jinja2) or PHP (Blade).

### Recommended Strategy: The Micro-Frontend Wrapper

1.  **Create a small Next.js or Vite React App** that installs and renders `email-newsletter-builder`.
2.  **Host this app** (e.g., on Vercel, Netlify, or a subfolder of your main server).
3.  **Embed via Iframe**: inside your Django/PHP admin panel.

#### Architecture Example

*   **Main App (Django/PHP)**: `https://your-app.com/admin/newsletter/create`
*   **Editor App (Next.js)**: `https://editor.your-app.com`

**In your Django/PHP Template:**

```html
<iframe 
    src="https://editor.your-app.com?token=SESSION_TOKEN" 
    width="100%" 
    height="1000px" 
    style="border: none;"
    id="email-editor-frame"
></iframe>

<script>
    // Listen for Save events from the iframe
    window.addEventListener("message", (event) => {
        // Security check: Validate origin
        // if (event.origin !== "https://editor.your-app.com") return;
        
        if (event.data.type === 'EMAIL_BUILDER_SAVE') {
            const { json, html } = event.data.payload;
            
            // Send to your Django/PHP backend
            fetch('/api/newsletters/save', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-CSRFToken': '{{ csrf_token }}' // Django example
                },
                body: JSON.stringify({ json, html })
            }).then(res => {
                if (res.ok) alert("Newsletter saved successfully!");
            });
        }
    });
</script>
```

**In your Editor App (`editor.your-app.com`):**

```tsx
import { generateHtml } from 'email-newsletter-builder';

// ... inside your component
<EmailEditor
    onSave={async (data) => {
        // Generate valid HTML state structure
        const fullState = { 
            elements: data.elements || [], 
            canvasSettings: data.canvasSettings,
            selectedElementId: null,
            history: { past: [], future: [] }
        };
        
        const html = generateHtml(fullState);

        // Send data back to the parent window (Django/PHP App)
        window.parent.postMessage({
            type: 'EMAIL_BUILDER_SAVE',
            payload: { json: data, html }
        }, "*"); // Change "*" to parent domain in production for security
    }}
/>
```

This approach keeps your frontend technology (React) decoupled from your backend logic.
