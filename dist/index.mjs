var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
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

// src/components/EmailEditor.tsx
import { Provider } from "react-redux";

// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";

// src/store/editorSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
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
var editorSlice = createSlice({
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
        id: uuidv4(),
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
          { id: uuidv4(), elements: [] },
          { id: uuidv4(), elements: [] }
        ]
      };
    case "columns-3":
      return {
        columns: [
          { id: uuidv4(), elements: [] },
          { id: uuidv4(), elements: [] },
          { id: uuidv4(), elements: [] }
        ]
      };
    case "section":
      return {
        columns: [
          { id: uuidv4(), elements: [] }
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

// src/store/formEditorSlice.ts
import { createSlice as createSlice2 } from "@reduxjs/toolkit";
import { v4 as uuidv42 } from "uuid";
var initialSettings = {
  width: 600,
  backgroundColor: "#ffffff",
  borderRadius: 8,
  padding: "20px",
  fontFamily: "Arial, sans-serif",
  overlayColor: "rgba(0, 0, 0, 0.5)",
  overlayOpacity: 0.5,
  position: "center"
};
var initialBehavior = {
  triggerConfig: {
    timeoutSeconds: 5,
    exitIntent: true
  },
  displayFrequency: "once_per_user",
  deviceTargeting: "all"
};
var initialStep = {
  id: uuidv42(),
  name: "Email Opt-in",
  elements: []
};
var initialState2 = {
  steps: [initialStep],
  currentStepId: initialStep.id,
  formSettings: initialSettings,
  behavior: initialBehavior,
  selectedElementId: null,
  history: {
    past: [],
    future: []
  }
};
var formEditorSlice = createSlice2({
  name: "formEditor",
  initialState: initialState2,
  reducers: {
    // --- Step Management ---
    addStep: (state, action) => {
      saveHistory2(state);
      const newStep = {
        id: uuidv42(),
        name: action.payload.name,
        elements: []
      };
      state.steps.push(newStep);
      state.currentStepId = newStep.id;
    },
    removeStep: (state, action) => {
      saveHistory2(state);
      state.steps = state.steps.filter((s) => s.id !== action.payload);
      if (state.currentStepId === action.payload && state.steps.length > 0) {
        state.currentStepId = state.steps[0].id;
      }
    },
    setActiveStep: (state, action) => {
      state.currentStepId = action.payload;
      state.selectedElementId = null;
    },
    renameStep: (state, action) => {
      saveHistory2(state);
      const step = state.steps.find((s) => s.id === action.payload.id);
      if (step) {
        step.name = action.payload.name;
      }
    },
    // --- Global Settings ---
    updateFormSettings: (state, action) => {
      saveHistory2(state);
      state.formSettings = __spreadValues(__spreadValues({}, state.formSettings), action.payload);
    },
    updateBehavior: (state, action) => {
      saveHistory2(state);
      state.behavior = __spreadValues(__spreadValues({}, state.behavior), action.payload);
    },
    // --- Element Management (Scoped to Current Step) ---
    addElement: (state, action) => {
      saveHistory2(state);
      const currentStep = state.steps.find((s) => s.id === state.currentStepId);
      if (!currentStep) return;
      const newElement = {
        id: uuidv42(),
        type: action.payload.type,
        content: getDefaultContent2(action.payload.type),
        style: getDefaultStyle2(action.payload.type)
      };
      if (action.payload.index !== void 0 && action.payload.index >= 0) {
        currentStep.elements.splice(action.payload.index, 0, newElement);
      } else {
        currentStep.elements.push(newElement);
      }
      state.selectedElementId = newElement.id;
    },
    updateElement: (state, action) => {
      saveHistory2(state);
      const currentStep = state.steps.find((s) => s.id === state.currentStepId);
      if (!currentStep) return;
      const index = currentStep.elements.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        currentStep.elements[index] = __spreadValues(__spreadValues({}, currentStep.elements[index]), action.payload.changes);
      }
    },
    removeElement: (state, action) => {
      saveHistory2(state);
      const currentStep = state.steps.find((s) => s.id === state.currentStepId);
      if (!currentStep) return;
      currentStep.elements = currentStep.elements.filter((el) => el.id !== action.payload);
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
      }
    },
    selectElement: (state, action) => {
      state.selectedElementId = action.payload;
    },
    moveElement: (state, action) => {
      saveHistory2(state);
      const currentStep = state.steps.find((s) => s.id === state.currentStepId);
      if (!currentStep) return;
      const { dragIndex, hoverIndex } = action.payload;
      const dragElement = currentStep.elements[dragIndex];
      currentStep.elements.splice(dragIndex, 1);
      currentStep.elements.splice(hoverIndex, 0, dragElement);
    },
    // --- History ---
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        state.history.future.unshift({
          steps: state.steps,
          formSettings: state.formSettings,
          behavior: state.behavior,
          currentStepId: state.currentStepId
        });
        state.steps = previous.steps;
        state.formSettings = previous.formSettings;
        state.behavior = previous.behavior;
        state.currentStepId = previous.currentStepId;
        state.history.past = newPast;
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        state.history.past.push({
          steps: state.steps,
          formSettings: state.formSettings,
          behavior: state.behavior,
          currentStepId: state.currentStepId
        });
        state.steps = next.steps;
        state.formSettings = next.formSettings;
        state.behavior = next.behavior;
        state.currentStepId = next.currentStepId;
        state.history.future = newFuture;
      }
    }
  }
});
function saveHistory2(state) {
  if (state.history.past.length > 20) {
    state.history.past.shift();
  }
  state.history.past.push({
    steps: JSON.parse(JSON.stringify(state.steps)),
    // Deep copy
    formSettings: __spreadValues({}, state.formSettings),
    behavior: __spreadValues({}, state.behavior),
    currentStepId: state.currentStepId
  });
  state.history.future = [];
}
function getDefaultContent2(type) {
  switch (type) {
    case "text":
      return { text: "<strong>Sign up for updates</strong><br>Get news and special offers." };
    case "image":
      return { url: "https://via.placeholder.com/150", alt: "Placeholder" };
    case "form-input":
      return { label: "Email Address", placeholder: "Enter your email", required: true, inputType: "email" };
    case "form-submit":
      return { label: "Subscribe", width: "100%" };
    case "button":
      return { label: "No thanks", url: "#", width: "auto" };
    case "spacer":
      return {};
    case "divider":
      return {};
    default:
      return {};
  }
}
function getDefaultStyle2(type) {
  const base = { padding: "10px", margin: "0px" };
  switch (type) {
    case "form-submit":
      return __spreadProps(__spreadValues({}, base), {
        backgroundColor: "#333333",
        color: "#ffffff",
        padding: "12px 24px",
        borderRadius: "4px",
        textAlign: "center",
        fontWeight: "bold",
        width: "100%",
        cursor: "pointer"
      });
    case "form-input":
      return __spreadProps(__spreadValues({}, base), {
        border: "1px solid #ccc",
        borderRadius: "4px",
        padding: "10px",
        width: "100%",
        backgroundColor: "#fff",
        color: "#333"
      });
    case "text":
      return __spreadProps(__spreadValues({}, base), { textAlign: "center", color: "#333" });
    case "button":
      return __spreadProps(__spreadValues({}, base), { color: "#666", textDecoration: "underline", fontSize: "14px", textAlign: "center" });
    default:
      return base;
  }
}
var {
  addStep,
  removeStep,
  setActiveStep,
  renameStep,
  updateFormSettings,
  updateBehavior,
  addElement: addElement2,
  updateElement: updateElement2,
  removeElement: removeElement2,
  selectElement: selectElement2,
  moveElement: moveElement2,
  undo: undo2,
  redo: redo2
} = formEditorSlice.actions;
var formEditorSlice_default = formEditorSlice.reducer;

// src/store/index.ts
var store = configureStore({
  reducer: {
    editor: editorSlice_default,
    formEditor: formEditorSlice_default
  }
});

// src/components/EmailEditor.tsx
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// src/components/layout/Header.tsx
import React9 from "react";
import { Undo, Redo, Eye, Save, Download as Download2, Mail, FileText as FileText2, Monitor as Monitor2, Smartphone as Smartphone2, Sparkles as Sparkles2, Lightbulb as Lightbulb2 } from "lucide-react";

// src/components/ui/button.tsx
import * as React from "react";
import { cva } from "class-variance-authority";

// src/lib/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// src/components/ui/button.tsx
import { jsx } from "react/jsx-runtime";
var buttonVariants = cva(
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
    return /* @__PURE__ */ jsx(
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
import * as React2 from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
var Input = React2.forwardRef(
  (_a, ref) => {
    var _b = _a, { className, type } = _b, props = __objRest(_b, ["className", "type"]);
    return /* @__PURE__ */ jsx2(
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
import * as React3 from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
var Separator = React3.forwardRef((_a, ref) => {
  var _b = _a, { className, orientation = "horizontal" } = _b, props = __objRest(_b, ["className", "orientation"]);
  return /* @__PURE__ */ jsx3(
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
import { useDispatch, useSelector } from "react-redux";

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
import { useEffect, useState } from "react";
import { X, Smartphone, Monitor, Send, Loader2 } from "lucide-react";
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
var PreviewModal = ({ isOpen, onClose, editorState, onSendTestEmail }) => {
  const [html, setHtml] = useState("");
  const [viewMode, setViewMode] = useState("desktop");
  const [testEmail, setTestEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
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
  useEffect(() => {
    if (isOpen) {
      const generatedHtml = generateHtml(editorState);
      setHtml(generatedHtml);
    }
  }, [isOpen, editorState]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs("div", { className: "fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-sm animate-in fade-in zoom-in duration-200", children: [
    /* @__PURE__ */ jsxs("div", { className: "h-14 border-b flex items-center justify-between px-6 bg-background", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsx4("h2", { className: "font-semibold text-lg", children: "Preview" }),
        /* @__PURE__ */ jsxs("div", { className: "flex items-center bg-muted rounded-lg p-1", children: [
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: viewMode === "desktop" ? "secondary" : "ghost",
              size: "sm",
              className: "h-7 px-2",
              onClick: () => setViewMode("desktop"),
              children: [
                /* @__PURE__ */ jsx4(Monitor, { size: 14, className: "mr-2" }),
                "Desktop"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            Button,
            {
              variant: viewMode === "mobile" ? "secondary" : "ghost",
              size: "sm",
              className: "h-7 px-2",
              onClick: () => setViewMode("mobile"),
              children: [
                /* @__PURE__ */ jsx4(Smartphone, { size: 14, className: "mr-2" }),
                "Mobile"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        onSendTestEmail && /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mr-4", children: [
          /* @__PURE__ */ jsx4(
            Input,
            {
              placeholder: "Test email",
              value: testEmail,
              onChange: (e) => setTestEmail(e.target.value),
              className: "h-8 w-48 text-xs"
            }
          ),
          /* @__PURE__ */ jsxs(Button, { size: "sm", onClick: handleSendTest, disabled: isSending || !testEmail, children: [
            isSending ? /* @__PURE__ */ jsx4(Loader2, { size: 14, className: "animate-spin" }) : /* @__PURE__ */ jsx4(Send, { size: 14, className: "mr-2" }),
            "Send"
          ] })
        ] }),
        /* @__PURE__ */ jsx4(Button, { variant: "ghost", size: "icon", onClick: onClose, children: /* @__PURE__ */ jsx4(X, { size: 20 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx4("div", { className: "flex-1 overflow-auto bg-slate-100 flex justify-center p-8", children: /* @__PURE__ */ jsx4(
      "div",
      {
        className: `bg-white shadow-2xl transition-all duration-300 origin-top overflow-hidden border border-slate-200
                        ${viewMode === "mobile" ? "w-[375px] h-[812px] rounded-[40px] border-8 border-slate-800" : "w-[800px] h-full rounded-lg"}
                    `,
        children: /* @__PURE__ */ jsx4(
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
import { useEffect as useEffect2, useState as useState2 } from "react";
import { X as X2, FileText, Loader2 as Loader22 } from "lucide-react";
import { jsx as jsx5, jsxs as jsxs2 } from "react/jsx-runtime";
var TemplateListModal = ({ isOpen, onClose, onLoad, fetchTemplates }) => {
  const [templates, setTemplates] = useState2([]);
  const [loading, setLoading] = useState2(false);
  useEffect2(() => {
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
  return /* @__PURE__ */ jsx5("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs2("div", { className: "bg-card border shadow-lg rounded-lg w-[600px] h-[500px] flex flex-col", children: [
    /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between p-4 border-b", children: [
      /* @__PURE__ */ jsx5("h2", { className: "text-lg font-semibold", children: "Load Template" }),
      /* @__PURE__ */ jsx5(Button, { variant: "ghost", size: "icon", onClick: onClose, children: /* @__PURE__ */ jsx5(X2, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsx5("div", { className: "flex-1 overflow-y-auto p-4", children: loading ? /* @__PURE__ */ jsxs2("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground", children: [
      /* @__PURE__ */ jsx5(Loader22, { className: "animate-spin mb-2" }),
      "Loading templates..."
    ] }) : templates.length === 0 ? /* @__PURE__ */ jsxs2("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground", children: [
      /* @__PURE__ */ jsx5(FileText, { size: 48, className: "mb-4 opacity-50" }),
      /* @__PURE__ */ jsx5("p", { children: "No templates found." })
    ] }) : /* @__PURE__ */ jsx5("div", { className: "grid gap-3", children: templates.map((template) => /* @__PURE__ */ jsxs2("div", { className: "flex items-center justify-between p-4 rounded-md border bg-muted/20 hover:bg-muted/40 transition-colors", children: [
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx5("h3", { className: "font-medium", children: template.name }),
        /* @__PURE__ */ jsxs2("p", { className: "text-xs text-muted-foreground", children: [
          new Date(template.updatedAt).toLocaleDateString(),
          " at ",
          new Date(template.updatedAt).toLocaleTimeString()
        ] })
      ] }),
      /* @__PURE__ */ jsx5(Button, { size: "sm", onClick: () => {
        onLoad(template.data);
        onClose();
      }, children: "Load" })
    ] }, template.id)) }) })
  ] }) });
};

// src/components/ui/AiLayoutModal.tsx
import { useState as useState3 } from "react";
import { X as X3, Sparkles, Loader2 as Loader23, LayoutTemplate } from "lucide-react";

// src/components/ui/label.tsx
import * as React6 from "react";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx6 } from "react/jsx-runtime";
var labelVariants = cva2(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label = React6.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx6(
    "label",
    __spreadValues({
      ref,
      className: cn(labelVariants(), className)
    }, props)
  );
});
Label.displayName = "Label";

// src/components/ui/AiLayoutModal.tsx
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
var AiLayoutModal = ({
  isOpen,
  onClose,
  onSuccess,
  onGenerate
}) => {
  const [prompt, setPrompt] = useState3("");
  const [isLoading, setIsLoading] = useState3(false);
  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const newState = await onGenerate(prompt);
      onSuccess(newState);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to generate layout");
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx7("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs3("div", { className: "bg-background w-[600px] rounded-xl shadow-2xl flex flex-col overflow-hidden border", children: [
    /* @__PURE__ */ jsxs3("div", { className: "h-14 border-b px-4 flex items-center justify-between bg-muted/20", children: [
      /* @__PURE__ */ jsxs3("div", { className: "flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsx7(Sparkles, { size: 18 }),
        /* @__PURE__ */ jsx7("h3", { className: "font-semibold", children: "Magic Layout Generator" })
      ] }),
      /* @__PURE__ */ jsx7(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "h-8 w-8", children: /* @__PURE__ */ jsx7(X3, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxs3("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs3("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx7(Label, { children: "What would you like to build?" }),
        /* @__PURE__ */ jsxs3("div", { className: "relative", children: [
          /* @__PURE__ */ jsx7(
            "textarea",
            {
              className: "flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none",
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              placeholder: "e.g. 'A monthly newsletter for a tech startup. Include a hero section with a big announcement, a product showcase with 3 items, and a footer with social links.'",
              disabled: isLoading,
              onKeyDown: (e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  handleGenerate();
                }
              }
            }
          ),
          /* @__PURE__ */ jsx7("div", { className: "absolute bottom-2 right-2 text-xs text-muted-foreground", children: "\u2318+Enter to generate" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx7(Button, { variant: "outline", onClick: onClose, disabled: isLoading, children: "Cancel" }),
        /* @__PURE__ */ jsxs3(Button, { onClick: handleGenerate, disabled: !prompt || isLoading, className: "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0", children: [
          isLoading ? /* @__PURE__ */ jsx7(Loader23, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx7(Sparkles, { className: "mr-2 h-4 w-4" }),
          "Magic Build"
        ] })
      ] }),
      isLoading && /* @__PURE__ */ jsxs3("div", { className: "flex flex-col items-center justify-center py-8 text-muted-foreground animate-pulse", children: [
        /* @__PURE__ */ jsx7(LayoutTemplate, { size: 48, className: "mb-4 opacity-50" }),
        /* @__PURE__ */ jsx7("p", { className: "font-medium", children: "Constructing your layout..." }),
        /* @__PURE__ */ jsx7("p", { className: "text-xs", children: "This might take a few seconds" })
      ] })
    ] })
  ] }) });
};

// src/components/ui/SubjectLineModal.tsx
import { useState as useState4, useEffect as useEffect3 } from "react";
import { X as X4, Lightbulb, Loader2 as Loader24, Copy, Check } from "lucide-react";
import { jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
var SubjectLineModal = ({
  isOpen,
  onClose,
  onAnalyze
}) => {
  const [isLoading, setIsLoading] = useState4(false);
  const [results, setResults] = useState4(null);
  const [copiedIndex, setCopiedIndex] = useState4(null);
  useEffect3(() => {
    if (isOpen && onAnalyze) {
      setIsLoading(true);
      setResults(null);
      onAnalyze().then(setResults).catch((err) => {
        console.error(err);
        alert("Analysis failed.");
        onClose();
      }).finally(() => setIsLoading(false));
    }
  }, [isOpen]);
  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2e3);
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx8("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs4("div", { className: "bg-background w-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden border", children: [
    /* @__PURE__ */ jsxs4("div", { className: "h-14 border-b px-4 flex items-center justify-between bg-muted/20", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsx8(Lightbulb, { size: 18 }),
        /* @__PURE__ */ jsx8("h3", { className: "font-semibold", children: "Optimize Subject Line" })
      ] }),
      /* @__PURE__ */ jsx8(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "h-8 w-8", children: /* @__PURE__ */ jsx8(X4, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsx8("div", { className: "p-6 min-h-[200px]", children: isLoading ? /* @__PURE__ */ jsxs4("div", { className: "flex flex-col items-center justify-center h-40 text-muted-foreground animate-pulse", children: [
      /* @__PURE__ */ jsx8(Loader24, { size: 32, className: "mb-2 animate-spin" }),
      /* @__PURE__ */ jsx8("p", { className: "text-sm", children: "Analyzing content..." })
    ] }) : results ? /* @__PURE__ */ jsxs4("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxs4("div", { className: "flex justify-between items-center text-sm mb-2", children: [
        /* @__PURE__ */ jsx8("span", { className: "font-medium", children: "Recommended Subject Lines" }),
        results.spamScore !== void 0 && /* @__PURE__ */ jsxs4("span", { className: `px-2 py-0.5 rounded text-xs font-mono font-bold ${results.spamScore < 3 ? "bg-green-100 text-green-700" : results.spamScore < 5 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`, children: [
          "Spam Score: ",
          results.spamScore,
          "/10"
        ] })
      ] }),
      /* @__PURE__ */ jsx8("div", { className: "space-y-2", children: results.subjectLines.map((line, idx) => /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-2 p-3 rounded-lg border bg-card hover:border-primary transition-colors group", children: [
        /* @__PURE__ */ jsx8("span", { className: "flex-1 text-sm font-medium", children: line }),
        /* @__PURE__ */ jsx8(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
            onClick: () => handleCopy(line, idx),
            title: "Copy to clipboard",
            children: copiedIndex === idx ? /* @__PURE__ */ jsx8(Check, { size: 14, className: "text-green-600" }) : /* @__PURE__ */ jsx8(Copy, { size: 14 })
          }
        )
      ] }, idx)) })
    ] }) : /* @__PURE__ */ jsx8("div", { className: "text-center text-muted-foreground", children: "No result." }) })
  ] }) });
};

// src/lib/content-scraper.ts
function scrapeContent(state) {
  const textParts = [];
  function traverse(elements) {
    elements.forEach((el) => {
      if (el.content.text) {
        const text = el.content.text.replace(/<[^>]*>?/gm, " ");
        textParts.push(text);
      }
      if (el.content.label) textParts.push(el.content.label);
      if (el.content.alt) textParts.push(el.content.alt);
      if (el.content.columns) {
        el.content.columns.forEach((col) => traverse(col.elements));
      }
    });
  }
  traverse(state.elements);
  return {
    plainText: textParts.join("\n"),
    // Joining with newlines for context
    html: ""
    // We might not need to regenerate HTML here if we just want text for the LLM
  };
}

// src/components/layout/Header.tsx
import { Fragment, jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
var Header = ({ onSave, onLoad, onSendTestEmail, aiFeatures }) => {
  const dispatch = useDispatch();
  const editorState = useSelector((state) => state.editor);
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
  const [isPreviewOpen, setIsPreviewOpen] = React9.useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = React9.useState(false);
  const [isAiLayoutOpen, setIsAiLayoutOpen] = React9.useState(false);
  const [isSubjectLineOpen, setIsSubjectLineOpen] = React9.useState(false);
  return /* @__PURE__ */ jsxs5(Fragment, { children: [
    /* @__PURE__ */ jsxs5("header", { className: "h-16 border-b flex items-center justify-between px-6 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: [
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx9("div", { className: "h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground", children: /* @__PURE__ */ jsx9(Mail, { size: 18 }) }),
          /* @__PURE__ */ jsx9("span", { className: "font-semibold text-lg tracking-tight", children: "MailBuilder" })
        ] }),
        /* @__PURE__ */ jsx9(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
        /* @__PURE__ */ jsx9(
          Input,
          {
            type: "text",
            defaultValue: "Untitled Newsletter",
            className: "border-transparent hover:border-input focus:border-input bg-transparent w-[200px] h-9 px-2 font-medium"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs5("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx9("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs5(Button, { variant: "outline", size: "sm", onClick: () => setIsTemplatesOpen(true), children: [
          /* @__PURE__ */ jsx9(FileText2, { size: 16, className: "mr-2" }),
          "Templates"
        ] }) }),
        /* @__PURE__ */ jsx9(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center mr-2", children: [
          /* @__PURE__ */ jsx9(Button, { variant: "ghost", size: "icon", title: "Undo", onClick: handleUndo, disabled: past.length === 0, children: /* @__PURE__ */ jsx9(Undo, { size: 16, className: "text-muted-foreground" }) }),
          /* @__PURE__ */ jsx9(Button, { variant: "ghost", size: "icon", title: "Redo", onClick: handleRedo, disabled: future.length === 0, children: /* @__PURE__ */ jsx9(Redo, { size: 16, className: "text-muted-foreground" }) })
        ] }),
        /* @__PURE__ */ jsx9(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
        /* @__PURE__ */ jsxs5("div", { className: "flex items-center bg-muted rounded-lg p-1 mr-2", children: [
          /* @__PURE__ */ jsx9(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 w-7 p-0",
              onClick: () => dispatch({ type: "editor/updateCanvasSettings", payload: { width: 600 } }),
              title: "Desktop View",
              children: /* @__PURE__ */ jsx9(Monitor2, { size: 14 })
            }
          ),
          /* @__PURE__ */ jsx9(
            Button,
            {
              variant: "ghost",
              size: "sm",
              className: "h-7 w-7 p-0",
              onClick: () => dispatch({ type: "editor/updateCanvasSettings", payload: { width: 375 } }),
              title: "Mobile View",
              children: /* @__PURE__ */ jsx9(Smartphone2, { size: 14 })
            }
          )
        ] }),
        /* @__PURE__ */ jsx9(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
        /* @__PURE__ */ jsxs5(Button, { variant: "ghost", size: "sm", className: "hidden sm:flex gap-2", onClick: () => setIsPreviewOpen(true), children: [
          /* @__PURE__ */ jsx9(Eye, { size: 16 }),
          "Preview"
        ] }),
        (aiFeatures == null ? void 0 : aiFeatures.onLayoutConnect) && /* @__PURE__ */ jsxs5(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "hidden sm:flex gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50",
            onClick: () => setIsAiLayoutOpen(true),
            children: [
              /* @__PURE__ */ jsx9(Sparkles2, { size: 16 }),
              "Magic Build"
            ]
          }
        ),
        (aiFeatures == null ? void 0 : aiFeatures.onAnalyzeConnect) && /* @__PURE__ */ jsxs5(
          Button,
          {
            variant: "ghost",
            size: "sm",
            className: "hidden sm:flex gap-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50",
            onClick: () => setIsSubjectLineOpen(true),
            children: [
              /* @__PURE__ */ jsx9(Lightbulb2, { size: 16 }),
              "Analyze"
            ]
          }
        ),
        /* @__PURE__ */ jsxs5(Button, { variant: "outline", size: "sm", className: "hidden sm:flex gap-2", onClick: handleSave, children: [
          /* @__PURE__ */ jsx9(Save, { size: 16 }),
          "Save"
        ] }),
        /* @__PURE__ */ jsxs5(Button, { size: "sm", className: "gap-2", onClick: handleExport, children: [
          /* @__PURE__ */ jsx9(Download2, { size: 16 }),
          "Export"
        ] })
      ] })
    ] }),
    (aiFeatures == null ? void 0 : aiFeatures.onLayoutConnect) && /* @__PURE__ */ jsx9(
      AiLayoutModal,
      {
        isOpen: isAiLayoutOpen,
        onClose: () => setIsAiLayoutOpen(false),
        onSuccess: (newState) => {
          dispatch(loadState(newState));
          setIsAiLayoutOpen(false);
        },
        onGenerate: aiFeatures.onLayoutConnect
      }
    ),
    (aiFeatures == null ? void 0 : aiFeatures.onAnalyzeConnect) && /* @__PURE__ */ jsx9(
      SubjectLineModal,
      {
        isOpen: isSubjectLineOpen,
        onClose: () => setIsSubjectLineOpen(false),
        onAnalyze: async () => {
          const { plainText } = scrapeContent(editorState);
          const html = generateHtml(editorState);
          return aiFeatures.onAnalyzeConnect(editorState, html);
        }
      }
    ),
    /* @__PURE__ */ jsx9(
      PreviewModal,
      {
        isOpen: isPreviewOpen,
        onClose: () => setIsPreviewOpen(false),
        editorState,
        onSendTestEmail
      }
    ),
    /* @__PURE__ */ jsx9(
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
import { Type, Image, LayoutTemplate as LayoutTemplate2, MousePointerClick, Minus, Share2, Columns, RectangleHorizontal, ShoppingBag, Video, Timer, Code } from "lucide-react";

// src/components/tools/DraggableTool.tsx
import { useDrag } from "react-dnd";

// src/components/ui/card.tsx
import * as React10 from "react";
import { jsx as jsx10 } from "react/jsx-runtime";
var Card = React10.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
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
var CardHeader = React10.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "div",
    __spreadValues({
      ref,
      className: cn("flex flex-col space-y-1.5 p-6", className)
    }, props)
  );
});
CardHeader.displayName = "CardHeader";
var CardTitle = React10.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "h3",
    __spreadValues({
      ref,
      className: cn("font-semibold leading-none tracking-tight", className)
    }, props)
  );
});
CardTitle.displayName = "CardTitle";
var CardDescription = React10.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "p",
    __spreadValues({
      ref,
      className: cn("text-sm text-muted-foreground", className)
    }, props)
  );
});
CardDescription.displayName = "CardDescription";
var CardContent = React10.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10("div", __spreadValues({ ref, className: cn("p-6 pt-0", className) }, props));
});
CardContent.displayName = "CardContent";
var CardFooter = React10.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx10(
    "div",
    __spreadValues({
      ref,
      className: cn("flex items-center p-6 pt-0", className)
    }, props)
  );
});
CardFooter.displayName = "CardFooter";

// src/components/tools/DraggableTool.tsx
import { jsx as jsx11, jsxs as jsxs6 } from "react/jsx-runtime";
var DraggableTool = ({ type, label, icon: Icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ELEMENT",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  return /* @__PURE__ */ jsxs6(
    Card,
    {
      ref: drag,
      className: cn(
        "flex flex-col items-center justify-center p-4 h-24 hover:border-primary/50 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 select-none",
        isDragging && "opacity-50 ring-2 ring-primary rotate-2 scale-95"
      ),
      children: [
        /* @__PURE__ */ jsx11("div", { className: "p-2 bg-muted rounded-full mb-2 group-hover:bg-primary/10 transition-colors", children: /* @__PURE__ */ jsx11(Icon, { size: 20, className: "text-muted-foreground group-hover:text-primary" }) }),
        /* @__PURE__ */ jsx11("span", { className: "text-xs font-medium text-foreground", children: label })
      ]
    }
  );
};

// src/components/layout/ToolsPanel.tsx
import { jsx as jsx12, jsxs as jsxs7 } from "react/jsx-runtime";
var ToolsPanel = () => {
  return /* @__PURE__ */ jsxs7("aside", { className: "w-[280px] flex-shrink-0 border-r bg-background/50 flex flex-col h-full overflow-y-auto", children: [
    /* @__PURE__ */ jsxs7("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx12("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Components" }),
      /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx12(DraggableTool, { type: "text", label: "Text", icon: Type }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "image", label: "Image", icon: Image }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "product", label: "Product", icon: ShoppingBag }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "button", label: "Button", icon: MousePointerClick }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "divider", label: "Divider", icon: Minus }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "social", label: "Social", icon: Share2 }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "spacer", label: "Spacer", icon: LayoutTemplate2 }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "video", label: "Video", icon: Video }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "countdown", label: "Timer", icon: Timer }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "html", label: "HTML", icon: Code })
      ] })
    ] }),
    /* @__PURE__ */ jsx12(Separator, {}),
    /* @__PURE__ */ jsxs7("div", { className: "p-6 bg-muted/30 flex-1", children: [
      /* @__PURE__ */ jsx12("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Layouts" }),
      /* @__PURE__ */ jsxs7("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx12(DraggableTool, { type: "section", label: "Section", icon: RectangleHorizontal }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "columns", label: "2 Columns", icon: Columns }),
        /* @__PURE__ */ jsx12(DraggableTool, { type: "columns-3", label: "3 Columns", icon: Columns })
      ] })
    ] })
  ] });
};

// src/components/layout/PropertiesPanel.tsx
import React15 from "react";
import { useDispatch as useDispatch2, useSelector as useSelector2 } from "react-redux";
import { Sliders, Type as Type2, Palette, Layout, Link as LinkIcon, Image as ImageIcon3, AlignLeft, AlignCenter, AlignRight, AlignJustify, Sparkles as Sparkles5 } from "lucide-react";

// src/components/layout/SpacingControl.tsx
import { useState as useState5, useEffect as useEffect4 } from "react";
import { jsx as jsx13, jsxs as jsxs8 } from "react/jsx-runtime";
var SpacingControl = ({ label, value = "0px", onChange }) => {
  const parseSpacing = (val) => {
    const parts = val.replace(/px/g, "").split(" ").map((v) => parseInt(v) || 0);
    if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
    if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
    if (parts.length === 4) return [parts[0], parts[1], parts[2], parts[3]];
    return [0, 0, 0, 0];
  };
  const [values, setValues] = useState5(parseSpacing(value));
  useEffect4(() => {
    setValues(parseSpacing(value));
  }, [value]);
  const handleChange = (index, newVal) => {
    const numVal = parseInt(newVal) || 0;
    const newValues = [...values];
    newValues[index] = numVal;
    setValues(newValues);
    onChange(`${newValues[0]}px ${newValues[1]}px ${newValues[2]}px ${newValues[3]}px`);
  };
  return /* @__PURE__ */ jsxs8("div", { className: "grid gap-2", children: [
    /* @__PURE__ */ jsx13(Label, { children: label }),
    /* @__PURE__ */ jsxs8("div", { className: "grid grid-cols-2 gap-2", children: [
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx13("span", { className: "text-[10px] text-muted-foreground w-4", children: "T" }),
        /* @__PURE__ */ jsx13(
          Input,
          {
            className: "h-7 text-xs px-2",
            value: values[0],
            onChange: (e) => handleChange(0, e.target.value),
            type: "number"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx13("span", { className: "text-[10px] text-muted-foreground w-4", children: "R" }),
        /* @__PURE__ */ jsx13(
          Input,
          {
            className: "h-7 text-xs px-2",
            value: values[1],
            onChange: (e) => handleChange(1, e.target.value),
            type: "number"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx13("span", { className: "text-[10px] text-muted-foreground w-4", children: "B" }),
        /* @__PURE__ */ jsx13(
          Input,
          {
            className: "h-7 text-xs px-2",
            value: values[2],
            onChange: (e) => handleChange(2, e.target.value),
            type: "number"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs8("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx13("span", { className: "text-[10px] text-muted-foreground w-4", children: "L" }),
        /* @__PURE__ */ jsx13(
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
import { useState as useState6, useEffect as useEffect5, useRef } from "react";
import { X as X5, Upload, Loader2 as Loader25, Image as ImageIcon, Check as Check2 } from "lucide-react";
import { Fragment as Fragment2, jsx as jsx14, jsxs as jsxs9 } from "react/jsx-runtime";
var ImageGalleryModal = ({
  isOpen,
  onClose,
  onSelect,
  onUpload,
  fetchImages
}) => {
  const [images, setImages] = useState6([]);
  const [isLoading, setIsLoading] = useState6(false);
  const [isUploading, setIsUploading] = useState6(false);
  const fileInputRef = useRef(null);
  useEffect5(() => {
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
  return /* @__PURE__ */ jsx14("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs9("div", { className: "bg-background w-[800px] h-[600px] rounded-xl shadow-2xl flex flex-col overflow-hidden border", children: [
    /* @__PURE__ */ jsxs9("div", { className: "h-16 border-b px-6 flex items-center justify-between shrink-0", children: [
      /* @__PURE__ */ jsx14("h3", { className: "font-semibold text-lg", children: "Image Gallery" }),
      /* @__PURE__ */ jsxs9("div", { className: "flex items-center gap-2", children: [
        onUpload && /* @__PURE__ */ jsxs9(Fragment2, { children: [
          /* @__PURE__ */ jsx14(
            "input",
            {
              type: "file",
              ref: fileInputRef,
              className: "hidden",
              accept: "image/*",
              onChange: handleFileUpload
            }
          ),
          /* @__PURE__ */ jsxs9(
            Button,
            {
              onClick: () => {
                var _a;
                return (_a = fileInputRef.current) == null ? void 0 : _a.click();
              },
              disabled: isUploading,
              children: [
                isUploading ? /* @__PURE__ */ jsx14(Loader25, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx14(Upload, { className: "mr-2 h-4 w-4" }),
                "Upload New"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx14(Button, { variant: "ghost", size: "icon", onClick: onClose, children: /* @__PURE__ */ jsx14(X5, { size: 20 }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx14("div", { className: "flex-1 overflow-y-auto p-6 bg-muted/10", children: isLoading ? /* @__PURE__ */ jsx14("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsx14(Loader25, { className: "h-8 w-8 animate-spin text-muted-foreground" }) }) : images.length > 0 ? /* @__PURE__ */ jsx14("div", { className: "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4", children: images.map((url, i) => /* @__PURE__ */ jsxs9(
      "div",
      {
        className: "group relative aspect-video bg-muted rounded-lg overflow-hidden border hover:ring-2 ring-primary cursor-pointer transition-all",
        onClick: () => {
          onSelect(url);
          onClose();
        },
        children: [
          /* @__PURE__ */ jsx14("img", { src: url, alt: "", className: "w-full h-full object-cover" }),
          /* @__PURE__ */ jsx14("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100", children: /* @__PURE__ */ jsx14("div", { className: "bg-white/90 p-2 rounded-full shadow-lg", children: /* @__PURE__ */ jsx14(Check2, { size: 16, className: "text-primary" }) }) })
        ]
      },
      i
    )) }) : /* @__PURE__ */ jsxs9("div", { className: "flex flex-col items-center justify-center h-full text-muted-foreground", children: [
      /* @__PURE__ */ jsx14(ImageIcon, { size: 48, className: "mb-4 opacity-50" }),
      /* @__PURE__ */ jsx14("p", { children: "No images found" })
    ] }) })
  ] }) });
};

// src/components/ui/AiTextModal.tsx
import { useState as useState7 } from "react";
import { X as X6, Sparkles as Sparkles3, Loader2 as Loader26, Wand2 as Wand22 } from "lucide-react";
import { jsx as jsx15, jsxs as jsxs10 } from "react/jsx-runtime";
var AiTextModal = ({
  isOpen,
  onClose,
  onSuccess,
  currentText,
  onGenerate
}) => {
  const [prompt, setPrompt] = useState7("");
  const [isLoading, setIsLoading] = useState7(false);
  const [customMode, setCustomMode] = useState7(false);
  const handleGenerate = async (mode) => {
    setIsLoading(true);
    try {
      const result = await onGenerate(mode, currentText, prompt);
      onSuccess(result);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to generate text");
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx15("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs10("div", { className: "bg-background w-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden border", children: [
    /* @__PURE__ */ jsxs10("div", { className: "h-14 border-b px-4 flex items-center justify-between bg-muted/20", children: [
      /* @__PURE__ */ jsxs10("div", { className: "flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsx15(Sparkles3, { size: 18 }),
        /* @__PURE__ */ jsx15("h3", { className: "font-semibold", children: "AI Assistant" })
      ] }),
      /* @__PURE__ */ jsx15(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "h-8 w-8", children: /* @__PURE__ */ jsx15(X6, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxs10("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx15(Label, { children: "Quick Actions" }),
        /* @__PURE__ */ jsxs10("div", { className: "grid grid-cols-2 gap-2", children: [
          /* @__PURE__ */ jsxs10(Button, { variant: "outline", className: "justify-start", onClick: () => handleGenerate("fix"), disabled: isLoading, children: [
            /* @__PURE__ */ jsx15(Wand22, { size: 14, className: "mr-2" }),
            "Fix Grammar"
          ] }),
          /* @__PURE__ */ jsxs10(Button, { variant: "outline", className: "justify-start", onClick: () => handleGenerate("shorten"), disabled: isLoading, children: [
            /* @__PURE__ */ jsx15(Wand22, { size: 14, className: "mr-2" }),
            "Shorten"
          ] }),
          /* @__PURE__ */ jsxs10(Button, { variant: "outline", className: "justify-start", onClick: () => handleGenerate("expand"), disabled: isLoading, children: [
            /* @__PURE__ */ jsx15(Wand22, { size: 14, className: "mr-2" }),
            "Expand"
          ] }),
          /* @__PURE__ */ jsxs10(Button, { variant: "outline", className: "justify-start", onClick: () => handleGenerate("tone"), disabled: isLoading, children: [
            /* @__PURE__ */ jsx15(Wand22, { size: 14, className: "mr-2" }),
            "Make Professional"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "relative", children: [
        /* @__PURE__ */ jsx15("div", { className: "absolute inset-0 flex items-center", children: /* @__PURE__ */ jsx15("span", { className: "w-full border-t" }) }),
        /* @__PURE__ */ jsx15("div", { className: "relative flex justify-center text-xs uppercase", children: /* @__PURE__ */ jsx15("span", { className: "bg-background px-2 text-muted-foreground", children: "Or custom prompt" }) })
      ] }),
      /* @__PURE__ */ jsxs10("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx15(Label, { children: "Custom Instruction" }),
        /* @__PURE__ */ jsxs10("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx15(
            Input,
            {
              value: prompt,
              onChange: (e) => setPrompt(e.target.value),
              placeholder: "e.g. 'Rewrite this to be more exciting'",
              disabled: isLoading
            }
          ),
          /* @__PURE__ */ jsx15(
            Button,
            {
              onClick: () => handleGenerate("rewrite"),
              disabled: !prompt || isLoading,
              children: isLoading ? /* @__PURE__ */ jsx15(Loader26, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx15(Sparkles3, { className: "h-4 w-4" })
            }
          )
        ] })
      ] })
    ] })
  ] }) });
};

// src/components/ui/AiImageModal.tsx
import { useState as useState8 } from "react";
import { X as X7, Sparkles as Sparkles4, Loader2 as Loader27, Image as ImageIcon2 } from "lucide-react";
import { jsx as jsx16, jsxs as jsxs11 } from "react/jsx-runtime";
var AiImageModal = ({
  isOpen,
  onClose,
  onSuccess,
  onGenerate
}) => {
  const [prompt, setPrompt] = useState8("");
  const [isLoading, setIsLoading] = useState8(false);
  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const result = await onGenerate(prompt);
      onSuccess(result);
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx16("div", { className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200", children: /* @__PURE__ */ jsxs11("div", { className: "bg-background w-[500px] rounded-xl shadow-2xl flex flex-col overflow-hidden border", children: [
    /* @__PURE__ */ jsxs11("div", { className: "h-14 border-b px-4 flex items-center justify-between bg-muted/20", children: [
      /* @__PURE__ */ jsxs11("div", { className: "flex items-center gap-2 text-primary", children: [
        /* @__PURE__ */ jsx16(Sparkles4, { size: 18 }),
        /* @__PURE__ */ jsx16("h3", { className: "font-semibold", children: "AI Image Generator" })
      ] }),
      /* @__PURE__ */ jsx16(Button, { variant: "ghost", size: "icon", onClick: onClose, className: "h-8 w-8", children: /* @__PURE__ */ jsx16(X7, { size: 18 }) })
    ] }),
    /* @__PURE__ */ jsxs11("div", { className: "p-6 space-y-4", children: [
      /* @__PURE__ */ jsxs11("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsx16(Label, { children: "Describe the image" }),
        /* @__PURE__ */ jsx16("div", { className: "flex gap-2", children: /* @__PURE__ */ jsx16(
          Input,
          {
            value: prompt,
            onChange: (e) => setPrompt(e.target.value),
            placeholder: "e.g. 'A futuristic city skyline at sunset'",
            disabled: isLoading,
            onKeyDown: (e) => e.key === "Enter" && handleGenerate()
          }
        ) })
      ] }),
      /* @__PURE__ */ jsxs11("div", { className: "flex justify-end gap-2", children: [
        /* @__PURE__ */ jsx16(Button, { variant: "outline", onClick: onClose, disabled: isLoading, children: "Cancel" }),
        /* @__PURE__ */ jsxs11(Button, { onClick: handleGenerate, disabled: !prompt || isLoading, children: [
          isLoading ? /* @__PURE__ */ jsx16(Loader27, { className: "mr-2 h-4 w-4 animate-spin" }) : /* @__PURE__ */ jsx16(Sparkles4, { className: "mr-2 h-4 w-4" }),
          "Generate"
        ] })
      ] }),
      isLoading && /* @__PURE__ */ jsxs11("div", { className: "flex flex-col items-center justify-center py-6 text-muted-foreground animate-pulse", children: [
        /* @__PURE__ */ jsx16(ImageIcon2, { size: 32, className: "mb-2" }),
        /* @__PURE__ */ jsx16("p", { className: "text-sm", children: "Creating your masterpiece..." })
      ] })
    ] })
  ] }) });
};

// src/components/layout/PropertiesPanel.tsx
import { jsx as jsx17, jsxs as jsxs12 } from "react/jsx-runtime";
var ImageInput = ({ label, value, onChange, onPickImage, onGenerateImage }) => {
  return /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
    /* @__PURE__ */ jsx17(Label, { children: label }),
    /* @__PURE__ */ jsxs12("div", { className: "flex gap-2 items-center", children: [
      /* @__PURE__ */ jsx17(
        Input,
        {
          value: value || "",
          onChange: (e) => onChange(e.target.value),
          placeholder: "https://...",
          className: "flex-1"
        }
      ),
      onGenerateImage && /* @__PURE__ */ jsx17(
        Button,
        {
          variant: "ghost",
          size: "icon",
          onClick: onGenerateImage,
          title: "Generate with AI",
          className: "text-purple-600 hover:text-purple-700 hover:bg-purple-50",
          children: /* @__PURE__ */ jsx17(Sparkles5, { size: 16 })
        }
      ),
      onPickImage && /* @__PURE__ */ jsx17(
        Button,
        {
          variant: "secondary",
          size: "icon",
          onClick: onPickImage,
          title: "Select Image",
          children: /* @__PURE__ */ jsx17(ImageIcon3, { size: 16 })
        }
      )
    ] })
  ] });
};
var PropertiesPanel = ({ onUploadImage, onFetchImages, mergeTags, aiFeatures }) => {
  var _a, _b;
  const dispatch = useDispatch2();
  const { elements, selectedElementId, canvasSettings } = useSelector2((state) => state.editor);
  const [galleryCallback, setGalleryCallback] = React15.useState(null);
  const [aiTextCallback, setAiTextCallback] = React15.useState(null);
  const [aiImageCallback, setAiImageCallback] = React15.useState(null);
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
  const PropertySection = ({ title, icon: Icon, children }) => /* @__PURE__ */ jsxs12("div", { className: "border-b last:border-0 border-border", children: [
    /* @__PURE__ */ jsxs12("div", { className: "px-6 py-4 flex items-center gap-2 bg-muted/20", children: [
      Icon && /* @__PURE__ */ jsx17(Icon, { size: 14, className: "text-muted-foreground" }),
      /* @__PURE__ */ jsx17("span", { className: "text-xs font-medium text-foreground uppercase tracking-widest", children: title })
    ] }),
    /* @__PURE__ */ jsx17("div", { className: "p-6 space-y-4", children })
  ] });
  if (!selectedElement) {
    return /* @__PURE__ */ jsxs12("aside", { className: "w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto", children: [
      /* @__PURE__ */ jsxs12("div", { className: "p-6 border-b flex items-center gap-2", children: [
        /* @__PURE__ */ jsx17(Sliders, { size: 18 }),
        /* @__PURE__ */ jsx17("h2", { className: "font-semibold text-lg", children: "Settings" })
      ] }),
      /* @__PURE__ */ jsx17(PropertySection, { title: "Canvas Dimensions", icon: Layout, children: /* @__PURE__ */ jsxs12("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Width (px)" }),
          /* @__PURE__ */ jsx17(
            Input,
            {
              type: "number",
              value: canvasSettings.width,
              onChange: (e) => handleGlobalChange("width", parseInt(e.target.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsx17("p", { className: "text-[0.8rem] text-muted-foreground", children: "Standard email width is 600px." })
      ] }) }),
      /* @__PURE__ */ jsx17(PropertySection, { title: "Background", icon: Palette, children: /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx17(Label, { children: "Color" }),
        /* @__PURE__ */ jsxs12("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx17("div", { className: "relative w-10 h-10 rounded-md border overflow-hidden shadow-sm shrink-0", children: /* @__PURE__ */ jsx17(
            "input",
            {
              type: "color",
              value: canvasSettings.backgroundColor,
              onChange: (e) => handleGlobalChange("backgroundColor", e.target.value),
              className: "absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
            }
          ) }),
          /* @__PURE__ */ jsx17(
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
      /* @__PURE__ */ jsx17(PropertySection, { title: "Global Styles", icon: Type2, children: /* @__PURE__ */ jsxs12("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Font Family" }),
          /* @__PURE__ */ jsxs12(
            "select",
            {
              className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              value: canvasSettings.fontFamily,
              onChange: (e) => handleGlobalChange("fontFamily", e.target.value),
              children: [
                /* @__PURE__ */ jsxs12("optgroup", { label: "Sans Serif", children: [
                  /* @__PURE__ */ jsx17("option", { value: "Arial, sans-serif", children: "Arial" }),
                  /* @__PURE__ */ jsx17("option", { value: "'Helvetica Neue', Helvetica, sans-serif", children: "Helvetica" }),
                  /* @__PURE__ */ jsx17("option", { value: "'Open Sans', sans-serif", children: "Open Sans" }),
                  /* @__PURE__ */ jsx17("option", { value: "'Roboto', sans-serif", children: "Roboto" }),
                  /* @__PURE__ */ jsx17("option", { value: "Verdana, sans-serif", children: "Verdana" })
                ] }),
                /* @__PURE__ */ jsxs12("optgroup", { label: "Serif", children: [
                  /* @__PURE__ */ jsx17("option", { value: "'Times New Roman', Times, serif", children: "Times New Roman" }),
                  /* @__PURE__ */ jsx17("option", { value: "Georgia, serif", children: "Georgia" }),
                  /* @__PURE__ */ jsx17("option", { value: "'Merriweather', serif", children: "Merriweather" }),
                  /* @__PURE__ */ jsx17("option", { value: "'Playfair Display', serif", children: "Playfair Display" })
                ] }),
                /* @__PURE__ */ jsx17("optgroup", { label: "Monospace", children: /* @__PURE__ */ jsx17("option", { value: "'Courier New', Courier, monospace", children: "Courier New" }) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx17(Label, { children: "Text Color" }),
            /* @__PURE__ */ jsxs12("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx17("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx17(
                "input",
                {
                  type: "color",
                  value: canvasSettings.textColor || "#000000",
                  onChange: (e) => handleGlobalChange("textColor", e.target.value),
                  className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                }
              ) }),
              /* @__PURE__ */ jsx17(
                Input,
                {
                  value: canvasSettings.textColor || "#000000",
                  onChange: (e) => handleGlobalChange("textColor", e.target.value),
                  className: "h-8 font-mono text-xs"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx17(Label, { children: "Link Color" }),
            /* @__PURE__ */ jsxs12("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx17("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx17(
                "input",
                {
                  type: "color",
                  value: canvasSettings.linkColor || "#007bff",
                  onChange: (e) => handleGlobalChange("linkColor", e.target.value),
                  className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                }
              ) }),
              /* @__PURE__ */ jsx17(
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
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Line Height" }),
          /* @__PURE__ */ jsxs12("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx17(
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
            /* @__PURE__ */ jsxs12("span", { className: "text-xs text-muted-foreground w-12 text-right", children: [
              canvasSettings.lineHeight || 1.5,
              "em"
            ] })
          ] })
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs12("aside", { className: "w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto", children: [
    /* @__PURE__ */ jsxs12("div", { className: "p-6 border-b flex items-center justify-between bg-muted/10", children: [
      /* @__PURE__ */ jsx17("h2", { className: "font-semibold text-lg capitalize", children: selectedElement.type }),
      /* @__PURE__ */ jsx17("span", { className: "text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded", children: selectedElement.id.slice(0, 4) })
    ] }),
    /* @__PURE__ */ jsxs12(PropertySection, { title: "Content", icon: Type2, children: [
      selectedElement.type === "text" && /* @__PURE__ */ jsxs12("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsxs12("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx17(Label, { children: "Text Content" }),
            (aiFeatures == null ? void 0 : aiFeatures.onTextConnect) && /* @__PURE__ */ jsxs12(
              Button,
              {
                variant: "ghost",
                size: "sm",
                className: "h-6 px-2 text-xs text-purple-600 hover:text-purple-700 hover:bg-purple-50",
                onClick: () => setAiTextCallback(() => (newText) => handleContentChange("text", newText)),
                children: [
                  /* @__PURE__ */ jsx17(Sparkles5, { size: 12, className: "mr-1" }),
                  "AI Magic"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsx17(
            "textarea",
            {
              value: selectedElement.content.text || "",
              onChange: (e) => handleContentChange("text", e.target.value),
              className: "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            }
          )
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { className: "text-xs", children: "Insert Variable" }),
          /* @__PURE__ */ jsxs12(
            "select",
            {
              className: "h-8 w-full rounded-md border border-input bg-transparent px-2 text-xs",
              onChange: (e) => {
                if (!e.target.value) return;
                handleContentChange("text", (selectedElement.content.text || "") + e.target.value);
                e.target.value = "";
              },
              children: [
                /* @__PURE__ */ jsx17("option", { value: "", children: "Select variable..." }),
                (mergeTags || [
                  { value: "{{ first_name }}", label: "First Name" },
                  { value: "{{ last_name }}", label: "Last Name" },
                  { value: "{{ email }}", label: "Email Address" },
                  { value: "{{ unsubscribe_url }}", label: "Unsubscribe Link" },
                  { value: "{{ current_year }}", label: "Current Year" },
                  { value: "{{ company_name }}", label: "Company Name" }
                ]).map((tag) => /* @__PURE__ */ jsx17("option", { value: tag.value, children: tag.label }, tag.value))
              ]
            }
          )
        ] })
      ] }),
      selectedElement.type === "button" && /* @__PURE__ */ jsxs12("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Button Label" }),
          /* @__PURE__ */ jsx17(
            Input,
            {
              type: "text",
              value: selectedElement.content.label || "",
              onChange: (e) => handleContentChange("label", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Link URL" }),
          /* @__PURE__ */ jsxs12("div", { className: "relative", children: [
            /* @__PURE__ */ jsx17(LinkIcon, { size: 14, className: "absolute left-3 top-2.5 text-muted-foreground" }),
            /* @__PURE__ */ jsx17(
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
      selectedElement.type === "social" && selectedElement.content.socialLinks && /* @__PURE__ */ jsxs12("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx17(Label, { children: "Social Networks" }),
        selectedElement.content.socialLinks.map((link, index) => /* @__PURE__ */ jsxs12("div", { className: "grid gap-2 border p-3 rounded-md bg-muted/20", children: [
          /* @__PURE__ */ jsx17("span", { className: "text-xs font-semibold capitalize", children: link.network }),
          /* @__PURE__ */ jsx17(
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
      selectedElement.type === "product" && /* @__PURE__ */ jsxs12("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Product Title" }),
          /* @__PURE__ */ jsx17(
            Input,
            {
              value: selectedElement.content.text || "",
              onChange: (e) => handleContentChange("text", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx17(Label, { children: "Price" }),
            /* @__PURE__ */ jsx17(
              Input,
              {
                value: selectedElement.content.price || "",
                onChange: (e) => handleContentChange("price", e.target.value)
              }
            )
          ] }),
          /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx17(Label, { children: "Currency" }),
            /* @__PURE__ */ jsx17(
              Input,
              {
                value: selectedElement.content.currency || "$",
                onChange: (e) => handleContentChange("currency", e.target.value)
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx17(
          ImageInput,
          {
            label: "Image URL",
            value: selectedElement.content.imageUrl || "",
            onChange: (val) => handleContentChange("imageUrl", val),
            onPickImage: () => openGallery((val) => handleContentChange("imageUrl", val)),
            onGenerateImage: (aiFeatures == null ? void 0 : aiFeatures.onImageConnect) ? () => setAiImageCallback(() => (url) => handleContentChange("imageUrl", url)) : void 0
          }
        ),
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Button Label" }),
          /* @__PURE__ */ jsx17(
            Input,
            {
              value: selectedElement.content.label || "",
              onChange: (e) => handleContentChange("label", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Product URL" }),
          /* @__PURE__ */ jsx17(
            Input,
            {
              value: selectedElement.content.url || "",
              onChange: (e) => handleContentChange("url", e.target.value)
            }
          )
        ] })
      ] }),
      selectedElement.type === "image" && /* @__PURE__ */ jsxs12("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx17(
          ImageInput,
          {
            label: "Image Source",
            value: selectedElement.content.url || "",
            onChange: (val) => handleContentChange("url", val),
            onPickImage: () => openGallery((val) => handleContentChange("url", val)),
            onGenerateImage: (aiFeatures == null ? void 0 : aiFeatures.onImageConnect) ? () => setAiImageCallback(() => (url) => handleContentChange("url", url)) : void 0
          }
        ),
        /* @__PURE__ */ jsx17("div", { className: "rounded-lg border bg-muted/20 p-4 flex items-center justify-center min-h-[120px]", children: /* @__PURE__ */ jsx17(
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
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Alt Text" }),
          /* @__PURE__ */ jsx17(
            Input,
            {
              value: selectedElement.content.alt || "",
              onChange: (e) => handleContentChange("alt", e.target.value),
              placeholder: "Description for accessibility"
            }
          )
        ] })
      ] }),
      selectedElement.type === "video" && /* @__PURE__ */ jsxs12("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Video URL (YouTube/Vimeo)" }),
          /* @__PURE__ */ jsx17(
            Input,
            {
              value: selectedElement.content.url || "",
              onChange: (e) => handleContentChange("url", e.target.value),
              placeholder: "https://youtube.com/watch?v=..."
            }
          )
        ] }),
        /* @__PURE__ */ jsx17(
          ImageInput,
          {
            label: "Thumbnail URL (Optional)",
            value: selectedElement.content.thumbnailUrl || "",
            onChange: (val) => handleContentChange("thumbnailUrl", val),
            onPickImage: () => openGallery((val) => handleContentChange("thumbnailUrl", val))
          }
        ),
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Alt Text" }),
          /* @__PURE__ */ jsx17(
            Input,
            {
              value: selectedElement.content.alt || "",
              onChange: (e) => handleContentChange("alt", e.target.value)
            }
          )
        ] })
      ] }),
      selectedElement.type === "countdown" && /* @__PURE__ */ jsx17("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx17(Label, { children: "End Date & Time" }),
        /* @__PURE__ */ jsx17(
          Input,
          {
            type: "datetime-local",
            value: ((_a = selectedElement.content.endTime) == null ? void 0 : _a.slice(0, 16)) || "",
            onChange: (e) => handleContentChange("endTime", new Date(e.target.value).toISOString())
          }
        )
      ] }) }),
      selectedElement.type === "html" && /* @__PURE__ */ jsx17("div", { className: "space-y-4", children: /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx17(Label, { children: "HTML Code" }),
        /* @__PURE__ */ jsx17(
          "textarea",
          {
            className: "flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono",
            value: selectedElement.content.html || "",
            onChange: (e) => handleContentChange("html", e.target.value),
            placeholder: "<div>Your custom HTML here</div>"
          }
        ),
        /* @__PURE__ */ jsx17("p", { className: "text-xs text-muted-foreground", children: "Warning: Invalid HTML may break the layout." })
      ] }) }),
      selectedElement.type === "spacer" && /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx17(Label, { children: "Height" }),
        /* @__PURE__ */ jsx17(
          Input,
          {
            type: "text",
            value: selectedElement.style.height || "32px",
            onChange: (e) => handleStyleChange("height", e.target.value),
            placeholder: "e.g. 32px"
          }
        )
      ] }),
      selectedElement.type === "divider" && /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx17(Label, { children: "Divider Color" }),
        /* @__PURE__ */ jsxs12("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx17("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx17(
            "input",
            {
              type: "color",
              value: selectedElement.style.borderTopColor || "#eeeeee",
              onChange: (e) => handleStyleChange("borderTopColor", e.target.value),
              className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
            }
          ) }),
          /* @__PURE__ */ jsx17(
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
    /* @__PURE__ */ jsxs12(PropertySection, { title: isMobile ? "Appearance (Mobile)" : "Appearance", icon: Palette, children: [
      selectedElement.type === "section" && /* @__PURE__ */ jsxs12("div", { className: "grid gap-2 mb-4", children: [
        /* @__PURE__ */ jsx17(Label, { children: "Background Image URL" }),
        /* @__PURE__ */ jsx17(
          Input,
          {
            value: ((_b = getStyleValue("backgroundImage")) == null ? void 0 : _b.replace(/^url\(['"](.+)['"]\)$/, "$1")) || "",
            onChange: (e) => handleStyleChange("backgroundImage", e.target.value ? `url('${e.target.value}')` : ""),
            placeholder: "https://example.com/image.jpg"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs12("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Background Color" }),
          /* @__PURE__ */ jsxs12("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx17("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx17(
              "input",
              {
                type: "color",
                value: getStyleValue("backgroundColor", "#ffffff"),
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
              }
            ) }),
            /* @__PURE__ */ jsx17(
              Input,
              {
                value: getStyleValue("backgroundColor", "#ffffff"),
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "h-8 font-mono text-xs"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx17(Label, { children: "Text Color" }),
          /* @__PURE__ */ jsxs12("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx17("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx17(
              "input",
              {
                type: "color",
                value: getStyleValue("color", "#000000"),
                onChange: (e) => handleStyleChange("color", e.target.value),
                className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
              }
            ) }),
            /* @__PURE__ */ jsx17(
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
      /* @__PURE__ */ jsx17(Separator, {}),
      /* @__PURE__ */ jsx17(
        SpacingControl,
        {
          label: "Padding",
          value: getStyleValue("padding", "0px"),
          onChange: (val) => handleStyleChange("padding", val)
        }
      ),
      /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx17(Label, { children: "Alignment" }),
        /* @__PURE__ */ jsx17("div", { className: "flex bg-muted rounded-md p-1", children: ["left", "center", "right", "justify"].map((align) => /* @__PURE__ */ jsxs12(
          "button",
          {
            onClick: () => handleStyleChange("textAlign", align),
            className: cn(
              "flex-1 flex items-center justify-center py-1.5 rounded-sm text-muted-foreground transition-all hover:text-foreground",
              getStyleValue("textAlign") === align && "bg-background shadow-sm text-foreground"
            ),
            title: align.charAt(0).toUpperCase() + align.slice(1),
            children: [
              align === "left" && /* @__PURE__ */ jsx17(AlignLeft, { size: 16 }),
              align === "center" && /* @__PURE__ */ jsx17(AlignCenter, { size: 16 }),
              align === "right" && /* @__PURE__ */ jsx17(AlignRight, { size: 16 }),
              align === "justify" && /* @__PURE__ */ jsx17(AlignJustify, { size: 16 })
            ]
          },
          align
        )) })
      ] }),
      selectedElement.type === "button" && /* @__PURE__ */ jsxs12("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx17(Label, { children: "Border Radius" }),
        /* @__PURE__ */ jsx17(
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
    /* @__PURE__ */ jsx17(
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
    ),
    (aiFeatures == null ? void 0 : aiFeatures.onTextConnect) && /* @__PURE__ */ jsx17(
      AiTextModal,
      {
        isOpen: !!aiTextCallback,
        onClose: () => setAiTextCallback(null),
        onSuccess: (text) => {
          if (aiTextCallback) aiTextCallback(text);
        },
        currentText: (selectedElement == null ? void 0 : selectedElement.content.text) || "",
        onGenerate: aiFeatures.onTextConnect
      }
    ),
    (aiFeatures == null ? void 0 : aiFeatures.onImageConnect) && /* @__PURE__ */ jsx17(
      AiImageModal,
      {
        isOpen: !!aiImageCallback,
        onClose: () => setAiImageCallback(null),
        onSuccess: (url) => {
          if (aiImageCallback) aiImageCallback(url);
        },
        onGenerate: aiFeatures.onImageConnect
      }
    )
  ] });
};

// src/components/editor/Canvas.tsx
import { useDrop as useDrop3 } from "react-dnd";
import { useDispatch as useDispatch5, useSelector as useSelector4 } from "react-redux";

// src/components/editor/CanvasElement.tsx
import { useState as useState9, useEffect as useEffect6, useRef as useRef2 } from "react";
import { useDrag as useDrag2, useDrop as useDrop2 } from "react-dnd";
import { useDispatch as useDispatch4, useSelector as useSelector3 } from "react-redux";
import { Trash2, Facebook, Twitter, Instagram, Linkedin, Share2 as Share22 } from "lucide-react";

// src/components/editor/ColumnDropZone.tsx
import { useDrop } from "react-dnd";
import { useDispatch as useDispatch3 } from "react-redux";
import { jsx as jsx18 } from "react/jsx-runtime";
var ColumnDropZone = ({ parentId, columnId, elements }) => {
  const dispatch = useDispatch3();
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
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
  return /* @__PURE__ */ jsx18(
    "div",
    {
      ref: drop,
      className: `flex-1 min-h-[50px] p-2 transition-colors flex flex-col gap-2
                ${isOver ? "bg-indigo-50 border-2 border-indigo-300 border-dashed ring-2 ring-indigo-200" : "bg-transparent border border-dashed border-gray-200"}
                ${elements.length === 0 ? "items-center justify-center" : ""}
            `,
      children: elements.length === 0 ? /* @__PURE__ */ jsx18("div", { className: "text-xs text-muted-foreground pointer-events-none", children: "Drop here" }) : elements.map((el, index) => (
        // Note: We might need to pass context that this is nested if we want nested sorting later
        /* @__PURE__ */ jsx18(CanvasElement, { element: el, index }, el.id)
      ))
    }
  );
};

// src/components/editor/CanvasElement.tsx
import { jsx as jsx19, jsxs as jsxs13 } from "react/jsx-runtime";
var EditableText = ({
  initialText,
  onChange,
  style,
  isEditing,
  onToggleEdit
}) => {
  const ref = useRef2(null);
  useEffect6(() => {
    if (ref.current) {
      if (document.activeElement !== ref.current && ref.current.innerText !== initialText) {
        ref.current.innerText = initialText;
      }
    }
  }, [initialText]);
  useEffect6(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
    }
  }, [isEditing]);
  const handleInput = (e) => {
    const text = e.currentTarget.innerText;
    onChange(text);
  };
  return /* @__PURE__ */ jsx19(
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
  const dispatch = useDispatch4();
  const selectedId = useSelector3((state) => state.editor.selectedElementId);
  const isSelected = selectedId === element.id;
  const [isEditing, setIsEditing] = useState9(false);
  const ref = useRef2(null);
  const [{ handlerId }, drop] = useDrop2({
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
  const [{ isDragging }, drag] = useDrag2({
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
        return /* @__PURE__ */ jsx19(
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
        return /* @__PURE__ */ jsx19("a", { href: element.content.url, style: { display: "block", textDecoration: "none", color: "inherit" }, children: element.content.label });
      case "image":
        return /* @__PURE__ */ jsx19("img", { src: element.content.url, alt: element.content.alt, style: { maxWidth: "100%", display: "block" } });
      case "divider":
        return /* @__PURE__ */ jsx19("hr", { style: {
          borderTopWidth: element.style.borderTopWidth || "1px",
          borderTopColor: element.style.borderTopColor || "#eeeeee",
          borderTopStyle: element.style.borderTopStyle || "solid"
        } });
      case "spacer":
        return /* @__PURE__ */ jsx19("div", { style: { height: element.style.height || "32px" } });
      case "social":
        return /* @__PURE__ */ jsxs13("div", { className: "flex gap-2 justify-center", children: [
          (_a = element.content.socialLinks) == null ? void 0 : _a.map((link, i) => {
            const iconSize = 24;
            const color = element.style.color || "#374151";
            switch (link.network) {
              case "facebook":
                return /* @__PURE__ */ jsx19(Facebook, { size: iconSize, color }, i);
              case "twitter":
                return /* @__PURE__ */ jsx19(Twitter, { size: iconSize, color }, i);
              case "instagram":
                return /* @__PURE__ */ jsx19(Instagram, { size: iconSize, color }, i);
              case "linkedin":
                return /* @__PURE__ */ jsx19(Linkedin, { size: iconSize, color }, i);
              default:
                return /* @__PURE__ */ jsx19(Share22, { size: iconSize, color }, i);
            }
          }),
          (!element.content.socialLinks || element.content.socialLinks.length === 0) && /* @__PURE__ */ jsx19("span", { className: "text-slate-400 italic text-sm", children: "No social links" })
        ] });
      case "product":
        return /* @__PURE__ */ jsxs13("div", { className: "flex flex-col items-center", children: [
          /* @__PURE__ */ jsx19(
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
          /* @__PURE__ */ jsx19("h3", { style: { margin: "0 0 8px 0", fontSize: "18px", fontWeight: "bold" }, children: element.content.text }),
          /* @__PURE__ */ jsxs13("p", { style: { margin: "0 0 16px 0", fontSize: "16px", color: "#666" }, children: [
            element.content.currency,
            element.content.price
          ] }),
          /* @__PURE__ */ jsx19("span", { style: {
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
        return /* @__PURE__ */ jsxs13("div", { className: "relative group/video cursor-pointer", children: [
          /* @__PURE__ */ jsx19(
            "img",
            {
              src: element.content.thumbnailUrl,
              alt: element.content.alt,
              style: { width: "100%", display: "block", height: "auto" }
            }
          ),
          /* @__PURE__ */ jsx19("div", { className: "absolute inset-0 flex items-center justify-center bg-black/20 group-hover/video:bg-black/30 transition-colors", children: /* @__PURE__ */ jsx19("div", { className: "bg-white/90 rounded-full p-4 shadow-lg transform transition-transform group-hover/video:scale-110", children: /* @__PURE__ */ jsx19("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "currentColor", className: "text-black", children: /* @__PURE__ */ jsx19("path", { d: "M8 5v14l11-7z" }) }) }) })
        ] });
      case "countdown":
        const endTime = new Date(element.content.endTime || Date.now()).getTime();
        const now = Date.now();
        const diff = Math.max(0, endTime - now);
        const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
        const hours = Math.floor(diff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
        const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
        const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
        return /* @__PURE__ */ jsx19("div", { className: "flex justify-center gap-4 text-center", children: [
          { val: days, label: "Days" },
          { val: hours, label: "Hours" },
          { val: minutes, label: "Mins" },
          { val: seconds, label: "Secs" }
        ].map((item, i) => /* @__PURE__ */ jsxs13("div", { className: "flex flex-col min-w-[60px] p-2 rounded bg-black/10", children: [
          /* @__PURE__ */ jsx19("span", { className: "text-2xl font-bold", children: String(item.val).padStart(2, "0") }),
          /* @__PURE__ */ jsx19("span", { className: "text-xs uppercase opacity-70", children: item.label })
        ] }, i)) });
      case "html":
        return /* @__PURE__ */ jsx19("div", { dangerouslySetInnerHTML: { __html: element.content.html || "" } });
      case "columns":
      case "columns-3":
      case "section":
        return /* @__PURE__ */ jsx19("div", { className: "flex w-full h-full", style: { gap: "0" }, children: (_b = element.content.columns) == null ? void 0 : _b.map((col, i) => /* @__PURE__ */ jsx19(
          ColumnDropZone,
          {
            parentId: element.id,
            columnId: col.id,
            elements: col.elements
          },
          col.id
        )) });
        return /* @__PURE__ */ jsx19("div", { children: "Unknown Element" });
    }
  };
  const canvasSettings = useSelector3((state) => state.editor.canvasSettings);
  const isMobile = canvasSettings.width <= 480;
  const finalStyle = isMobile && element.style.mobile ? __spreadValues(__spreadValues({}, element.style), element.style.mobile) : element.style;
  return /* @__PURE__ */ jsxs13(
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
        isSelected && /* @__PURE__ */ jsx19(
          "div",
          {
            className: "absolute -top-3 -right-3 bg-white shadow-md rounded-full p-1 cursor-pointer z-50 group-hover:block",
            onClick: handleDelete,
            children: /* @__PURE__ */ jsx19(Trash2, { size: 14, className: "text-red-500" })
          }
        ),
        renderContent()
      ]
    }
  );
};

// src/components/editor/Canvas.tsx
import { jsx as jsx20, jsxs as jsxs14 } from "react/jsx-runtime";
var Canvas = () => {
  const dispatch = useDispatch5();
  const { elements, canvasSettings } = useSelector4((state) => state.editor);
  const [{ isOver }, drop] = useDrop3(() => ({
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
  return /* @__PURE__ */ jsx20(
    "main",
    {
      className: "flex-1 bg-slate-100/50 p-10 overflow-y-auto flex justify-center relative z-0",
      onClick: handleBackgroundClick,
      children: /* @__PURE__ */ jsxs14("div", { className: "flex flex-col items-center w-full max-w-[1200px] py-12", children: [
        /* @__PURE__ */ jsxs14("div", { className: "text-[10px] text-slate-400 mb-3 font-medium uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-slate-200/50 backdrop-blur-sm", children: [
          "Width: ",
          canvasSettings.width,
          "px"
        ] }),
        /* @__PURE__ */ jsx20(
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
            children: elements.length === 0 ? /* @__PURE__ */ jsx20("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxs14("div", { className: "border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center text-center max-w-sm mx-auto", children: [
              /* @__PURE__ */ jsx20("div", { className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx20("span", { className: "text-3xl text-slate-300", children: "+" }) }),
              /* @__PURE__ */ jsx20("h3", { className: "text-slate-900 font-medium mb-1", children: "Start Building" }),
              /* @__PURE__ */ jsx20("p", { className: "text-slate-500 text-sm", children: "Drag and drop elements from the left panel to begin designing your newsletter." })
            ] }) }) : /* @__PURE__ */ jsxs14("div", { className: "flex flex-col w-full h-full", children: [
              elements.map((element, index) => /* @__PURE__ */ jsx20(CanvasElement, { element, index }, element.id)),
              /* @__PURE__ */ jsx20("div", { className: "flex-1 min-h-[50px] transition-colors" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx20("div", { className: "h-20" }),
        " "
      ] })
    }
  );
};

// src/components/EmailEditor.tsx
import { jsx as jsx21, jsxs as jsxs15 } from "react/jsx-runtime";
var EmailEditor = ({ onSave, onLoad, onUploadImage, onFetchImages, onSendTestEmail, mergeTags, aiFeatures }) => {
  return /* @__PURE__ */ jsx21(Provider, { store, children: /* @__PURE__ */ jsx21(DndProvider, { backend: HTML5Backend, children: /* @__PURE__ */ jsxs15("div", { className: "flex flex-col h-full w-full overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsx21(Header, { onSave, onLoad, onSendTestEmail, aiFeatures }),
    /* @__PURE__ */ jsxs15("div", { className: "flex flex-1 overflow-hidden relative", children: [
      /* @__PURE__ */ jsx21(ToolsPanel, {}),
      /* @__PURE__ */ jsx21(Canvas, {}),
      /* @__PURE__ */ jsx21(PropertiesPanel, { onUploadImage, onFetchImages, mergeTags, aiFeatures })
    ] })
  ] }) }) });
};

// src/components/SignupFormBuilder.tsx
import { Provider as Provider2 } from "react-redux";
import { DndProvider as DndProvider2 } from "react-dnd";
import { HTML5Backend as HTML5Backend2 } from "react-dnd-html5-backend";

// src/components/form-builder/FormLayout.tsx
import { useState as useState11 } from "react";
import { useDispatch as useDispatch11 } from "react-redux";

// src/components/form-builder/StepNavigator.tsx
import React17 from "react";
import { useSelector as useSelector5, useDispatch as useDispatch6 } from "react-redux";
import { ChevronRight, Plus, X as X8 } from "lucide-react";
import { jsx as jsx22, jsxs as jsxs16 } from "react/jsx-runtime";
var StepNavigator = () => {
  const dispatch = useDispatch6();
  const { steps, currentStepId } = useSelector5((state) => state.formEditor);
  const handleAddStep = () => {
    dispatch(addStep({ name: "New Step" }));
  };
  return /* @__PURE__ */ jsxs16("div", { className: "flex items-center space-x-1", children: [
    steps.map((step, index) => /* @__PURE__ */ jsxs16(React17.Fragment, { children: [
      /* @__PURE__ */ jsxs16(
        "div",
        {
          className: cn(
            "group relative flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer border",
            currentStepId === step.id ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-transparent hover:bg-slate-100 text-slate-600"
          ),
          onClick: () => dispatch(setActiveStep(step.id)),
          children: [
            step.name,
            steps.length > 1 && /* @__PURE__ */ jsx22(
              "button",
              {
                className: "ml-2 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity",
                onClick: (e) => {
                  e.stopPropagation();
                  dispatch(removeStep(step.id));
                },
                children: /* @__PURE__ */ jsx22(X8, { size: 12 })
              }
            )
          ]
        }
      ),
      index < steps.length - 1 && /* @__PURE__ */ jsx22(ChevronRight, { size: 14, className: "text-slate-300" })
    ] }, step.id)),
    /* @__PURE__ */ jsx22(Button, { variant: "ghost", size: "sm", className: "h-7 px-2 text-slate-400 hover:text-blue-600", onClick: handleAddStep, children: /* @__PURE__ */ jsx22(Plus, { size: 14 }) })
  ] });
};
var StepNavigator_default = StepNavigator;

// src/components/form-builder/FormCanvas.tsx
import { useSelector as useSelector7, useDispatch as useDispatch8 } from "react-redux";
import { useDrop as useDrop5 } from "react-dnd";

// src/components/form-builder/FormCanvasElement.tsx
import React18, { useState as useState10, useRef as useRef3 } from "react";
import { useDrag as useDrag3, useDrop as useDrop4 } from "react-dnd";
import { useDispatch as useDispatch7, useSelector as useSelector6 } from "react-redux";
import { Trash2 as Trash22 } from "lucide-react";
import { jsx as jsx23, jsxs as jsxs17 } from "react/jsx-runtime";
var FormCanvasElement = ({ element, index }) => {
  const dispatch = useDispatch7();
  const selectedId = useSelector6((state) => state.formEditor.selectedElementId);
  const isSelected = selectedId === element.id;
  const [isEditing, setIsEditing] = useState10(false);
  const ref = useRef3(null);
  const [{ handlerId }, drop] = useDrop4({
    accept: "FORM_ELEMENT",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item, monitor) {
      if (!ref.current) return;
      const dragIndex = item.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      dispatch(moveElement2({ dragIndex, hoverIndex }));
      item.index = hoverIndex;
    }
  });
  const [{ isDragging }, drag] = useDrag3({
    type: "FORM_ELEMENT",
    item: () => ({ id: element.id, index }),
    canDrag: () => !isEditing,
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
    dispatch(selectElement2(element.id));
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(removeElement2(element.id));
  };
  const renderContent = () => {
    switch (element.type) {
      case "text":
        return /* @__PURE__ */ jsx23("div", { dangerouslySetInnerHTML: { __html: element.content.text || "" } });
      case "form-input":
        return /* @__PURE__ */ jsxs17("div", { className: "w-full", children: [
          /* @__PURE__ */ jsx23("label", { className: "block text-sm font-medium text-gray-700 mb-1 pointer-events-none", children: element.content.label }),
          /* @__PURE__ */ jsx23(
            "input",
            {
              type: element.content.inputType || "text",
              placeholder: element.content.placeholder,
              className: "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pointer-events-none",
              disabled: true
            }
          )
        ] });
      case "form-submit":
        return /* @__PURE__ */ jsx23("button", { className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded pointer-events-none", children: element.content.label });
      case "image":
        return /* @__PURE__ */ jsx23("img", { src: element.content.url, alt: "Element", className: "max-w-full h-auto" });
      case "button":
        return /* @__PURE__ */ jsx23("button", { className: "underline text-sm text-gray-600", children: element.content.label });
      case "spacer":
        return /* @__PURE__ */ jsx23("div", { style: { height: "32px" } });
      default:
        return /* @__PURE__ */ jsxs17("div", { className: "p-2 border border-dashed text-gray-400", children: [
          "Unknown Element: ",
          element.type
        ] });
    }
  };
  return /* @__PURE__ */ jsxs17(
    "div",
    {
      ref,
      onClick: handleClick,
      "data-handler-id": handlerId,
      className: `
                relative group
                ${isSelected ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300"}
                cursor-pointer transition-all
            `,
      style: __spreadValues({
        opacity: isDragging ? 0.3 : 1
      }, element.style),
      children: [
        isSelected && /* @__PURE__ */ jsx23(
          "div",
          {
            className: "absolute -top-3 -right-3 bg-white shadow-md rounded-full p-1 cursor-pointer z-50 hover:bg-red-50",
            onClick: handleDelete,
            children: /* @__PURE__ */ jsx23(Trash22, { size: 14, className: "text-red-500" })
          }
        ),
        renderContent()
      ]
    }
  );
};

// src/components/form-builder/FormCanvas.tsx
import { jsx as jsx24 } from "react/jsx-runtime";
var FormCanvas = ({ viewMode }) => {
  const dispatch = useDispatch8();
  const { formSettings, currentStepId, steps, selectedElementId } = useSelector7((state) => state.formEditor);
  const currentStep = steps.find((s) => s.id === currentStepId);
  const [{ isOver }, drop] = useDrop5(() => ({
    accept: "tool",
    drop: (item, monitor) => {
      dispatch(addElement2({ type: item.type }));
      return { name: "FormCanvas" };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));
  const containerStyle = {
    width: viewMode === "mobile" ? "320px" : `${formSettings.width}px`,
    backgroundColor: formSettings.backgroundColor,
    borderRadius: `${formSettings.borderRadius}px`,
    padding: formSettings.padding,
    fontFamily: formSettings.fontFamily
  };
  if (!currentStep) return /* @__PURE__ */ jsx24("div", { children: "No Step Selected" });
  return /* @__PURE__ */ jsx24(
    "div",
    {
      ref: drop,
      className: cn(
        "relative transition-all duration-300 shadow-xl min-h-[400px]",
        isOver ? "ring-2 ring-blue-500 ring-offset-2" : ""
      ),
      style: containerStyle,
      onClick: () => dispatch(selectElement2(null)),
      children: currentStep.elements.length === 0 ? /* @__PURE__ */ jsx24("div", { className: "flex flex-col items-center justify-center py-20 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg", children: /* @__PURE__ */ jsx24("p", { children: "Drag elements here" }) }) : /* @__PURE__ */ jsx24("div", { className: "flex flex-col space-y-4", children: currentStep.elements.map((element, index) => /* @__PURE__ */ jsx24(
        FormCanvasElement,
        {
          element,
          index
        },
        element.id
      )) })
    }
  );
};
var FormCanvas_default = FormCanvas;

// src/components/form-builder/panels/BlocksPanel.tsx
import { useDrag as useDrag4 } from "react-dnd";
import { Type as Type3, Image as ImageIcon4, MousePointerClick as MousePointerClick2, Box, FormInput } from "lucide-react";
import { jsx as jsx25, jsxs as jsxs18 } from "react/jsx-runtime";
var tools = [
  { type: "text", label: "Text", icon: Type3 },
  { type: "image", label: "Image", icon: ImageIcon4 },
  { type: "spacer", label: "Spacer", icon: Box },
  { type: "form-input", label: "Input Field", icon: FormInput },
  // New
  { type: "form-submit", label: "Submit Button", icon: MousePointerClick2 },
  // New
  { type: "button", label: "Button", icon: MousePointerClick2 }
];
var BlocksPanel = () => {
  return /* @__PURE__ */ jsx25("div", { className: "grid grid-cols-2 gap-3", children: tools.map((tool) => /* @__PURE__ */ jsx25(DraggableTool2, { tool }, tool.type)) });
};
var DraggableTool2 = ({ tool }) => {
  const [{ isDragging }, drag] = useDrag4(() => ({
    type: "tool",
    item: { type: tool.type },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));
  const Icon = tool.icon;
  return /* @__PURE__ */ jsxs18(
    "div",
    {
      ref: drag,
      className: `
                flex flex-col items-center justify-center p-4 
                bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 hover:shadow-sm
                rounded-lg cursor-grab active:cursor-grabbing transition-all
                ${isDragging ? "opacity-50" : "opacity-100"}
            `,
      children: [
        /* @__PURE__ */ jsx25("div", { className: "bg-slate-200 p-2 rounded-md mb-2 text-slate-600", children: /* @__PURE__ */ jsx25(Icon, { size: 20 }) }),
        /* @__PURE__ */ jsx25("span", { className: "text-xs font-medium text-slate-700", children: tool.label })
      ]
    }
  );
};
var BlocksPanel_default = BlocksPanel;

// src/components/form-builder/panels/StylesPanel.tsx
import { useSelector as useSelector8, useDispatch as useDispatch9 } from "react-redux";
import { jsx as jsx26, jsxs as jsxs19 } from "react/jsx-runtime";
var StylesPanel = () => {
  const dispatch = useDispatch9();
  const { formSettings } = useSelector8((state) => state.formEditor);
  const handleChange = (key, value) => {
    dispatch(updateFormSettings({ [key]: value }));
  };
  return /* @__PURE__ */ jsxs19("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs19("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx26("h3", { className: "text-sm font-semibold text-slate-900 border-b pb-2", children: "Layout" }),
      /* @__PURE__ */ jsxs19("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx26(Label, { children: "Form Width (px)" }),
        /* @__PURE__ */ jsx26(
          Input,
          {
            type: "number",
            value: formSettings.width,
            onChange: (e) => handleChange("width", parseInt(e.target.value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs19("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx26(Label, { children: "Padding" }),
        /* @__PURE__ */ jsx26(
          Input,
          {
            value: formSettings.padding,
            onChange: (e) => handleChange("padding", e.target.value)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs19("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx26("h3", { className: "text-sm font-semibold text-slate-900 border-b pb-2", children: "Appearance" }),
      /* @__PURE__ */ jsxs19("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx26(Label, { children: "Background Color" }),
        /* @__PURE__ */ jsxs19("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx26(
            "div",
            {
              className: "w-8 h-8 rounded border shadow-sm",
              style: { backgroundColor: formSettings.backgroundColor }
            }
          ),
          /* @__PURE__ */ jsx26(
            Input,
            {
              value: formSettings.backgroundColor,
              onChange: (e) => handleChange("backgroundColor", e.target.value)
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs19("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx26(Label, { children: "Border Radius (px)" }),
        /* @__PURE__ */ jsx26(
          Input,
          {
            type: "number",
            value: formSettings.borderRadius,
            onChange: (e) => handleChange("borderRadius", parseInt(e.target.value))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs19("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx26(Label, { children: "Overlay Opacity" }),
        /* @__PURE__ */ jsx26(
          Input,
          {
            type: "number",
            step: "0.1",
            min: "0",
            max: "1",
            value: formSettings.overlayOpacity,
            onChange: (e) => handleChange("overlayOpacity", parseFloat(e.target.value))
          }
        )
      ] })
    ] })
  ] });
};
var StylesPanel_default = StylesPanel;

// src/components/form-builder/panels/TargetingPanel.tsx
import { useSelector as useSelector9, useDispatch as useDispatch10 } from "react-redux";

// src/components/ui/switch.tsx
import * as React19 from "react";
import { jsx as jsx27, jsxs as jsxs20 } from "react/jsx-runtime";
var Switch = React19.forwardRef((_a, ref) => {
  var _b = _a, { className, checked, onCheckedChange } = _b, props = __objRest(_b, ["className", "checked", "onCheckedChange"]);
  return /* @__PURE__ */ jsxs20("label", { className: cn("inline-flex relative items-center cursor-pointer", className), children: [
    /* @__PURE__ */ jsx27(
      "input",
      __spreadValues({
        type: "checkbox",
        className: "sr-only peer",
        ref,
        checked,
        onChange: (e) => onCheckedChange == null ? void 0 : onCheckedChange(e.target.checked)
      }, props)
    ),
    /* @__PURE__ */ jsx27("div", { className: "w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" })
  ] });
});
Switch.displayName = "Switch";

// src/components/ui/select.tsx
import { ChevronDown as ChevronDown2 } from "lucide-react";
import { Fragment as Fragment3, jsx as jsx28, jsxs as jsxs21 } from "react/jsx-runtime";
var Select = (_a) => {
  var _b = _a, { children, value, onValueChange } = _b, props = __objRest(_b, ["children", "value", "onValueChange"]);
  return /* @__PURE__ */ jsxs21("div", { className: "relative", children: [
    /* @__PURE__ */ jsx28(
      "select",
      __spreadValues({
        className: "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
        value,
        onChange: (e) => onValueChange(e.target.value)
      }, props)
    ),
    /* @__PURE__ */ jsx28(ChevronDown2, { className: "absolute right-3 top-3 h-4 w-4 opacity-50 pointer-events-none" })
  ] });
};
var SelectTrigger = ({ children, className }) => /* @__PURE__ */ jsx28(Fragment3, { children });
var SelectValue = ({ children }) => /* @__PURE__ */ jsx28(Fragment3, { children });
var SelectContent = ({ children }) => /* @__PURE__ */ jsx28(Fragment3, { children });
var SelectItem = ({ value, children }) => /* @__PURE__ */ jsx28("option", { value, children });

// src/components/form-builder/panels/TargetingPanel.tsx
import { jsx as jsx29, jsxs as jsxs22 } from "react/jsx-runtime";
var TargetingPanel = () => {
  const dispatch = useDispatch10();
  const { behavior } = useSelector9((state) => state.formEditor);
  const updateTrigger = (key, value) => {
    dispatch(updateBehavior({
      triggerConfig: __spreadProps(__spreadValues({}, behavior.triggerConfig), { [key]: value })
    }));
  };
  return /* @__PURE__ */ jsxs22("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs22("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx29("h3", { className: "text-sm font-semibold text-slate-900 border-b pb-2", children: "Display Triggers" }),
      /* @__PURE__ */ jsxs22("div", { className: "flex items-center justify-between", children: [
        /* @__PURE__ */ jsxs22(Label, { className: "flex flex-col", children: [
          /* @__PURE__ */ jsx29("span", { children: "Exit Intent" }),
          /* @__PURE__ */ jsx29("span", { className: "text-xs text-slate-500 font-normal", children: "Show when user moves mouse to exit" })
        ] }),
        /* @__PURE__ */ jsx29(
          Switch,
          {
            checked: behavior.triggerConfig.exitIntent,
            onCheckedChange: (checked) => updateTrigger("exitIntent", checked)
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs22("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx29("h3", { className: "text-sm font-semibold text-slate-900 border-b pb-2", children: "Frequency" }),
      /* @__PURE__ */ jsxs22("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx29(Label, { children: "Show Form" }),
        /* @__PURE__ */ jsxs22(
          Select,
          {
            value: behavior.displayFrequency,
            onValueChange: (val) => dispatch(updateBehavior({ displayFrequency: val })),
            children: [
              /* @__PURE__ */ jsx29(SelectTrigger, { children: /* @__PURE__ */ jsx29(SelectValue, {}) }),
              /* @__PURE__ */ jsxs22(SelectContent, { children: [
                /* @__PURE__ */ jsx29(SelectItem, { value: "always", children: "Always" }),
                /* @__PURE__ */ jsx29(SelectItem, { value: "once_per_session", children: "Once per session" }),
                /* @__PURE__ */ jsx29(SelectItem, { value: "once_per_user", children: "Once per user" })
              ] })
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs22("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsx29("h3", { className: "text-sm font-semibold text-slate-900 border-b pb-2", children: "Devices" }),
      /* @__PURE__ */ jsxs22("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx29(Label, { children: "Target Devices" }),
        /* @__PURE__ */ jsxs22(
          Select,
          {
            value: behavior.deviceTargeting,
            onValueChange: (val) => dispatch(updateBehavior({ deviceTargeting: val })),
            children: [
              /* @__PURE__ */ jsx29(SelectTrigger, { children: /* @__PURE__ */ jsx29(SelectValue, {}) }),
              /* @__PURE__ */ jsxs22(SelectContent, { children: [
                /* @__PURE__ */ jsx29(SelectItem, { value: "all", children: "Desktop & Mobile" }),
                /* @__PURE__ */ jsx29(SelectItem, { value: "desktop", children: "Desktop Only" }),
                /* @__PURE__ */ jsx29(SelectItem, { value: "mobile", children: "Mobile Only" })
              ] })
            ]
          }
        )
      ] })
    ] })
  ] });
};
var TargetingPanel_default = TargetingPanel;

// src/components/form-builder/FormLayout.tsx
import { Eye as Eye2, Smartphone as Smartphone3 } from "lucide-react";
import { jsx as jsx30, jsxs as jsxs23 } from "react/jsx-runtime";
var FormLayout = () => {
  const dispatch = useDispatch11();
  const [activeTab, setActiveTab] = useState11("blocks");
  const [viewMode, setViewMode] = useState11("desktop");
  const handleSave = () => {
    console.log("Saving form...");
  };
  return /* @__PURE__ */ jsxs23("div", { className: "flex h-full w-full bg-slate-50 overflow-hidden", children: [
    /* @__PURE__ */ jsxs23("div", { className: "w-[320px] bg-white border-r border-slate-200 flex flex-col shrink-0", children: [
      /* @__PURE__ */ jsx30("div", { className: "h-14 border-b border-slate-200 flex items-center px-4 font-semibold text-slate-800", children: "Form Builder" }),
      /* @__PURE__ */ jsxs23("div", { className: "flex border-b border-slate-200", children: [
        /* @__PURE__ */ jsx30(
          "button",
          {
            onClick: () => setActiveTab("blocks"),
            className: cn("flex-1 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === "blocks" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"),
            children: "Blocks"
          }
        ),
        /* @__PURE__ */ jsx30(
          "button",
          {
            onClick: () => setActiveTab("styles"),
            className: cn("flex-1 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === "styles" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"),
            children: "Styles"
          }
        ),
        /* @__PURE__ */ jsx30(
          "button",
          {
            onClick: () => setActiveTab("targeting"),
            className: cn("flex-1 py-3 text-sm font-medium border-b-2 transition-colors", activeTab === "targeting" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-500 hover:text-slate-800"),
            children: "Targeting"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs23("div", { className: "flex-1 overflow-y-auto p-4 custom-scrollbar", children: [
        activeTab === "blocks" && /* @__PURE__ */ jsx30(BlocksPanel_default, {}),
        activeTab === "styles" && /* @__PURE__ */ jsx30(StylesPanel_default, {}),
        activeTab === "targeting" && /* @__PURE__ */ jsx30(TargetingPanel_default, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxs23("div", { className: "flex-1 flex flex-col relative", children: [
      /* @__PURE__ */ jsxs23("div", { className: "h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0", children: [
        /* @__PURE__ */ jsx30(StepNavigator_default, {}),
        /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-2 bg-slate-100 p-1 rounded-lg", children: [
          /* @__PURE__ */ jsx30(
            "button",
            {
              onClick: () => setViewMode("desktop"),
              className: cn("p-1.5 rounded-md transition-all", viewMode === "desktop" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900"),
              children: /* @__PURE__ */ jsx30(Eye2, { size: 18 })
            }
          ),
          /* @__PURE__ */ jsx30(
            "button",
            {
              onClick: () => setViewMode("mobile"),
              className: cn("p-1.5 rounded-md transition-all", viewMode === "mobile" ? "bg-white shadow text-slate-900" : "text-slate-500 hover:text-slate-900"),
              children: /* @__PURE__ */ jsx30(Smartphone3, { size: 18 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs23("div", { className: "flex items-center space-x-3", children: [
          /* @__PURE__ */ jsx30(Button, { variant: "outline", size: "sm", onClick: () => console.log("Exit"), children: "Exit" }),
          /* @__PURE__ */ jsx30(Button, { size: "sm", onClick: handleSave, children: "Publish" })
        ] })
      ] }),
      /* @__PURE__ */ jsx30("div", { className: "flex-1 overflow-hidden relative bg-slate-100 flex items-center justify-center p-8", children: /* @__PURE__ */ jsx30(FormCanvas_default, { viewMode }) })
    ] })
  ] });
};
var FormLayout_default = FormLayout;

// src/components/SignupFormBuilder.tsx
import { jsx as jsx31 } from "react/jsx-runtime";
var SignupFormBuilder = (props) => {
  return /* @__PURE__ */ jsx31(Provider2, { store, children: /* @__PURE__ */ jsx31(DndProvider2, { backend: HTML5Backend2, children: /* @__PURE__ */ jsx31("div", { className: "signup-form-builder-container", style: { height: "100vh", display: "flex", flexDirection: "column" }, children: /* @__PURE__ */ jsx31(FormLayout_default, {}) }) }) });
};
export {
  EmailEditor,
  SignupFormBuilder,
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
};
//# sourceMappingURL=index.mjs.map