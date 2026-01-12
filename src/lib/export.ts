import { EditorState } from '@/lib/types';

export function generateHtml(state: EditorState): string {
    const { elements, canvasSettings } = state;

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Newsletter</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${canvasSettings.backgroundColor}; font-family: ${canvasSettings.fontFamily};">
    <center>
        <table border="0" cellpadding="0" cellspacing="0" width="${canvasSettings.width}" style="background-color: #ffffff; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${elements.map(el => {
        const style = Object.entries(el.style).map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v}`).join('; ');

        let content = '';
        switch (el.type) {
            case 'text':
                content = `<div style="${style}">${el.content.text}</div>`;
                break;
            case 'button':
                content = `
                            <div style="text-align: ${el.style.textAlign || 'center'}; padding: ${el.style.padding || '10px'};">
                                <a href="${el.content.url}" style="display: inline-block; background-color: ${el.style.backgroundColor}; color: ${el.style.color}; padding: 12px 24px; text-decoration: none; border-radius: ${el.style.borderRadius || '4px'}; font-weight: bold;">
                                    ${el.content.label}
                                </a>
                            </div>`;
                break;
            case 'image':
                content = `
                            <div style="text-align: ${el.style.textAlign || 'center'}; padding: 0;">
                                <img src="${el.content.url}" alt="${el.content.alt || ''}" style="max-width: 100%; height: auto; display: block; border: 0;" />
                            </div>`;
                break;
            case 'divider':
                content = `<div style="padding: 10px 0;"><hr style="border: 0; border-top: 1px solid #eeeeee;" /></div>`;
                break;
            case 'spacer':
                content = `<div style="height: 32px;">&nbsp;</div>`;
                break;
            case 'social':
                content = `<div style="text-align: center; padding: 20px;">Social Links Placeholder</div>`;
                break;
        }

        return `<tr><td align="center">${content}</td></tr>`;
    }).join('')}
        </table>
    </center>
</body>
</html>
  `;
}
