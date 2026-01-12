"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  EmailEditor: () => EmailEditor,
  addElement: () => addElement,
  cn: () => cn,
  generateHtml: () => generateHtml,
  loadState: () => loadState,
  moveElement: () => moveElement,
  redo: () => redo,
  removeElement: () => removeElement,
  selectElement: () => selectElement,
  undo: () => undo,
  updateCanvasSettings: () => updateCanvasSettings,
  updateElement: () => updateElement
});
module.exports = __toCommonJS(index_exports);

// src/components/EmailEditor.tsx
var import_react_redux6 = require("react-redux");

// src/store/index.ts
var import_toolkit2 = require("@reduxjs/toolkit");

// src/store/editorSlice.ts
var import_toolkit = require("@reduxjs/toolkit");
var import_uuid = require("uuid");
var initialState = {
  elements: [],
  selectedElementId: null,
  canvasSettings: {
    width: 600,
    backgroundColor: "#ffffff",
    fontFamily: "Arial, sans-serif",
    textColor: "#000000",
    linkColor: "#007bff",
    lineHeight: "1.5"
  },
  history: {
    past: [],
    future: []
  }
};
var editorSlice = (0, import_toolkit.createSlice)({
  name: "editor",
  initialState,
  reducers: {
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        state.history.future.unshift({
          elements: state.elements,
          selectedElementId: state.selectedElementId,
          canvasSettings: state.canvasSettings
        });
        state.elements = previous.elements;
        state.selectedElementId = previous.selectedElementId;
        state.canvasSettings = previous.canvasSettings;
        state.history.past = newPast;
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        state.history.past.push({
          elements: state.elements,
          selectedElementId: state.selectedElementId,
          canvasSettings: state.canvasSettings
        });
        state.elements = next.elements;
        state.selectedElementId = next.selectedElementId;
        state.canvasSettings = next.canvasSettings;
        state.history.future = newFuture;
      }
    },
    addElement: (state, action) => {
      saveHistory(state);
      const newElement = {
        id: (0, import_uuid.v4)(),
        type: action.payload.type,
        content: getDefaultContent(action.payload.type),
        style: getDefaultStyle(action.payload.type)
      };
      const { parentId, columnId, index } = action.payload;
      if (parentId && columnId) {
        const parent = state.elements.find((el) => el.id === parentId);
        if (parent && (parent.type === "columns" || parent.type === "columns-3" || parent.type === "section") && parent.content.columns) {
          const column = parent.content.columns.find((col) => col.id === columnId);
          if (column) {
            column.elements.push(newElement);
          }
        }
      } else {
        if (index !== void 0 && index >= 0) {
          state.elements.splice(index, 0, newElement);
        } else {
          state.elements.push(newElement);
        }
      }
      state.selectedElementId = newElement.id;
    },
    loadState: (state, action) => {
      state.elements = action.payload.elements;
      state.canvasSettings = action.payload.canvasSettings;
      state.history = { past: [], future: [] };
      state.selectedElementId = null;
    },
    updateElement: (state, action) => {
      saveHistory(state);
      const index = state.elements.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        state.elements[index] = __spreadValues(__spreadValues({}, state.elements[index]), action.payload.changes);
      }
    },
    removeElement: (state, action) => {
      saveHistory(state);
      state.elements = state.elements.filter((el) => el.id !== action.payload);
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
      }
    },
    selectElement: (state, action) => {
      state.selectedElementId = action.payload;
    },
    moveElement: (state, action) => {
      saveHistory(state);
      const { dragIndex, hoverIndex } = action.payload;
      const dragElement = state.elements[dragIndex];
      state.elements.splice(dragIndex, 1);
      state.elements.splice(hoverIndex, 0, dragElement);
    },
    updateCanvasSettings: (state, action) => {
      saveHistory(state);
      state.canvasSettings = __spreadValues(__spreadValues({}, state.canvasSettings), action.payload);
    }
  }
});
function saveHistory(state) {
  state.history.past.push({
    elements: state.elements,
    selectedElementId: state.selectedElementId,
    canvasSettings: state.canvasSettings
  });
  state.history.future = [];
}
function getDefaultContent(type) {
  switch (type) {
    case "text":
      return { text: "Edit this text" };
    case "button":
      return { label: "Click Me", url: "#" };
    case "image":
      return { url: "https://via.placeholder.com/300x200", alt: "Placeholder" };
    case "divider":
      return {};
    case "social":
      return {
        socialLinks: [
          { network: "facebook", url: "#" },
          { network: "twitter", url: "#" },
          { network: "instagram", url: "#" }
        ]
      };
    case "columns":
      return {
        columns: [
          { id: (0, import_uuid.v4)(), elements: [] },
          { id: (0, import_uuid.v4)(), elements: [] }
        ]
      };
    case "columns-3":
      return {
        columns: [
          { id: (0, import_uuid.v4)(), elements: [] },
          { id: (0, import_uuid.v4)(), elements: [] },
          { id: (0, import_uuid.v4)(), elements: [] }
        ]
      };
    case "section":
      return {
        columns: [
          { id: (0, import_uuid.v4)(), elements: [] }
        ]
      };
    case "product":
      return {
        imageUrl: "https://via.placeholder.com/300x300",
        text: "Amazing Product Title",
        price: "99.99",
        currency: "$",
        url: "#",
        label: "Buy Now"
      };
    case "video":
      return {
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnailUrl: "https://via.placeholder.com/600x337.png?text=Video+Thumbnail",
        alt: "Watch Video"
      };
    case "countdown":
      return {
        endTime: new Date(Date.now() + 864e5).toISOString(),
        // 24 hours from now
        style: { backgroundColor: "#f0f0f0", padding: "10px" }
      };
    case "html":
      return {
        html: '<div style="background:#f8f9fa;padding:20px;text-align:center;border:1px dashed #ccc;"><strong>HTML Block</strong><br/>Edit to add custom code</div>'
      };
    default:
      return {};
  }
}
function getDefaultStyle(type) {
  const base = { padding: "10px", margin: "0px", mobile: {} };
  switch (type) {
    case "button":
      return __spreadProps(__spreadValues({}, base), { padding: "10px 20px", backgroundColor: "#007bff", color: "#ffffff", borderRadius: "4px", textAlign: "center", width: "auto", display: "inline-block" });
    case "image":
      return __spreadProps(__spreadValues({}, base), { width: "100%", textAlign: "center" });
    case "spacer":
      return __spreadProps(__spreadValues({}, base), { height: "32px" });
    case "divider":
      return __spreadProps(__spreadValues({}, base), { borderTopWidth: "1px", borderTopColor: "#eeeeee", borderTopStyle: "solid", paddingTop: "10px", paddingBottom: "10px" });
    case "section":
      return { padding: "20px 0px", margin: "0px", backgroundColor: "#ffffff", width: "100%", mobile: {} };
    case "product":
      return __spreadProps(__spreadValues({}, base), { backgroundColor: "#ffffff", textAlign: "center" });
    case "video":
      return __spreadProps(__spreadValues({}, base), { width: "100%", textAlign: "center" });
    case "countdown":
      return __spreadProps(__spreadValues({}, base), { padding: "20px", backgroundColor: "#333333", color: "#ffffff", textAlign: "center" });
    default:
      return base;
  }
}
var { addElement, updateElement, removeElement, selectElement, moveElement, updateCanvasSettings, undo, redo, loadState } = editorSlice.actions;
var editorSlice_default = editorSlice.reducer;

// src/store/index.ts
var store = (0, import_toolkit2.configureStore)({
  reducer: {
    editor: editorSlice_default
  }
});

// src/components/EmailEditor.tsx
var import_react_dnd5 = require("react-dnd");
var import_react_dnd_html5_backend = require("react-dnd-html5-backend");

// src/components/layout/Header.tsx
var import_react3 = __toESM(require("react"));
var import_lucide_react3 = require("lucide-react");

// src/components/ui/button.tsx
var React = __toESM(require("react"));
var import_class_variance_authority = require("class-variance-authority");

// src/lib/utils.ts
var import_clsx = require("clsx");
var import_tailwind_merge = require("tailwind-merge");
function cn(...inputs) {
  return (0, import_tailwind_merge.twMerge)((0, import_clsx.clsx)(inputs));
}

// src/components/ui/button.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var buttonVariants = (0, import_class_variance_authority.cva)(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
var Button = React.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, variant, size, asChild = false } = _b, props = __objRest(_b, ["className", "variant", "size", "asChild"]);
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
      "button",
      __spreadValues({
        className: cn(buttonVariants({ variant, size, className })),
        ref
      }, props)
    );
  }
);
Button.displayName = "Button";

// src/components/ui/input.tsx
var React2 = __toESM(require("react"));
var import_jsx_runtime2 = require("react/jsx-runtime");
var Input = React2.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
    return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
      "input",
      __spreadValues({
        type,
        className: cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
        ref
      }, props)
    );
  }
);
Input.displayName = "Input";

// src/components/ui/separator.tsx
var React3 = __toESM(require("react"));
var import_jsx_runtime3 = require("react/jsx-runtime");
var Separator = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, orientation = "horizontal" } = _b, props = __objRest(_b, ["className", "orientation"]);
  return /* @__PURE__ */ (0, import_jsx_runtime3.jsx)(
    "div",
    __spreadValues({
      ref,
      className: cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )
    }, props)
  );
});
Separator.displayName = "Separator";

// src/components/layout/Header.tsx
var import_react_redux = require("react-redux");

// src/lib/export.ts
function getStyleString(style) {
  return Object.entries(style || {}).filter(([k]) => k !== "mobile").map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${v}`).join("; ");
}
function getMobileClass(id) {
  return `m-${id}`;
}
function getMobileCss(elements) {
  let css = "";
  const visit = (el) => {
    var _a, _b;
    if (((_a = el.style) == null ? void 0 : _a.mobile) && Object.keys(el.style.mobile).length > 0) {
      const rules = Object.entries(el.style.mobile).map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${v} !important`).join("; ");
      css += `.${getMobileClass(el.id)} { ${rules} } 
`;
    }
    if ((_b = el.content) == null ? void 0 : _b.columns) {
      el.content.columns.forEach((col) => col.elements.forEach(visit));
    }
  };
  elements.forEach(visit);
  return css;
}
function renderElement(el) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
  let content = "";
  const styleString = getStyleString(el.style);
  const mobileClass = getMobileClass(el.id);
  const wrap = (html) => el.type !== "columns" && el.type !== "columns-3" && el.type !== "section" ? `<div class="${mobileClass}" style="${styleString}">${html}</div>` : html;
  switch (el.type) {
    case "text":
      content = el.content.text;
      return `<div class="${mobileClass}" style="${styleString}">${el.content.text}</div>`;
    case "button":
      return `
                <div class="${mobileClass}" style="text-align: ${el.style.textAlign || "center"}; padding: ${el.style.padding || "10px"};">
                    <a href="${el.content.url}" style="display: inline-block; background-color: ${el.style.backgroundColor}; color: ${el.style.color}; padding: 12px 24px; text-decoration: none; border-radius: ${el.style.borderRadius || "4px"}; font-weight: bold;">
                        ${el.content.label}
                    </a>
                </div>`;
    case "image":
      return `
                <div class="${mobileClass}" style="text-align: ${el.style.textAlign || "center"}; padding: 0;">
                    <img src="${el.content.url}" alt="${el.content.alt || ""}" style="max-width: 100%; height: auto; display: block; border: 0;" />
                </div>`;
    case "divider":
      return `<div class="${mobileClass}" style="padding: ${el.style.padding || "10px 0"};">
                <hr style="border: 0; border-top: 1px solid ${el.style.borderTopColor || "#eeeeee"};" />
            </div>`;
    case "spacer":
      return `<div class="${mobileClass}" style="height: ${el.style.height || "32px"}; line-height: ${el.style.height || "32px"}; font-size: 0;">&nbsp;</div>`;
    case "social":
      return `<div class="${mobileClass}" style="text-align: center; padding: 20px;">
                ${(el.content.socialLinks || []).map(
        (link) => `<a href="${link.url}" style="display:inline-block; margin: 0 5px; color: ${el.style.color || "#374151"}; text-decoration: none;">${link.network}</a>`
      ).join("")}
            </div>`;
    case "product":
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
    case "video":
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
    case "countdown":
      const end = new Date(el.content.endTime || Date.now());
      return `
                <div class="${mobileClass}" style="text-align: center; padding: 20px; background-color: ${el.style.backgroundColor || "#333"}; color: ${el.style.color || "white"}; border-radius: 4px;">
                     <h3 style="margin: 0 0 10px 0;">Offer ends on ${end.toDateString()}</h3>
                     <div style="font-size: 24px; font-weight: bold; font-family: monospace;">
                        00 : 00 : 00 : 00
                     </div>
                     <p style="margin: 10px 0 0 0; font-size: 12px; opacity: 0.8;">(Dynamic timer requires GIF generation service)</p>
                </div>
            `;
    case "section":
      return `
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="${mobileClass}" style="${styleString}">
                    <tr>
                        <td align="center">
                             <table width="100%" border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                     ${(el.content.columns || []).map((col) => `
                                        <td valign="top" style="padding: 0;">
                                            ${col.elements.map((child) => renderElement(child)).join("")}
                                        </td>
                                     `).join("")}
                                </tr>
                             </table>
                        </td>
                    </tr>
                </table>
            `;
    case "columns":
      return `
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="${mobileClass}">
                    <tr>
                        <td width="50%" valign="top" style="padding: 0;">
                            ${(((_b = (_a = el.content.columns) == null ? void 0 : _a[0]) == null ? void 0 : _b.elements) || []).map((child) => renderElement(child)).join("")}
                        </td>
                        <td width="50%" valign="top" style="padding: 0;">
                            ${(((_d = (_c = el.content.columns) == null ? void 0 : _c[1]) == null ? void 0 : _d.elements) || []).map((child) => renderElement(child)).join("")}
                        </td>
                    </tr>
                </table>
            `;
    case "columns-3":
      return `
                <table width="100%" border="0" cellpadding="0" cellspacing="0" class="${mobileClass}">
                    <tr>
                        <td width="33.33%" valign="top" style="padding: 0;">
                            ${(((_f = (_e = el.content.columns) == null ? void 0 : _e[0]) == null ? void 0 : _f.elements) || []).map((child) => renderElement(child)).join("")}
                        </td>
                        <td width="33.33%" valign="top" style="padding: 0;">
                            ${(((_h = (_g = el.content.columns) == null ? void 0 : _g[1]) == null ? void 0 : _h.elements) || []).map((child) => renderElement(child)).join("")}
                        </td>
                        <td width="33.33%" valign="top" style="padding: 0;">
                            ${(((_j = (_i = el.content.columns) == null ? void 0 : _i[2]) == null ? void 0 : _j.elements) || []).map((child) => renderElement(child)).join("")}
                        </td>
                    </tr>
                </table>
            `;
    case "html":
      return `<div class="${mobileClass}" style="${styleString}">${el.content.html || ""}</div>`;
    default:
      return "";
  }
}
function generateHtml(state) {
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
    a { color: ${canvasSettings.linkColor || "#007bff"}; text-decoration: underline; }
    /* Mobile Styles */
    @media only screen and (max-width: 480px) {
        ${mobileCss}
        .width-full { width: 100% !important; }
        .stack-column { display: block !important; width: 100% !important; }
    }
</style>
</head>
<body style="margin: 0; padding: 0; background-color: ${canvasSettings.backgroundColor}; font-family: ${canvasSettings.fontFamily}; color: ${canvasSettings.textColor || "#000000"}; line-height: ${canvasSettings.lineHeight || "1.5"};">
    <center>
    <table border="0" cellpadding="0" cellspacing="0" width="${canvasSettings.width}" style="background-color: #ffffff; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        ${elements.map((el) => `<tr><td align="center" style="padding:0;">${renderElement(el)}</td></tr>`).join("")}
    </table>
    </center>
</body>
</html>
    `;
}

// src/components/ui/PreviewModal.tsx
var import_react = require("react");
var import_lucide_react = require("lucide-react");
var import_jsx_runtime4 = require("react/jsx-runtime");
var PreviewModal = ({ isOpen, onClose, editorState, onSendTestEmail }) => {
  const [html, setHtml] = (0, import_react.useState)("");
  const [viewMode, setViewMode] = (0, import_react.useState)("desktop");
  const [testEmail, setTestEmail] = (0, import_react.useState)("");
  const [isSending, setIsSending] = (0, import_react.useState)(false);
  const handleSendTest = async () => {
    if (!onSendTestEmail || !testEmail) return;
    setIsSending(true);
    try {
      await onSendTestEmail(testEmail, html);
      alert(`Test sent to ${testEmail}`);
    } catch (e) {
      console.error(e);
      alert("Failed to send test email");
    } finally {
      setIsSending(false);
    }
  };
  (0, import_react.useEffect)(() => {
    if (isOpen) {
      const generatedHtml = generateHtml(editorState);
      setHtml(generatedHtml);
    }
  }, [isOpen, editorState]);
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-sm animate-in fade-in zoom-in duration-200", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "h-14 border-b flex items-center justify-between px-6 bg-background", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("h2", { className: "font-semibold text-lg", children: "Preview" }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center bg-muted rounded-lg p-1", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            Button,
            {
              variant: viewMode === "desktop" ? "secondary" : "ghost",
              size: "sm",
              className: "h-7 px-2",
              onClick: () => setViewMode("desktop"),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Monitor, { size: 14, className: "mr-2" }),
                "Desktop"
              ]
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(
            Button,
            {
              variant: viewMode === "mobile" ? "secondary" : "ghost",
              size: "sm",
              className: "h-7 px-2",
              onClick: () => setViewMode("mobile"),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Smartphone, { size: 14, className: "mr-2" }),
                "Mobile"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-2", children: [
        onSendTestEmail && /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-2 mr-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
            Input,
            {
              placeholder: "Test email",
              value: testEmail,
              onChange: (e) => setTestEmail(e.target.value),
              className: "h-8 w-48 text-xs"
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Button, { size: "sm", onClick: handleSendTest, disabled: isSending || !testEmail, children: [
            isSending ? /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Send, { size: 14, className: "mr-2" }),
            "Send"
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Button, { variant: "ghost", size: "icon", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.X, { size: 20 }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "flex-1 overflow-auto bg-slate-100 flex justify-center p-8", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
      "div",
      {
        className: `bg-white shadow-2xl transition-all duration-300 origin-top overflow-hidden border border-slate-200
                        ${viewMode === "mobile" ? "w-[375px] h-[812px] rounded-[40px] border-8 border-slate-800" : "w-[800px] h-full rounded-lg"}
                    `,
        children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
          "iframe",
          {
            srcDoc: html,
            className: `w-full h-full bg-white ${viewMode === "mobile" ? "rounded-[32px]" : ""}`,
            title: "Preview",
            sandbox: "allow-same-origin"
          }
        )
      }
    ) })
  ] });
};

// src/components/ui/TemplateListModal.tsx
var import_react2 = require("react");
var import_lucide_react2 = require("lucide-react");
var import_jsx_runtime5 = require("react/jsx-runtime");
var TemplateListModal = ({ isOpen, onClose, onLoad, fetchTemplates }) => {
  const [templates, setTemplates] = (0, import_react2.useState)([]);
  const [loading, setLoading] = (0, import_react2.useState)(false);
  (0, import_react2.useEffect)(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);
  const loadTemplates = async () => {
    setLoading(true);
    try {
      if (fetchTemplates) {
        const data = await fetchTemplates();
        setTemplates(data);
      } else {
        const res = await fetch("/api/templates");
        const data = await res.json();
        setTemplates(data);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to load templates");
    } finally {
      setLoading(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "bg-card border shadow-lg rounded-lg w-[600px] h-[500px] flex flex-col", children: [
    /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center justify-between p-4 border-b", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h2", { className: "text-lg font-semibold", children: "Load Template" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Button, { variant: "ghost", size: "icon", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react2.X, { size: 18 }) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "flex-1 overflow-y-auto p-4", children: loading ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react2.Loader2, { className: "animate-spin mb-2" }),
      "Loading templates..."
    ] }) : templates.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(import_lucide_react2.FileText, { size: 48, className: "mb-4 opacity-50" }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("p", { children: "No templates found." })
    ] }) : /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { className: "grid gap-3", children: templates.map((template) => /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { className: "flex items-center justify-between p-4 rounded-md border bg-muted/20 hover:bg-muted/40 transition-colors", children: [
      /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("div", { children: [
        /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("h3", { className: "font-medium", children: template.name }),
        /* @__PURE__ */ (0, import_jsx_runtime5.jsxs)("p", { className: "text-xs text-muted-foreground", children: [
          new Date(template.updatedAt).toLocaleDateString(),
          " at ",
          new Date(template.updatedAt).toLocaleTimeString()
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(Button, { size: "sm", onClick: () => {
        onLoad(template.data);
        onClose();
      }, children: "Load" })
    ] }, template.id)) }) })
  ] }) });
};

// src/components/layout/Header.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var Header = ({ onSave, onLoad, onSendTestEmail }) => {
  const dispatch = (0, import_react_redux.useDispatch)();
  const editorState = (0, import_react_redux.useSelector)((state) => state.editor);
  const { past, future } = editorState.history;
  const handleUndo = () => dispatch(undo());
  const handleRedo = () => dispatch(redo());
  const handleExport = () => {
    const html = generateHtml(editorState);
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "newsletter.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave(editorState);
        alert("Saved successfully!");
      } catch (e) {
        console.error(e);
        alert("Error saving.");
      }
      return;
    }
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "My Newsletter",
          data: editorState
        })
      });
      if (response.ok) {
        alert("Template saved successfully!");
      } else {
        alert("Failed to save template");
      }
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving template");
    }
  };
  const [isPreviewOpen, setIsPreviewOpen] = import_react3.default.useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = import_react3.default.useState(false);
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(import_jsx_runtime6.Fragment, { children: [
    /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("header", { className: "h-16 border-b flex items-center justify-between px-6 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: [
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Mail, { size: 18 }) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "font-semibold text-lg tracking-tight", children: "MailBuilder" })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          Input,
          {
            type: "text",
            defaultValue: "Untitled Newsletter",
            className: "border-transparent hover:border-input focus:border-input bg-transparent w-[200px] h-9 px-2 font-medium"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Button, { variant: "outline", size: "sm", onClick: () => setIsTemplatesOpen(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.FileText, { size: 16, className: "mr-2" }),
          "Templates"
        ] }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center mr-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { variant: "ghost", size: "icon", title: "Undo", onClick: handleUndo, disabled: past.length === 0, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Undo, { size: 16, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Button, { variant: "ghost", size: "icon", title: "Redo", onClick: handleRedo, disabled: future.length === 0, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Redo, { size: 16, className: "text-muted-foreground" }) })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)("div", { className: "flex items-center bg-muted rounded-lg p-1 mr-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 w-7 p-0",
              onClick: () => dispatch({ type: "editor/updateCanvasSettings", payload: { width: 600 } }),
              title: "Desktop View",
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Monitor, { size: 14 })
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 w-7 p-0",
              onClick: () => dispatch({ type: "editor/updateCanvasSettings", payload: { width: 375 } }),
              title: "Mobile View",
              children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Smartphone, { size: 14 })
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Button, { variant: "ghost", size: "sm", className: "hidden sm:flex gap-2", onClick: () => setIsPreviewOpen(true), children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Eye, { size: 16 }),
          "Preview"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Button, { variant: "outline", size: "sm", className: "hidden sm:flex gap-2", onClick: handleSave, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Save, { size: 16 }),
          "Save"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(Button, { size: "sm", className: "gap-2", onClick: handleExport, children: [
          /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(import_lucide_react3.Download, { size: 16 }),
          "Export"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      PreviewModal,
      {
        isOpen: isPreviewOpen,
        onClose: () => setIsPreviewOpen(false),
        editorState,
        onSendTestEmail
      }
    ),
    /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
      TemplateListModal,
      {
        isOpen: isTemplatesOpen,
        onClose: () => setIsTemplatesOpen(false),
        onLoad: (data) => dispatch(loadState(data)),
        fetchTemplates: onLoad
      }
    )
  ] });
};

// src/components/layout/ToolsPanel.tsx
var import_lucide_react4 = require("lucide-react");

// src/components/tools/DraggableTool.tsx
var import_react_dnd = require("react-dnd");

// src/components/ui/card.tsx
var React7 = __toESM(require("react"));
var import_jsx_runtime7 = require("react/jsx-runtime");
var Card = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    __spreadValues({
      ref,
      className: cn(
        "rounded-xl border bg-card text-card-foreground shadow",
        className
      )
    }, props)
  );
});
Card.displayName = "Card";
var CardHeader = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    __spreadValues({
      ref,
      className: cn("flex flex-col space-y-1.5 p-6", className)
    }, props)
  );
});
CardHeader.displayName = "CardHeader";
var CardTitle = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "h3",
    __spreadValues({
      ref,
      className: cn("font-semibold leading-none tracking-tight", className)
    }, props)
  );
});
CardTitle.displayName = "CardTitle";
var CardDescription = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "p",
    __spreadValues({
      ref,
      className: cn("text-sm text-muted-foreground", className)
    }, props)
  );
});
CardDescription.displayName = "CardDescription";
var CardContent = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", __spreadValues({ ref, className: cn("p-6 pt-0", className) }, props));
});
CardContent.displayName = "CardContent";
var CardFooter = React7.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
    "div",
    __spreadValues({
      ref,
      className: cn("flex items-center p-6 pt-0", className)
    }, props)
  );
});
CardFooter.displayName = "CardFooter";

// src/components/tools/DraggableTool.tsx
var import_jsx_runtime8 = require("react/jsx-runtime");
var DraggableTool = ({ type, label, icon: Icon }) => {
  const [{ isDragging }, drag] = (0, import_react_dnd.useDrag)(() => ({
    type: "ELEMENT",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsxs)(
    Card,
    {
      ref: drag,
      className: cn(
        "flex flex-col items-center justify-center p-4 h-24 hover:border-primary/50 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 select-none",
        isDragging && "opacity-50 ring-2 ring-primary rotate-2 scale-95"
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("div", { className: "p-2 bg-muted rounded-full mb-2 group-hover:bg-primary/10 transition-colors", children: /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(Icon, { size: 20, className: "text-muted-foreground group-hover:text-primary" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime8.jsx)("span", { className: "text-xs font-medium text-foreground", children: label })
      ]
    }
  );
};

// src/components/layout/ToolsPanel.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var ToolsPanel = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("aside", { className: "w-[280px] flex-shrink-0 border-r bg-background/50 flex flex-col h-full overflow-y-auto", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "p-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Components" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "text", label: "Text", icon: import_lucide_react4.Type }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "image", label: "Image", icon: import_lucide_react4.Image }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "product", label: "Product", icon: import_lucide_react4.ShoppingBag }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "button", label: "Button", icon: import_lucide_react4.MousePointerClick }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "divider", label: "Divider", icon: import_lucide_react4.Minus }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "social", label: "Social", icon: import_lucide_react4.Share2 }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "spacer", label: "Spacer", icon: import_lucide_react4.LayoutTemplate }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "video", label: "Video", icon: import_lucide_react4.Video }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "countdown", label: "Timer", icon: import_lucide_react4.Timer }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "html", label: "HTML", icon: import_lucide_react4.Code })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Separator, {}),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "p-6 bg-muted/30 flex-1", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Layouts" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "section", label: "Section", icon: import_lucide_react4.RectangleHorizontal }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "columns", label: "2 Columns", icon: import_lucide_react4.Columns }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(DraggableTool, { type: "columns-3", label: "3 Columns", icon: import_lucide_react4.Columns })
      ] })
    ] })
  ] });
};

// src/components/layout/PropertiesPanel.tsx
var import_react6 = __toESM(require("react"));
var import_react_redux2 = require("react-redux");
var import_lucide_react6 = require("lucide-react");

// src/components/ui/label.tsx
var React8 = __toESM(require("react"));
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime10 = require("react/jsx-runtime");
var labelVariants = (0, import_class_variance_authority2.cva)(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label = React8.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
    "label",
    __spreadValues({
      ref,
      className: cn(labelVariants(), className)
    }, props)
  );
});
Label.displayName = "Label";

// src/components/layout/SpacingControl.tsx
var import_react4 = require("react");
var import_jsx_runtime11 = require("react/jsx-runtime");
var SpacingControl = ({ label, value = "0px", onChange }) => {
  const parseSpacing = (val) => {
    const parts = val.replace(/px/g, "").split(" ").map((v) => parseInt(v) || 0);
    if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
    if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
    if (parts.length === 4) return [parts[0], parts[1], parts[2], parts[3]];
    return [0, 0, 0, 0];
  };
  const [values, setValues] = (0, import_react4.useState)(parseSpacing(value));
  (0, import_react4.useEffect)(() => {
    setValues(parseSpacing(value));
  }, [value]);
  const handleChange = (index, newVal) => {
    const numVal = parseInt(newVal) || 0;
    const newValues = [...values];
    newValues[index] = numVal;
    setValues(newValues);
    onChange(`${newValues[0]}px ${newValues[1]}px ${newValues[2]}px ${newValues[3]}px`);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "grid gap-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(Label, { children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-[10px] text-muted-foreground w-4", children: "T" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          Input,
          {
            className: "h-7 text-xs px-2",
            value: values[0],
            onChange: (e) => handleChange(0, e.target.value),
            type: "number"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-[10px] text-muted-foreground w-4", children: "R" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          Input,
          {
            className: "h-7 text-xs px-2",
            value: values[1],
            onChange: (e) => handleChange(1, e.target.value),
            type: "number"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-[10px] text-muted-foreground w-4", children: "B" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          Input,
          {
            className: "h-7 text-xs px-2",
            value: values[2],
            onChange: (e) => handleChange(2, e.target.value),
            type: "number"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-[10px] text-muted-foreground w-4", children: "L" }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
          Input,
          {
            className: "h-7 text-xs px-2",
            value: values[3],
            onChange: (e) => handleChange(3, e.target.value),
            type: "number"
          }
        )
      ] })
    ] })
  ] });
};

// src/components/ui/ImageGalleryModal.tsx
var import_react5 = require("react");
var import_lucide_react5 = require("lucide-react");
var import_jsx_runtime12 = require("react/jsx-runtime");
var ImageGalleryModal = ({
  isOpen,
  onClose,
  onSelect,
  onUpload,
  fetchImages
}) => {
  const [images, setImages] = (0, import_react5.useState)([]);
  const [isLoading, setIsLoading] = (0, import_react5.useState)(false);
  const [isUploading, setIsUploading] = (0, import_react5.useState)(false);
  const fileInputRef = (0, import_react5.useRef)(null);
  (0, import_react5.useEffect)(() => {
    if (isOpen && fetchImages) {
      setIsLoading(true);
      fetchImages().then(setImages).catch(console.error).finally(() => setIsLoading(false));
    }
  }, [isOpen, fetchImages]);
  const handleFileUpload = async (e) => {
    var _a;
    const file = (_a = e.target.files) == null ? void 0 : _a[0];
    if (!file || !onUpload) return;
    setIsUploading(true);
    try {
      const url = await onUpload(file);
      setImages((prev) => [url, ...prev]);
      onSelect(url);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "bg-background w-[800px] h-[600px] rounded-xl shadow-2xl flex flex-col overflow-hidden border", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "h-16 border-b px-6 flex items-center justify-between shrink-0", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("h3", { className: "font-semibold text-lg", children: "Image Gallery" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex items-center gap-2", children: [
        onUpload && /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(import_jsx_runtime12.Fragment, { children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(
            "input",
            {
              type: "file",
              ref: fileInputRef,
              className: "hidden",
              accept: "image/*",
              onChange: handleFileUpload
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
            Button,
            {
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              disabled: isUploading,
              children: [
                isUploading ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.Upload, { className: "mr-2 h-4 w-4" }),
                "Upload New"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Button, { variant: "ghost", size: "icon", onClick: onClose, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.X, { size: 20 }) })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "flex-1 overflow-y-auto p-6 bg-muted/10", children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.Loader2, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : images.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: images.map((url, i) => /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)(
      "div",
      {
        className: "group relative aspect-video bg-muted rounded-lg overflow-hidden border hover:ring-2 ring-primary cursor-pointer transition-all",
        onClick: () => {
          onSelect(url);
          onClose();
        },
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("img", { src: url, alt: "", className: "w-full h-full object-cover" }),
          /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("div", { className: "bg-white/90 p-2 rounded-full shadow-lg", children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.Check, { size: 16, className: "text-primary" }) }) })
        ]
      },
      i
    )) }) : /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_lucide_react5.Image, { size: 48, className: "mb-4 opacity-50" }),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)("p", { children: "No images found" })
    ] }) })
  ] }) });
};

// src/components/layout/PropertiesPanel.tsx
var import_jsx_runtime13 = require("react/jsx-runtime");
var ImageInput = ({ label, value, onChange, onPickImage }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: label }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        Input,
        {
          value: value || "",
          onChange: (e) => onChange(e.target.value),
          placeholder: "https://...",
          className: "flex-1"
        }
      ),
      onPickImage && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        Button,
        {
          variant: "secondary",
          size: "icon",
          onClick: onPickImage,
          title: "Select Image",
          children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Image, { size: 16 })
        }
      )
    ] })
  ] });
};
var PropertiesPanel = ({ onUploadImage, onFetchImages, mergeTags }) => {
  var _a, _b;
  const dispatch = (0, import_react_redux2.useDispatch)();
  const { elements, selectedElementId, canvasSettings } = (0, import_react_redux2.useSelector)((state) => state.editor);
  const [galleryCallback, setGalleryCallback] = import_react6.default.useState(null);
  const openGallery = (onChange) => {
    setGalleryCallback(() => onChange);
  };
  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const isMobile = canvasSettings.width <= 480;
  const getStyleValue = (key, defaultValue = "") => {
    var _a2, _b2, _c;
    if (isMobile && ((_b2 = (_a2 = selectedElement == null ? void 0 : selectedElement.style) == null ? void 0 : _a2.mobile) == null ? void 0 : _b2[key]) !== void 0) {
      return selectedElement.style.mobile[key];
    }
    return ((_c = selectedElement == null ? void 0 : selectedElement.style) == null ? void 0 : _c[key]) || defaultValue;
  };
  const handleStyleChange = (key, value) => {
    if (!selectedElement) return;
    let newStyle = __spreadValues({}, selectedElement.style);
    if (isMobile) {
      newStyle.mobile = __spreadProps(__spreadValues({}, newStyle.mobile), {
        [key]: value
      });
    } else {
      newStyle = __spreadProps(__spreadValues({}, newStyle), {
        [key]: value
      });
    }
    dispatch(updateElement({
      id: selectedElement.id,
      changes: { style: newStyle }
    }));
  };
  const handleContentChange = (key, value) => {
    if (!selectedElement) return;
    dispatch(updateElement({
      id: selectedElement.id,
      changes: {
        content: __spreadProps(__spreadValues({}, selectedElement.content), { [key]: value })
      }
    }));
  };
  const handleGlobalChange = (key, value) => {
    dispatch(updateCanvasSettings({ [key]: value }));
  };
  const PropertySection = ({ title, icon: Icon, children }) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "border-b last:border-0 border-border", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "px-6 py-4 flex items-center gap-2 bg-muted/20", children: [
      Icon && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Icon, { size: 14, className: "text-muted-foreground" }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-xs font-medium text-foreground uppercase tracking-widest", children: title })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "p-6 space-y-4", children })
  ] });
  if (!selectedElement) {
    return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("aside", { className: "w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "p-6 border-b flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Sliders, { size: 18 }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h2", { className: "font-semibold text-lg", children: "Settings" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(PropertySection, { title: "Canvas Dimensions", icon: import_lucide_react6.Layout, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Width (px)" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              type: "number",
              value: canvasSettings.width,
              onChange: (e) => handleGlobalChange("width", parseInt(e.target.value))
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-[0.8rem] text-muted-foreground", children: "Standard email width is 600px." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(PropertySection, { title: "Background", icon: import_lucide_react6.Palette, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Color" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "relative w-10 h-10 rounded-md border overflow-hidden shadow-sm shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "input",
            {
              type: "color",
              value: canvasSettings.backgroundColor,
              onChange: (e) => handleGlobalChange("backgroundColor", e.target.value),
              className: "absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              type: "text",
              value: canvasSettings.backgroundColor,
              onChange: (e) => handleGlobalChange("backgroundColor", e.target.value),
              className: "font-mono"
            }
          )
        ] })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(PropertySection, { title: "Global Styles", icon: import_lucide_react6.Type, children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Font Family" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
            "select",
            {
              className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              value: canvasSettings.fontFamily,
              onChange: (e) => handleGlobalChange("fontFamily", e.target.value),
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("optgroup", { label: "Sans Serif", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "Arial, sans-serif", children: "Arial" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "'Helvetica Neue', Helvetica, sans-serif", children: "Helvetica" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "'Open Sans', sans-serif", children: "Open Sans" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "'Roboto', sans-serif", children: "Roboto" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "Verdana, sans-serif", children: "Verdana" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("optgroup", { label: "Serif", children: [
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "'Times New Roman', Times, serif", children: "Times New Roman" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "Georgia, serif", children: "Georgia" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "'Merriweather', serif", children: "Merriweather" }),
                  /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "'Playfair Display', serif", children: "Playfair Display" })
                ] }),
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("optgroup", { label: "Monospace", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "'Courier New', Courier, monospace", children: "Courier New" }) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Text Color" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                "input",
                {
                  type: "color",
                  value: canvasSettings.textColor || "#000000",
                  onChange: (e) => handleGlobalChange("textColor", e.target.value),
                  className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                Input,
                {
                  value: canvasSettings.textColor || "#000000",
                  onChange: (e) => handleGlobalChange("textColor", e.target.value),
                  className: "h-8 font-mono text-xs"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Link Color" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                "input",
                {
                  type: "color",
                  value: canvasSettings.linkColor || "#007bff",
                  onChange: (e) => handleGlobalChange("linkColor", e.target.value),
                  className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                }
              ) }),
              /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
                Input,
                {
                  value: canvasSettings.linkColor || "#007bff",
                  onChange: (e) => handleGlobalChange("linkColor", e.target.value),
                  className: "h-8 font-mono text-xs"
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Line Height" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              Input,
              {
                type: "number",
                step: "0.1",
                min: "1",
                max: "3",
                value: canvasSettings.lineHeight || "1.5",
                onChange: (e) => handleGlobalChange("lineHeight", e.target.value)
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("span", { className: "text-xs text-muted-foreground w-12 text-right", children: [
              canvasSettings.lineHeight || 1.5,
              "em"
            ] })
          ] })
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("aside", { className: "w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto", children: [
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "p-6 border-b flex items-center justify-between bg-muted/10", children: [
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("h2", { className: "font-semibold text-lg capitalize", children: selectedElement.type }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded", children: selectedElement.id.slice(0, 4) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(PropertySection, { title: "Content", icon: import_lucide_react6.Type, children: [
      selectedElement.type === "text" && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Text Content" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "textarea",
            {
              value: selectedElement.content.text || "",
              onChange: (e) => handleContentChange("text", e.target.value),
              className: "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { className: "text-xs", children: "Insert Variable" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
            "select",
            {
              className: "h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs",
              onChange: (e) => {
                if (!e.target.value) return;
                handleContentChange("text", (selectedElement.content.text || "") + e.target.value);
                e.target.value = "";
              },
              children: [
                /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: "", children: "Select variable..." }),
                (mergeTags || [
                  { value: "{{ first_name }}", label: "First Name" },
                  { value: "{{ last_name }}", label: "Last Name" },
                  { value: "{{ email }}", label: "Email Address" },
                  { value: "{{ unsubscribe_url }}", label: "Unsubscribe Link" },
                  { value: "{{ current_year }}", label: "Current Year" },
                  { value: "{{ company_name }}", label: "Company Name" }
                ]).map((tag) => /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("option", { value: tag.value, children: tag.label }, tag.value))
              ]
            }
          )
        ] })
      ] }),
      selectedElement.type === "button" && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Button Label" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              type: "text",
              value: selectedElement.content.label || "",
              onChange: (e) => handleContentChange("label", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Link URL" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "relative", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.Link, { size: 14, className: "absolute left-3 top-2.5 text-muted-foreground" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              Input,
              {
                type: "text",
                value: selectedElement.content.url || "",
                onChange: (e) => handleContentChange("url", e.target.value),
                className: "pl-9"
              }
            )
          ] })
        ] })
      ] }),
      selectedElement.type === "social" && selectedElement.content.socialLinks && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Social Networks" }),
        selectedElement.content.socialLinks.map((link, index) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2 border p-3 rounded-md bg-muted/20", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("span", { className: "text-xs font-semibold capitalize", children: link.network }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              value: link.url,
              onChange: (e) => {
                const newLinks = [...selectedElement.content.socialLinks || []];
                newLinks[index] = __spreadProps(__spreadValues({}, newLinks[index]), { url: e.target.value });
                handleContentChange("socialLinks", newLinks);
              },
              placeholder: `https://${link.network}.com/...`,
              className: "h-8 text-xs"
            }
          )
        ] }, index))
      ] }),
      selectedElement.type === "product" && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Product Title" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              value: selectedElement.content.text || "",
              onChange: (e) => handleContentChange("text", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Price" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              Input,
              {
                value: selectedElement.content.price || "",
                onChange: (e) => handleContentChange("price", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Currency" }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              Input,
              {
                value: selectedElement.content.currency || "$",
                onChange: (e) => handleContentChange("currency", e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          ImageInput,
          {
            label: "Image URL",
            value: selectedElement.content.imageUrl || "",
            onChange: (val) => handleContentChange("imageUrl", val),
            onPickImage: () => openGallery((val) => handleContentChange("imageUrl", val))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Button Label" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              value: selectedElement.content.label || "",
              onChange: (e) => handleContentChange("label", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Product URL" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              value: selectedElement.content.url || "",
              onChange: (e) => handleContentChange("url", e.target.value)
            }
          )
        ] })
      ] }),
      selectedElement.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          ImageInput,
          {
            label: "Image Source",
            value: selectedElement.content.url || "",
            onChange: (val) => handleContentChange("url", val),
            onPickImage: () => openGallery((val) => handleContentChange("url", val))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "rounded-lg border bg-muted/20 p-4 flex items-center justify-center min-h-[120px]", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          "img",
          {
            src: selectedElement.content.url,
            className: "max-w-full max-h-[150px] object-contain rounded shadow-sm",
            alt: "preview",
            onError: (e) => {
              e.target.src = "https://via.placeholder.com/150?text=Invalid+Image";
            }
          }
        ) }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Alt Text" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              value: selectedElement.content.alt || "",
              onChange: (e) => handleContentChange("alt", e.target.value),
              placeholder: "Description for accessibility"
            }
          )
        ] })
      ] }),
      selectedElement.type === "video" && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Video URL (YouTube/Vimeo)" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              value: selectedElement.content.url || "",
              onChange: (e) => handleContentChange("url", e.target.value),
              placeholder: "https://youtube.com/watch?v=..."
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          ImageInput,
          {
            label: "Thumbnail URL (Optional)",
            value: selectedElement.content.thumbnailUrl || "",
            onChange: (val) => handleContentChange("thumbnailUrl", val),
            onPickImage: () => openGallery((val) => handleContentChange("thumbnailUrl", val))
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Alt Text" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              value: selectedElement.content.alt || "",
              onChange: (e) => handleContentChange("alt", e.target.value)
            }
          )
        ] })
      ] }),
      selectedElement.type === "countdown" && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "space-y-4", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "End Date & Time" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          Input,
          {
            type: "datetime-local",
            value: ((_a = selectedElement.content.endTime) == null ? void 0 : _a.slice(0, 16)) || "",
            onChange: (e) => handleContentChange("endTime", new Date(e.target.value).toISOString())
          }
        )
      ] }) }),
      selectedElement.type === "html" && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "space-y-4", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "HTML Code" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          "textarea",
          {
            className: "flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono",
            value: selectedElement.content.html || "",
            onChange: (e) => handleContentChange("html", e.target.value),
            placeholder: "<div>Your custom HTML here</div>"
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("p", { className: "text-xs text-muted-foreground", children: "Warning: Invalid HTML may break the layout." })
      ] }) }),
      selectedElement.type === "spacer" && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Height" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          Input,
          {
            type: "text",
            value: selectedElement.style.height || "32px",
            onChange: (e) => handleStyleChange("height", e.target.value),
            placeholder: "e.g. 32px"
          }
        )
      ] }),
      selectedElement.type === "divider" && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Divider Color" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            "input",
            {
              type: "color",
              value: selectedElement.style.borderTopColor || "#eeeeee",
              onChange: (e) => handleStyleChange("borderTopColor", e.target.value),
              className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
            Input,
            {
              type: "text",
              value: selectedElement.style.borderTopColor || "#eeeeee",
              onChange: (e) => handleStyleChange("borderTopColor", e.target.value),
              placeholder: "#eeeeee",
              className: "font-mono text-xs"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(PropertySection, { title: isMobile ? "Appearance (Mobile)" : "Appearance", icon: import_lucide_react6.Palette, children: [
      selectedElement.type === "section" && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2 mb-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Background Image URL" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          Input,
          {
            value: ((_b = getStyleValue("backgroundImage")) == null ? void 0 : _b.replace(/^url\(['"](.+)['"]\)$/, "$1")) || "",
            onChange: (e) => handleStyleChange("backgroundImage", e.target.value ? `url('${e.target.value}')` : ""),
            placeholder: "https://example.com/image.jpg"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Background Color" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "input",
              {
                type: "color",
                value: getStyleValue("backgroundColor", "#ffffff"),
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              Input,
              {
                value: getStyleValue("backgroundColor", "#ffffff"),
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "h-8 font-mono text-xs"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Text Color" }),
          /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              "input",
              {
                type: "color",
                value: getStyleValue("color", "#000000"),
                onChange: (e) => handleStyleChange("color", e.target.value),
                className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
              Input,
              {
                value: getStyleValue("color", "#000000"),
                onChange: (e) => handleStyleChange("color", e.target.value),
                className: "h-8 font-mono text-xs"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Separator, {}),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
        SpacingControl,
        {
          label: "Padding",
          value: getStyleValue("padding", "0px"),
          onChange: (val) => handleStyleChange("padding", val)
        }
      ),
      /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Alignment" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)("div", { className: "flex bg-muted rounded-md p-1", children: ["left", "center", "right", "justify"].map((align) => /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)(
          "button",
          {
            onClick: () => handleStyleChange("textAlign", align),
            className: cn(
              "flex-1 flex items-center justify-center py-1.5 rounded-sm text-muted-foreground transition-all hover:text-foreground",
              getStyleValue("textAlign") === align && "bg-background shadow-sm text-foreground"
            ),
            title: align.charAt(0).toUpperCase() + align.slice(1),
            children: [
              align === "left" && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.AlignLeft, { size: 16 }),
              align === "center" && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.AlignCenter, { size: 16 }),
              align === "right" && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.AlignRight, { size: 16 }),
              align === "justify" && /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(import_lucide_react6.AlignJustify, { size: 16 })
            ]
          },
          align
        )) })
      ] }),
      selectedElement.type === "button" && /* @__PURE__ */ (0, import_jsx_runtime13.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(Label, { children: "Border Radius" }),
        /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
          Input,
          {
            type: "text",
            value: getStyleValue("borderRadius", "0px"),
            onChange: (e) => handleStyleChange("borderRadius", e.target.value),
            placeholder: "e.g. 4px"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime13.jsx)(
      ImageGalleryModal,
      {
        isOpen: !!galleryCallback,
        onClose: () => setGalleryCallback(null),
        onSelect: (url) => {
          if (galleryCallback) galleryCallback(url);
        },
        onUpload: onUploadImage,
        fetchImages: onFetchImages
      }
    )
  ] });
};

// src/components/editor/Canvas.tsx
var import_react_dnd4 = require("react-dnd");
var import_react_redux5 = require("react-redux");

// src/components/editor/CanvasElement.tsx
var import_react7 = require("react");
var import_react_dnd3 = require("react-dnd");
var import_react_redux4 = require("react-redux");
var import_lucide_react7 = require("lucide-react");

// src/components/editor/ColumnDropZone.tsx
var import_react_dnd2 = require("react-dnd");
var import_react_redux3 = require("react-redux");
var import_jsx_runtime14 = require("react/jsx-runtime");
var ColumnDropZone = ({ parentId, columnId, elements }) => {
  const dispatch = (0, import_react_redux3.useDispatch)();
  const [{ isOver, canDrop }, drop] = (0, import_react_dnd2.useDrop)(() => ({
    accept: "ELEMENT",
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      dispatch(addElement({ type: item.type, parentId, columnId }));
      return { droppedInColumn: true };
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop()
    })
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(
    "div",
    {
      ref: drop,
      className: `flex-1 min-h-[50px] p-2 transition-colors flex flex-col gap-2
                ${isOver ? "bg-indigo-50 border-2 border-indigo-300 border-dashed ring-2 ring-indigo-200" : "bg-transparent border border-dashed border-gray-200"}
                ${elements.length === 0 ? "items-center justify-center" : ""}
            `,
      children: elements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime14.jsx)("div", { className: "text-xs text-muted-foreground pointer-events-none", children: "Drop here" }) : elements.map((el, index) => (
        // Note: We might need to pass context that this is nested if we want nested sorting later
        /* @__PURE__ */ (0, import_jsx_runtime14.jsx)(CanvasElement, { element: el, index }, el.id)
      ))
    }
  );
};

// src/components/editor/CanvasElement.tsx
var import_jsx_runtime15 = require("react/jsx-runtime");
var EditableText = ({
  initialText,
  onChange,
  style,
  isEditing,
  onToggleEdit
}) => {
  const ref = (0, import_react7.useRef)(null);
  (0, import_react7.useEffect)(() => {
    if (ref.current) {
      if (document.activeElement !== ref.current && ref.current.innerText !== initialText) {
        ref.current.innerText = initialText;
      }
    }
  }, [initialText]);
  (0, import_react7.useEffect)(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
    }
  }, [isEditing]);
  const handleInput = (e) => {
    const text = e.currentTarget.innerText;
    onChange(text);
  };
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
    "p",
    {
      ref,
      contentEditable: isEditing,
      suppressContentEditableWarning: true,
      style: __spreadProps(__spreadValues({}, style), { outline: isEditing ? "1px dashed #2563eb" : "none", cursor: isEditing ? "text" : "pointer", minHeight: "1.2em" }),
      onInput: handleInput,
      onBlur: () => onToggleEdit(false),
      onClick: (e) => {
        if (isEditing) e.stopPropagation();
      }
    }
  );
};
var CanvasElement = ({ element, index }) => {
  const dispatch = (0, import_react_redux4.useDispatch)();
  const selectedId = (0, import_react_redux4.useSelector)((state) => state.editor.selectedElementId);
  const isSelected = selectedId === element.id;
  const [isEditing, setIsEditing] = (0, import_react7.useState)(false);
  const ref = (0, import_react7.useRef)(null);
  const [{ handlerId }, drop] = (0, import_react_dnd3.useDrop)({
    accept: "CANVAS_ELEMENT",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) {
        return;
      }
      dispatch(moveElement({ dragIndex, hoverIndex }));
      item.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = (0, import_react_dnd3.useDrag)({
    type: "CANVAS_ELEMENT",
    item: () => {
      return { id: element.id, index };
    },
    canDrag: () => !isEditing,
    // Disable drag when editing text
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  drag(drop(ref));
  const handleClick = (e) => {
    e.stopPropagation();
    if (isSelected && element.type === "text") {
      setIsEditing(true);
    }
    dispatch(selectElement(element.id));
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(removeElement(element.id));
  };
  const renderContent = () => {
    var _a, _b;
    switch (element.type) {
      case "text":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          EditableText,
          {
            initialText: element.content.text || "",
            onChange: (val) => dispatch(updateElement({
              id: element.id,
              changes: { content: __spreadProps(__spreadValues({}, element.content), { text: val }) }
            })),
            style: { fontSize: "inherit", color: "inherit" },
            isEditing,
            onToggleEdit: setIsEditing
          }
        );
      case "button":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("a", { href: element.content.url, style: { display: "block", textDecoration: "none", color: "inherit" }, children: element.content.label });
      case "image":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("img", { src: element.content.url, alt: element.content.alt, style: { maxWidth: "100%", display: "block" } });
      case "divider":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("hr", { style: {
          borderTopWidth: element.style.borderTopWidth || "1px",
          borderTopColor: element.style.borderTopColor || "#eeeeee",
          borderTopStyle: element.style.borderTopStyle || "solid"
        } });
      case "spacer":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { style: { height: element.style.height || "32px" } });
      case "social":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex gap-2 justify-center", children: [
          (_a = element.content.socialLinks) == null ? void 0 : _a.map((link, i) => {
            const iconSize = 24;
            const color = element.style.color || "#374151";
            switch (link.network) {
              case "facebook":
                return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react7.Facebook, { size: iconSize, color }, i);
              case "twitter":
                return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react7.Twitter, { size: iconSize, color }, i);
              case "instagram":
                return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react7.Instagram, { size: iconSize, color }, i);
              case "linkedin":
                return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react7.Linkedin, { size: iconSize, color }, i);
              default:
                return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react7.Share2, { size: iconSize, color }, i);
            }
          }),
          (!element.content.socialLinks || element.content.socialLinks.length === 0) && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "text-slate-400 italic text-sm", children: "No social links" })
        ] });
      case "product":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            "img",
            {
              src: element.content.imageUrl,
              alt: element.content.text,
              style: {
                width: "100%",
                maxHeight: "200px",
                objectFit: "contain",
                marginBottom: "16px"
              }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("h3", { style: { margin: "0 0 8px 0", fontSize: "18px", fontWeight: "bold" }, children: element.content.text }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("p", { style: { margin: "0 0 16px 0", fontSize: "16px", color: "#666" }, children: [
            element.content.currency,
            element.content.price
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { style: {
            display: "inline-block",
            backgroundColor: "#007bff",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "4px",
            textDecoration: "none",
            fontWeight: "bold"
          }, children: element.content.label })
        ] });
      case "video":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "relative group/video cursor-pointer", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
            "img",
            {
              src: element.content.thumbnailUrl,
              alt: element.content.alt,
              style: { width: "100%", display: "block", height: "auto" }
            }
          ),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/30 transition-colors", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "bg-white/90 rounded-full p-4 shadow-lg transform transition-transform group-hover/video:scale-110", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", className: "text-black", children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("path", { d: "M8 5v14l11-7z" }) }) }) })
        ] });
      case "countdown":
        const endTime = new Date(element.content.endTime || Date.now()).getTime();
        const now = Date.now();
        const diff = Math.max(0, endTime - now);
        const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
        const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
        const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
        const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "flex justify-center gap-4 text-center", children: [
          { val: days, label: "Days" },
          { val: hours, label: "Hours" },
          { val: minutes, label: "Mins" },
          { val: seconds, label: "Secs" }
        ].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)("div", { className: "flex flex-col min-w-[60px] p-2 rounded bg-black/10", children: [
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "text-2xl font-bold", children: String(item.val).padStart(2, "0") }),
          /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("span", { className: "text-xs uppercase opacity-70", children: item.label })
        ] }, i)) });
      case "html":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { dangerouslySetInnerHTML: { __html: element.content.html || "" } });
      case "columns":
      case "columns-3":
      case "section":
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { className: "flex w-full h-full", style: { gap: "0" }, children: (_b = element.content.columns) == null ? void 0 : _b.map((col, i) => /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          ColumnDropZone,
          {
            parentId: element.id,
            columnId: col.id,
            elements: col.elements
          },
          col.id
        )) });
        return /* @__PURE__ */ (0, import_jsx_runtime15.jsx)("div", { children: "Unknown Element" });
    }
  };
  const canvasSettings = (0, import_react_redux4.useSelector)((state) => state.editor.canvasSettings);
  const isMobile = canvasSettings.width <= 480;
  const finalStyle = isMobile && element.style.mobile ? __spreadValues(__spreadValues({}, element.style), element.style.mobile) : element.style;
  return /* @__PURE__ */ (0, import_jsx_runtime15.jsxs)(
    "div",
    {
      ref,
      onClick: handleClick,
      "data-handler-id": handlerId,
      className: `
        relative group
        ${isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300"}
        cursor-pointer
        transition-all
      `,
      style: __spreadValues({
        opacity: isDragging ? 0.3 : 1
      }, finalStyle),
      children: [
        isSelected && /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(
          "div",
          {
            className: "absolute -top-3 -right-3 bg-white shadow-md rounded-full p-1 cursor-pointer z-50 group-hover:block",
            onClick: handleDelete,
            children: /* @__PURE__ */ (0, import_jsx_runtime15.jsx)(import_lucide_react7.Trash2, { size: 14, className: "text-red-500" })
          }
        ),
        renderContent()
      ]
    }
  );
};

// src/components/editor/Canvas.tsx
var import_jsx_runtime16 = require("react/jsx-runtime");
var Canvas = () => {
  const dispatch = (0, import_react_redux5.useDispatch)();
  const { elements, canvasSettings } = (0, import_react_redux5.useSelector)((state) => state.editor);
  const [{ isOver }, drop] = (0, import_react_dnd4.useDrop)(() => ({
    accept: "ELEMENT",
    drop: (item, monitor) => {
      if (monitor.didDrop()) {
        return;
      }
      dispatch(addElement({ type: item.type }));
      return void 0;
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver()
    })
  }));
  const handleBackgroundClick = () => {
    dispatch(selectElement(null));
  };
  return /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
    "main",
    {
      className: "flex-1 bg-slate-100/50 p-10 overflow-y-auto flex justify-center relative z-0",
      onClick: handleBackgroundClick,
      children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex flex-col items-center w-full max-w-[1200px] py-12", children: [
        /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "text-[10px] text-slate-400 mb-3 font-medium uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-slate-200/50 backdrop-blur-sm", children: [
          "Width: ",
          canvasSettings.width,
          "px"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(
          "div",
          {
            ref: drop,
            className: `
            bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] transition-all duration-300 min-h-[800px] flex flex-col relative
            ${isOver ? "ring-4 ring-indigo-500/20 scale-[1.01]" : ""}
            `,
            style: {
              width: canvasSettings.width,
              backgroundColor: canvasSettings.backgroundColor,
              fontFamily: canvasSettings.fontFamily,
              color: canvasSettings.textColor,
              lineHeight: canvasSettings.lineHeight,
              maxWidth: "100%"
            },
            onClick: (e) => e.stopPropagation(),
            children: elements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center text-center max-w-sm mx-auto", children: [
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("span", { className: "text-3xl text-slate-300", children: "+" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("h3", { className: "text-slate-900 font-medium mb-1", children: "Start Building" }),
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("p", { className: "text-slate-500 text-sm", children: "Drag and drop elements from the left panel to begin designing your newsletter." })
            ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime16.jsxs)("div", { className: "flex flex-col w-full h-full", children: [
              elements.map((element, index) => /* @__PURE__ */ (0, import_jsx_runtime16.jsx)(CanvasElement, { element, index }, element.id)),
              /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "flex-1 min-h-[50px] transition-colors" })
            ] })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime16.jsx)("div", { className: "h-20" }),
        " "
      ] })
    }
  );
};

// src/components/EmailEditor.tsx
var import_jsx_runtime17 = require("react/jsx-runtime");
var EmailEditor = ({ onSave, onLoad, onUploadImage, onFetchImages, onSendTestEmail, mergeTags }) => {
  return /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_react_redux6.Provider, { store, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(import_react_dnd5.DndProvider, { backend: import_react_dnd_html5_backend.HTML5Backend, children: /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex flex-col h-full w-full overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Header, { onSave, onLoad, onSendTestEmail }),
    /* @__PURE__ */ (0, import_jsx_runtime17.jsxs)("div", { className: "flex flex-1 overflow-hidden relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(ToolsPanel, {}),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(Canvas, {}),
      /* @__PURE__ */ (0, import_jsx_runtime17.jsx)(PropertiesPanel, { onUploadImage, onFetchImages, mergeTags })
    ] })
  ] }) }) });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmailEditor,
  addElement,
  cn,
  generateHtml,
  loadState,
  moveElement,
  redo,
  removeElement,
  selectElement,
  undo,
  updateCanvasSettings,
  updateElement
});
//# sourceMappingURL=index.js.map