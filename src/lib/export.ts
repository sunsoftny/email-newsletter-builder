import { EditorState } from '@/lib/types';



// Helper to generate a CSS string from the style object
function getStyleString(style: any): string {
    return Object.entries(style || {})
        .filter(([k]) => k !== 'mobile') // Exclude mobile object from inline styles
        .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v}`)
        .join('; ');
}

// Generate a unique class name for mobile overrides
function getMobileClass(id: string): string {
    return `m-${id}`;
}

// Helper to extract mobile CSS
function getMobileCss(elements: any[]): string {
    let css = '';
    const visit = (el: any) => {
        if (el.style?.mobile && Object.keys(el.style.mobile).length > 0) {
            const rules = Object.entries(el.style.mobile)
                .map(([k, v]) => `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v} !important`)
                .join('; ');
            css += `.${getMobileClass(el.id)} { ${rules} } \n`;
        }
        if (el.content?.columns) {
            el.content.columns.forEach((col: any) => col.elements.forEach(visit));
        }
    };
    elements.forEach(visit);
    return css;
}

function renderElement(el: any): string {
    let content = '';
    const styleString = getStyleString(el.style);
    const mobileClass = getMobileClass(el.id);

    // Wrapper div for applying classes
    const wrap = (html: string) => el.type !== 'columns' && el.type !== 'columns-3' && el.type !== 'section'
        ? `<div class="${mobileClass}" style="${styleString}">${html}</div>`
        : html; // Layouts handle their own styles on tables

    switch (el.type) {
        case 'text':
            content = el.content.text; // Text is wrapped by default logic below if I didn't wrap it inside div
            return `<div class="${mobileClass}" style="${styleString}">${el.content.text}</div>`;
        case 'button':
            return `
                <div class="${mobileClass}" style="text-align: ${el.style.textAlign || 'center'}; padding: ${el.style.padding || '10px'};">
                    <a href="${el.content.url}" style="display: inline-block; background-color: ${el.style.backgroundColor}; color: ${el.style.color}; padding: 12px 24px; text-decoration: none; border-radius: ${el.style.borderRadius || '4px'}; font-weight: bold;">
                        ${el.content.label}
                    </a>
                </div>`;
        case 'image':
            return `
                <div class="${mobileClass}" style="text-align: ${el.style.textAlign || 'center'}; padding: 0;">
                    <img src="${el.content.url}" alt="${el.content.alt || ''}" style="max-width: 100%; height: auto; display: block; border: 0;" />
                </div>`;
        case 'divider':
            return `<div class="${mobileClass}" style="padding: ${el.style.padding || '10px 0'};">
                <hr style="border: 0; border-top: 1px solid ${el.style.borderTopColor || '#eeeeee'};" />
            </div>`;
        case 'spacer':
            return `<div class="${mobileClass}" style="height: ${el.style.height || '32px'}; line-height: ${el.style.height || '32px'}; font-size: 0;">&nbsp;</div>`;
        case 'social':
            return `<div class="${mobileClass}" style="text-align: center; padding: 20px;">
                ${(el.content.socialLinks || []).map((link: any) =>
                `<a href="${link.url}" style="display:inline-block; margin: 0 5px; color: ${el.style.color || '#374151'}; text-decoration: none;">${link.network}</a>`
            ).join('')}
            </div>`;
        case 'product':
            return `
                 <table width="100%" border="0" cellpadding="0" cellspacing="0" class="${mobileClass}" style="${styleString}">
                    <tr>
                        <td align="center" style="padding-bottom: 16px;">
                            <img src="${el.content.imageUrl}" alt="${el.content.text}" style="max-width: 100%; height: auto; display: block; border: 0;" />
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 8px;">
                            <h3 style="margin: 0; font-size: 18px; font-weight: bold; color: inherit;">${el.content.text}</h3>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 16px;">
                            <p style="margin: 0; font-size: 16px; color: #666;">${el.content.currency}${el.content.price}</p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <a href="${el.content.url}" style="display: inline-block; background-color: #007bff; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                                ${el.content.label}
                            </a>
                        </td>
                    </tr>
                 </table>
            `;
        case 'video':
            return `
                <div class="${mobileClass}" style="text-align: center; position: relative;">
                    <a href="${el.content.url}" target="_blank" style="display: block; position: relative; text-decoration: none;">
                         <img src="${el.content.thumbnailUrl}" alt="${el.content.alt}" style="max-width: 100%; height: auto; display: block; border: 0;" />
                         <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; background: rgba(0,0,0,0.5); border-radius: 50%;">
                            <div style="border-style: solid; border-width: 10px 0 10px 20px; border-color: transparent transparent transparent white; position: absolute; top: 50%; left: 50%; transform: translate(-30%, -50%);"></div>
                         </div>
                    </a>
                </div>
            `;
        case 'countdown':
            const end = new Date(el.content.endTime || Date.now());
            return `
                <div class="${mobileClass}" style="text-align: center; padding: 20px; background-color: ${el.style.backgroundColor || '#333'}; color: ${el.style.color || 'white'}; border-radius: 4px;">
                     <h3 style="margin: 0 0 10px 0;">Offer ends on ${end.toDateString()}</h3>
                     <div style="font-size: 24px; font-weight: bold; font-family: monospace;">
                        00 : 00 : 00 : 00
                     </div>
                     <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">(Dynamic timer requires GIF generation service)</p>
                </div>
            `;
        case 'section':
            return `
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="${mobileClass}" style="${styleString}">
                    <tr>
                        <td align="center">
                             <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                     ${(el.content.columns || []).map((col: any) => `
                                        <td valign="top" style="padding: 0;">
                                            ${col.elements.map((child: any) => renderElement(child)).join('')}
                                        </td>
                                     `).join('')}
                                </tr>
                             </table>
                        </td>
                    </tr>
                </table>
            `;
        case 'columns':
            return `
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="${mobileClass}">
                    <tr>
                        <td width="50%" valign="top" style="padding: 0;">
                            ${(el.content.columns?.[0]?.elements || []).map((child: any) => renderElement(child)).join('')}
                        </td>
                        <td width="50%" valign="top" style="padding: 0;">
                            ${(el.content.columns?.[1]?.elements || []).map((child: any) => renderElement(child)).join('')}
                        </td>
                    </tr>
                </table>
            `;
        case 'columns-3':
            return `
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="${mobileClass}">
                    <tr>
                        <td width="33.33%" valign="top" style="padding: 0;">
                            ${(el.content.columns?.[0]?.elements || []).map((child: any) => renderElement(child)).join('')}
                        </td>
                        <td width="33.33%" valign="top" style="padding: 0;">
                            ${(el.content.columns?.[1]?.elements || []).map((child: any) => renderElement(child)).join('')}
                        </td>
                        <td width="33.33%" valign="top" style="padding: 0;">
                            ${(el.content.columns?.[2]?.elements || []).map((child: any) => renderElement(child)).join('')}
                        </td>
                    </tr>
                </table>
            `;
        case 'html':
            return `<div class="${mobileClass}" style="${styleString}">${el.content.html || ''}</div>`;
        default:
            return '';
    }
}

export function generateHtml(state: EditorState): string {
    const { elements, canvasSettings } = state;
    const mobileCss = getMobileCss(elements);

    return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Newsletter</title>
<style>
    a { color: ${canvasSettings.linkColor || '#007bff'}; text-decoration: underline; }
    /* Mobile Styles */
    @media only screen and (max-width: 480px) {
        ${mobileCss}
        .width-full { width: 100% !important; }
        .stack-column { display: block !important; width: 100% !important; }
    }
</style>
</head>
<body style="margin: 0; padding: 0; background-color: ${canvasSettings.backgroundColor}; font-family: ${canvasSettings.fontFamily}; color: ${canvasSettings.textColor || '#000000'}; line-height: ${canvasSettings.lineHeight || '1.5'};">
    <center>
    <table border="0" cellpadding="0" cellspacing="0" width="${canvasSettings.width}" style="background-color: #ffffff; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${elements.map(el => `<tr><td align="center" style="padding:0;">${renderElement(el)}</td></tr>`).join('')}
    </table>
    </center>
</body>
</html>
    `;
}
