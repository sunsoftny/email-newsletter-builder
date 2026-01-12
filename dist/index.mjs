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
        if (parent && (parent.type === "columns" || parent.type === "columns-3") && parent.content.columns) {
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
    default:
      return {};
  }
}
function getDefaultStyle(type) {
  const base = { padding: "10px", margin: "0px" };
  switch (type) {
    case "button":
      return __spreadProps(__spreadValues({}, base), { backgroundColor: "#007bff", color: "#ffffff", borderRadius: "4px", textAlign: "center", width: "auto", display: "inline-block" });
    case "image":
      return __spreadProps(__spreadValues({}, base), { width: "100%", textAlign: "center" });
    case "spacer":
      return __spreadProps(__spreadValues({}, base), { height: "32px" });
    case "divider":
      return __spreadProps(__spreadValues({}, base), { borderTopWidth: "1px", borderTopColor: "#eeeeee", borderTopStyle: "solid", paddingTop: "10px", paddingBottom: "10px" });
    default:
      return base;
  }
}
var { addElement, updateElement, removeElement, selectElement, moveElement, updateCanvasSettings, undo, redo } = editorSlice.actions;
var editorSlice_default = editorSlice.reducer;

// src/store/index.ts
var store = configureStore({
  reducer: {
    editor: editorSlice_default
  }
});

// src/components/EmailEditor.tsx
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// src/components/layout/Header.tsx
import { Undo, Redo, Eye, Save, Download, Mail } from "lucide-react";

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
function generateHtml(state) {
  const { elements, canvasSettings } = state;
  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Newsletter</title>
    <style>
        a { color: ${canvasSettings.linkColor || "#007bff"}; text-decoration: underline; }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${canvasSettings.backgroundColor}; font-family: ${canvasSettings.fontFamily}; color: ${canvasSettings.textColor || "#000000"}; line-height: ${canvasSettings.lineHeight || "1.5"};">
    <center>
        <table border="0" cellpadding="0" cellspacing="0" width="${canvasSettings.width}" style="background-color: #ffffff; margin-top: 20px; margin-bottom: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${elements.map((el) => {
    const style = Object.entries(el.style).map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => "-" + m.toLowerCase())}: ${v}`).join("; ");
    let content = "";
    switch (el.type) {
      case "text":
        content = `<div style="${style}">${el.content.text}</div>`;
        break;
      case "button":
        content = `
                            <div style="text-align: ${el.style.textAlign || "center"}; padding: ${el.style.padding || "10px"};">
                                <a href="${el.content.url}" style="display: inline-block; background-color: ${el.style.backgroundColor}; color: ${el.style.color}; padding: 12px 24px; text-decoration: none; border-radius: ${el.style.borderRadius || "4px"}; font-weight: bold;">
                                    ${el.content.label}
                                </a>
                            </div>`;
        break;
      case "image":
        content = `
                            <div style="text-align: ${el.style.textAlign || "center"}; padding: 0;">
                                <img src="${el.content.url}" alt="${el.content.alt || ""}" style="max-width: 100%; height: auto; display: block; border: 0;" />
                            </div>`;
        break;
      case "divider":
        content = `<div style="padding: ${el.style.padding || "10px 0"};">
                    <hr style="border: 0; border-top: 1px solid ${el.style.borderTopColor || "#eeeeee"};" />
                </div>`;
        break;
      case "spacer":
        content = `<div style="height: ${el.style.height || "32px"}; line-height: ${el.style.height || "32px"}; font-size: 0;">&nbsp;</div>`;
        break;
      case "social":
        content = `<div style="text-align: center; padding: 20px;">
                    ${(el.content.socialLinks || []).map(
          (link) => `<a href="${link.url}" style="display:inline-block; margin: 0 5px; color: ${el.style.color || "#374151"}; text-decoration: none;">${link.network}</a>`
        ).join("")}
                </div>`;
        break;
      case "columns":
        content = `
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="50%" valign="top" style="padding: 10px;">Column 1</td>
                            <td width="50%" valign="top" style="padding: 10px;">Column 2</td>
                        </tr>
                    </table>
                `;
        break;
      case "columns-3":
        content = `
                    <table width="100%" border="0" cellpadding="0" cellspacing="0">
                        <tr>
                            <td width="33.33%" valign="top" style="padding: 10px;">Column 1</td>
                            <td width="33.33%" valign="top" style="padding: 10px;">Column 2</td>
                            <td width="33.33%" valign="top" style="padding: 10px;">Column 3</td>
                        </tr>
                    </table>
                `;
        break;
    }
    return `<tr><td align="center">${content}</td></tr>`;
  }).join("")}
        </table>
    </center>
</body>
</html>
  `;
}

// src/components/layout/Header.tsx
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
var Header = () => {
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
  return /* @__PURE__ */ jsxs("header", { className: "h-16 border-b flex items-center justify-between px-6 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsx4("div", { className: "h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground", children: /* @__PURE__ */ jsx4(Mail, { size: 18 }) }),
        /* @__PURE__ */ jsx4("span", { className: "font-semibold text-lg tracking-tight", children: "MailBuilder" })
      ] }),
      /* @__PURE__ */ jsx4(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
      /* @__PURE__ */ jsx4(
        Input,
        {
          type: "text",
          defaultValue: "Untitled Newsletter",
          className: "border-transparent hover:border-input focus:border-input bg-transparent w-[200px] h-9 px-2 font-medium"
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center mr-2", children: [
        /* @__PURE__ */ jsx4(Button, { variant: "ghost", size: "icon", title: "Undo", onClick: handleUndo, disabled: past.length === 0, children: /* @__PURE__ */ jsx4(Undo, { size: 16, className: "text-muted-foreground" }) }),
        /* @__PURE__ */ jsx4(Button, { variant: "ghost", size: "icon", title: "Redo", onClick: handleRedo, disabled: future.length === 0, children: /* @__PURE__ */ jsx4(Redo, { size: 16, className: "text-muted-foreground" }) })
      ] }),
      /* @__PURE__ */ jsx4(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
      /* @__PURE__ */ jsxs(Button, { variant: "ghost", size: "sm", className: "hidden sm:flex gap-2", children: [
        /* @__PURE__ */ jsx4(Eye, { size: 16 }),
        "Preview"
      ] }),
      /* @__PURE__ */ jsxs(Button, { variant: "outline", size: "sm", className: "hidden sm:flex gap-2", onClick: handleSave, children: [
        /* @__PURE__ */ jsx4(Save, { size: 16 }),
        "Save"
      ] }),
      /* @__PURE__ */ jsxs(Button, { size: "sm", className: "gap-2", onClick: handleExport, children: [
        /* @__PURE__ */ jsx4(Download, { size: 16 }),
        "Export"
      ] })
    ] })
  ] });
};

// src/components/layout/ToolsPanel.tsx
import { Type, Image, LayoutTemplate, MousePointerClick, Minus, Share2, Columns } from "lucide-react";

// src/components/tools/DraggableTool.tsx
import { useDrag } from "react-dnd";

// src/components/ui/card.tsx
import * as React4 from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
var Card = React4.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx5(
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
var CardHeader = React4.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx5(
    "div",
    __spreadValues({
      ref,
      className: cn("flex flex-col space-y-1.5 p-6", className)
    }, props)
  );
});
CardHeader.displayName = "CardHeader";
var CardTitle = React4.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx5(
    "h3",
    __spreadValues({
      ref,
      className: cn("font-semibold leading-none tracking-tight", className)
    }, props)
  );
});
CardTitle.displayName = "CardTitle";
var CardDescription = React4.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx5(
    "p",
    __spreadValues({
      ref,
      className: cn("text-sm text-muted-foreground", className)
    }, props)
  );
});
CardDescription.displayName = "CardDescription";
var CardContent = React4.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx5("div", __spreadValues({ ref, className: cn("p-6 pt-0", className) }, props));
});
CardContent.displayName = "CardContent";
var CardFooter = React4.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx5(
    "div",
    __spreadValues({
      ref,
      className: cn("flex items-center p-6 pt-0", className)
    }, props)
  );
});
CardFooter.displayName = "CardFooter";

// src/components/tools/DraggableTool.tsx
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
var DraggableTool = ({ type, label, icon: Icon }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "ELEMENT",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  return /* @__PURE__ */ jsxs2(
    Card,
    {
      ref: drag,
      className: cn(
        "flex flex-col items-center justify-center p-4 h-24 hover:border-primary/50 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 select-none",
        isDragging && "opacity-50 ring-2 ring-primary rotate-2 scale-95"
      ),
      children: [
        /* @__PURE__ */ jsx6("div", { className: "p-2 bg-muted rounded-full mb-2 group-hover:bg-primary/10 transition-colors", children: /* @__PURE__ */ jsx6(Icon, { size: 20, className: "text-muted-foreground group-hover:text-primary" }) }),
        /* @__PURE__ */ jsx6("span", { className: "text-xs font-medium text-foreground", children: label })
      ]
    }
  );
};

// src/components/layout/ToolsPanel.tsx
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
var ToolsPanel = () => {
  return /* @__PURE__ */ jsxs3("aside", { className: "w-[280px] flex-shrink-0 border-r bg-background/50 flex flex-col h-full overflow-y-auto", children: [
    /* @__PURE__ */ jsxs3("div", { className: "p-6", children: [
      /* @__PURE__ */ jsx7("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Components" }),
      /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx7(DraggableTool, { type: "text", label: "Text", icon: Type }),
        /* @__PURE__ */ jsx7(DraggableTool, { type: "image", label: "Image", icon: Image }),
        /* @__PURE__ */ jsx7(DraggableTool, { type: "button", label: "Button", icon: MousePointerClick }),
        /* @__PURE__ */ jsx7(DraggableTool, { type: "divider", label: "Divider", icon: Minus }),
        /* @__PURE__ */ jsx7(DraggableTool, { type: "social", label: "Social", icon: Share2 }),
        /* @__PURE__ */ jsx7(DraggableTool, { type: "spacer", label: "Spacer", icon: LayoutTemplate })
      ] })
    ] }),
    /* @__PURE__ */ jsx7(Separator, {}),
    /* @__PURE__ */ jsxs3("div", { className: "p-6 bg-muted/30 flex-1", children: [
      /* @__PURE__ */ jsx7("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Layouts" }),
      /* @__PURE__ */ jsxs3("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsx7(DraggableTool, { type: "columns", label: "2 Columns", icon: Columns }),
        /* @__PURE__ */ jsx7(DraggableTool, { type: "columns-3", label: "3 Columns", icon: Columns })
      ] })
    ] })
  ] });
};

// src/components/layout/PropertiesPanel.tsx
import { useDispatch as useDispatch2, useSelector as useSelector2 } from "react-redux";
import { Sliders, Type as Type2, Palette, Layout, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react";

// src/components/ui/label.tsx
import * as React5 from "react";
import { cva as cva2 } from "class-variance-authority";
import { jsx as jsx8 } from "react/jsx-runtime";
var labelVariants = cva2(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label = React5.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ jsx8(
    "label",
    __spreadValues({
      ref,
      className: cn(labelVariants(), className)
    }, props)
  );
});
Label.displayName = "Label";

// src/components/layout/PropertiesPanel.tsx
import { jsx as jsx9, jsxs as jsxs4 } from "react/jsx-runtime";
var PropertiesPanel = () => {
  const dispatch = useDispatch2();
  const { elements, selectedElementId, canvasSettings } = useSelector2((state) => state.editor);
  const selectedElement = elements.find((el) => el.id === selectedElementId);
  const handleStyleChange = (key, value) => {
    if (!selectedElement) return;
    dispatch(updateElement({
      id: selectedElement.id,
      changes: {
        style: __spreadProps(__spreadValues({}, selectedElement.style), { [key]: value })
      }
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
  const PropertySection = ({ title, icon: Icon, children }) => /* @__PURE__ */ jsxs4("div", { className: "border-b last:border-0 border-border", children: [
    /* @__PURE__ */ jsxs4("div", { className: "px-6 py-4 flex items-center gap-2 bg-muted/20", children: [
      Icon && /* @__PURE__ */ jsx9(Icon, { size: 14, className: "text-muted-foreground" }),
      /* @__PURE__ */ jsx9("span", { className: "text-xs font-medium text-foreground uppercase tracking-widest", children: title })
    ] }),
    /* @__PURE__ */ jsx9("div", { className: "p-6 space-y-4", children })
  ] });
  if (!selectedElement) {
    return /* @__PURE__ */ jsxs4("aside", { className: "w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto", children: [
      /* @__PURE__ */ jsxs4("div", { className: "p-6 border-b flex items-center gap-2", children: [
        /* @__PURE__ */ jsx9(Sliders, { size: 18 }),
        /* @__PURE__ */ jsx9("h2", { className: "font-semibold text-lg", children: "Settings" })
      ] }),
      /* @__PURE__ */ jsx9(PropertySection, { title: "Canvas Dimensions", icon: Layout, children: /* @__PURE__ */ jsxs4("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx9(Label, { children: "Width (px)" }),
          /* @__PURE__ */ jsx9(
            Input,
            {
              type: "number",
              value: canvasSettings.width,
              onChange: (e) => handleGlobalChange("width", parseInt(e.target.value))
            }
          )
        ] }),
        /* @__PURE__ */ jsx9("p", { className: "text-[0.8rem] text-muted-foreground", children: "Standard email width is 600px." })
      ] }) }),
      /* @__PURE__ */ jsx9(PropertySection, { title: "Background", icon: Palette, children: /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx9(Label, { children: "Color" }),
        /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx9("div", { className: "relative w-10 h-10 rounded-md border overflow-hidden shadow-sm shrink-0", children: /* @__PURE__ */ jsx9(
            "input",
            {
              type: "color",
              value: canvasSettings.backgroundColor,
              onChange: (e) => handleGlobalChange("backgroundColor", e.target.value),
              className: "absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
            }
          ) }),
          /* @__PURE__ */ jsx9(
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
      /* @__PURE__ */ jsx9(PropertySection, { title: "Global Styles", icon: Type2, children: /* @__PURE__ */ jsxs4("div", { className: "grid gap-4", children: [
        /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx9(Label, { children: "Font Family" }),
          /* @__PURE__ */ jsxs4(
            "select",
            {
              className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              value: canvasSettings.fontFamily,
              onChange: (e) => handleGlobalChange("fontFamily", e.target.value),
              children: [
                /* @__PURE__ */ jsxs4("optgroup", { label: "Sans Serif", children: [
                  /* @__PURE__ */ jsx9("option", { value: "Arial, sans-serif", children: "Arial" }),
                  /* @__PURE__ */ jsx9("option", { value: "'Helvetica Neue', Helvetica, sans-serif", children: "Helvetica" }),
                  /* @__PURE__ */ jsx9("option", { value: "'Open Sans', sans-serif", children: "Open Sans" }),
                  /* @__PURE__ */ jsx9("option", { value: "'Roboto', sans-serif", children: "Roboto" }),
                  /* @__PURE__ */ jsx9("option", { value: "Verdana, sans-serif", children: "Verdana" })
                ] }),
                /* @__PURE__ */ jsxs4("optgroup", { label: "Serif", children: [
                  /* @__PURE__ */ jsx9("option", { value: "'Times New Roman', Times, serif", children: "Times New Roman" }),
                  /* @__PURE__ */ jsx9("option", { value: "Georgia, serif", children: "Georgia" }),
                  /* @__PURE__ */ jsx9("option", { value: "'Merriweather', serif", children: "Merriweather" }),
                  /* @__PURE__ */ jsx9("option", { value: "'Playfair Display', serif", children: "Playfair Display" })
                ] }),
                /* @__PURE__ */ jsx9("optgroup", { label: "Monospace", children: /* @__PURE__ */ jsx9("option", { value: "'Courier New', Courier, monospace", children: "Courier New" }) })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-2 gap-4", children: [
          /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx9(Label, { children: "Text Color" }),
            /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx9("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx9(
                "input",
                {
                  type: "color",
                  value: canvasSettings.textColor || "#000000",
                  onChange: (e) => handleGlobalChange("textColor", e.target.value),
                  className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                }
              ) }),
              /* @__PURE__ */ jsx9(
                Input,
                {
                  value: canvasSettings.textColor || "#000000",
                  onChange: (e) => handleGlobalChange("textColor", e.target.value),
                  className: "h-8 font-mono text-xs"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
            /* @__PURE__ */ jsx9(Label, { children: "Link Color" }),
            /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx9("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx9(
                "input",
                {
                  type: "color",
                  value: canvasSettings.linkColor || "#007bff",
                  onChange: (e) => handleGlobalChange("linkColor", e.target.value),
                  className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
                }
              ) }),
              /* @__PURE__ */ jsx9(
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
        /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx9(Label, { children: "Line Height" }),
          /* @__PURE__ */ jsxs4("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx9(
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
            /* @__PURE__ */ jsxs4("span", { className: "text-xs text-muted-foreground w-12 text-right", children: [
              canvasSettings.lineHeight || 1.5,
              "em"
            ] })
          ] })
        ] })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxs4("aside", { className: "w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto", children: [
    /* @__PURE__ */ jsxs4("div", { className: "p-6 border-b flex items-center justify-between bg-muted/10", children: [
      /* @__PURE__ */ jsx9("h2", { className: "font-semibold text-lg capitalize", children: selectedElement.type }),
      /* @__PURE__ */ jsx9("span", { className: "text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded", children: selectedElement.id.slice(0, 4) })
    ] }),
    /* @__PURE__ */ jsxs4(PropertySection, { title: "Content", icon: Type2, children: [
      selectedElement.type === "text" && /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx9(Label, { children: "Text Content" }),
        /* @__PURE__ */ jsx9(
          "textarea",
          {
            value: selectedElement.content.text || "",
            onChange: (e) => handleContentChange("text", e.target.value),
            className: "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          }
        )
      ] }),
      selectedElement.type === "button" && /* @__PURE__ */ jsxs4("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx9(Label, { children: "Button Label" }),
          /* @__PURE__ */ jsx9(
            Input,
            {
              type: "text",
              value: selectedElement.content.label || "",
              onChange: (e) => handleContentChange("label", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx9(Label, { children: "Link URL" }),
          /* @__PURE__ */ jsxs4("div", { className: "relative", children: [
            /* @__PURE__ */ jsx9(LinkIcon, { size: 14, className: "absolute left-3 top-2.5 text-muted-foreground" }),
            /* @__PURE__ */ jsx9(
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
      selectedElement.type === "social" && selectedElement.content.socialLinks && /* @__PURE__ */ jsxs4("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsx9(Label, { children: "Social Networks" }),
        selectedElement.content.socialLinks.map((link, index) => /* @__PURE__ */ jsxs4("div", { className: "grid gap-2 border p-3 rounded-md bg-muted/20", children: [
          /* @__PURE__ */ jsx9("span", { className: "text-xs font-semibold capitalize", children: link.network }),
          /* @__PURE__ */ jsx9(
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
      selectedElement.type === "image" && /* @__PURE__ */ jsxs4("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx9(Label, { children: "Image Source" }),
          /* @__PURE__ */ jsxs4("div", { className: "flex gap-2 items-center", children: [
            /* @__PURE__ */ jsxs4(
              Button,
              {
                variant: "outline",
                size: "sm",
                className: "w-full",
                onClick: () => {
                  var _a;
                  return (_a = document.getElementById("image-upload")) == null ? void 0 : _a.click();
                },
                children: [
                  /* @__PURE__ */ jsx9(ImageIcon, { size: 14, className: "mr-2" }),
                  "Upload Image"
                ]
              }
            ),
            /* @__PURE__ */ jsx9(
              "input",
              {
                id: "image-upload",
                type: "file",
                className: "hidden",
                accept: "image/*",
                onChange: (e) => {
                  var _a;
                  const file = (_a = e.target.files) == null ? void 0 : _a[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    handleContentChange("url", url);
                  }
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs4("div", { className: "relative", children: [
            /* @__PURE__ */ jsx9(LinkIcon, { size: 14, className: "absolute left-3 top-2.5 text-muted-foreground" }),
            /* @__PURE__ */ jsx9(
              Input,
              {
                type: "text",
                value: selectedElement.content.url || "",
                onChange: (e) => handleContentChange("url", e.target.value),
                className: "pl-9",
                placeholder: "Or paste URL..."
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx9("div", { className: "rounded-lg border bg-muted/20 p-4 flex items-center justify-center min-h-[120px]", children: /* @__PURE__ */ jsx9(
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
        /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx9(Label, { children: "Alt Text" }),
          /* @__PURE__ */ jsx9(
            Input,
            {
              value: selectedElement.content.alt || "",
              onChange: (e) => handleContentChange("alt", e.target.value),
              placeholder: "Description for accessibility"
            }
          )
        ] })
      ] }),
      selectedElement.type === "spacer" && /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx9(Label, { children: "Height" }),
        /* @__PURE__ */ jsx9(
          Input,
          {
            type: "text",
            value: selectedElement.style.height || "32px",
            onChange: (e) => handleStyleChange("height", e.target.value),
            placeholder: "e.g. 32px"
          }
        )
      ] }),
      selectedElement.type === "divider" && /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx9(Label, { children: "Divider Color" }),
        /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsx9("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx9(
            "input",
            {
              type: "color",
              value: selectedElement.style.borderTopColor || "#eeeeee",
              onChange: (e) => handleStyleChange("borderTopColor", e.target.value),
              className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
            }
          ) }),
          /* @__PURE__ */ jsx9(
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
    /* @__PURE__ */ jsxs4(PropertySection, { title: "Appearance", icon: Palette, children: [
      /* @__PURE__ */ jsxs4("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx9(Label, { children: "Background" }),
          /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx9("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx9(
              "input",
              {
                type: "color",
                value: selectedElement.style.backgroundColor || "#ffffff",
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
              }
            ) }),
            /* @__PURE__ */ jsx9(
              Input,
              {
                value: selectedElement.style.backgroundColor || "#ffffff",
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "h-8 font-mono text-xs"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ jsx9(Label, { children: "Text Color" }),
          /* @__PURE__ */ jsxs4("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ jsx9("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ jsx9(
              "input",
              {
                type: "color",
                value: selectedElement.style.color || "#000000",
                onChange: (e) => handleStyleChange("color", e.target.value),
                className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
              }
            ) }),
            /* @__PURE__ */ jsx9(
              Input,
              {
                value: selectedElement.style.color || "#000000",
                onChange: (e) => handleStyleChange("color", e.target.value),
                className: "h-8 font-mono text-xs"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsx9(Separator, {}),
      /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx9(Label, { children: "Padding" }),
        /* @__PURE__ */ jsx9(
          Input,
          {
            type: "text",
            value: selectedElement.style.padding || "0px",
            onChange: (e) => handleStyleChange("padding", e.target.value),
            placeholder: "e.g. 10px 20px"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx9(Label, { children: "Alignment" }),
        /* @__PURE__ */ jsx9("div", { className: "flex bg-muted rounded-md p-1", children: ["left", "center", "right", "justify"].map((align) => /* @__PURE__ */ jsxs4(
          "button",
          {
            onClick: () => handleStyleChange("textAlign", align),
            className: cn(
              "flex-1 flex items-center justify-center py-1.5 rounded-sm text-muted-foreground transition-all hover:text-foreground",
              selectedElement.style.textAlign === align && "bg-background shadow-sm text-foreground"
            ),
            title: align.charAt(0).toUpperCase() + align.slice(1),
            children: [
              align === "left" && /* @__PURE__ */ jsx9(AlignLeft, { size: 16 }),
              align === "center" && /* @__PURE__ */ jsx9(AlignCenter, { size: 16 }),
              align === "right" && /* @__PURE__ */ jsx9(AlignRight, { size: 16 }),
              align === "justify" && /* @__PURE__ */ jsx9(AlignJustify, { size: 16 })
            ]
          },
          align
        )) })
      ] }),
      selectedElement.type === "button" && /* @__PURE__ */ jsxs4("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ jsx9(Label, { children: "Border Radius" }),
        /* @__PURE__ */ jsx9(
          Input,
          {
            type: "text",
            value: selectedElement.style.borderRadius || "0px",
            onChange: (e) => handleStyleChange("borderRadius", e.target.value),
            placeholder: "e.g. 4px"
          }
        )
      ] })
    ] })
  ] });
};

// src/components/editor/Canvas.tsx
import { useDrop as useDrop3 } from "react-dnd";
import { useDispatch as useDispatch5, useSelector as useSelector4 } from "react-redux";

// src/components/editor/CanvasElement.tsx
import React6 from "react";
import { useDrag as useDrag2, useDrop as useDrop2 } from "react-dnd";
import { useDispatch as useDispatch4, useSelector as useSelector3 } from "react-redux";
import { Trash2, Facebook, Twitter, Instagram, Linkedin, Share2 as Share22 } from "lucide-react";

// src/components/editor/ColumnDropZone.tsx
import { useDrop } from "react-dnd";
import { useDispatch as useDispatch3 } from "react-redux";
import { jsx as jsx10 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx10(
    "div",
    {
      ref: drop,
      className: `flex-1 min-h-[50px] p-2 transition-colors flex flex-col gap-2
                ${isOver ? "bg-indigo-50 border-2 border-indigo-300 border-dashed ring-2 ring-indigo-200" : "bg-transparent border border-dashed border-gray-200"}
                ${elements.length === 0 ? "items-center justify-center" : ""}
            `,
      children: elements.length === 0 ? /* @__PURE__ */ jsx10("div", { className: "text-xs text-muted-foreground pointer-events-none", children: "Drop here" }) : elements.map((el, index) => (
        // Note: We might need to pass context that this is nested if we want nested sorting later
        /* @__PURE__ */ jsx10(CanvasElement, { element: el, index }, el.id)
      ))
    }
  );
};

// src/components/editor/CanvasElement.tsx
import { jsx as jsx11, jsxs as jsxs5 } from "react/jsx-runtime";
var CanvasElement = ({ element, index }) => {
  const dispatch = useDispatch4();
  const selectedId = useSelector3((state) => state.editor.selectedElementId);
  const isSelected = selectedId === element.id;
  const ref = React6.useRef(null);
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
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  drag(drop(ref));
  const handleClick = (e) => {
    e.stopPropagation();
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
        return /* @__PURE__ */ jsx11("p", { style: { fontSize: "inherit", color: "inherit" }, children: element.content.text });
      case "button":
        return /* @__PURE__ */ jsx11("a", { href: element.content.url, style: { display: "block", textDecoration: "none", color: "inherit" }, children: element.content.label });
      case "image":
        return /* @__PURE__ */ jsx11("img", { src: element.content.url, alt: element.content.alt, style: { maxWidth: "100%", display: "block" } });
      case "divider":
        return /* @__PURE__ */ jsx11("hr", { style: {
          borderTopWidth: element.style.borderTopWidth || "1px",
          borderTopColor: element.style.borderTopColor || "#eeeeee",
          borderTopStyle: element.style.borderTopStyle || "solid"
        } });
      case "spacer":
        return /* @__PURE__ */ jsx11("div", { style: { height: element.style.height || "32px" } });
      case "social":
        return /* @__PURE__ */ jsxs5("div", { className: "flex gap-2 justify-center", children: [
          (_a = element.content.socialLinks) == null ? void 0 : _a.map((link, i) => {
            const iconSize = 24;
            const color = element.style.color || "#374151";
            switch (link.network) {
              case "facebook":
                return /* @__PURE__ */ jsx11(Facebook, { size: iconSize, color }, i);
              case "twitter":
                return /* @__PURE__ */ jsx11(Twitter, { size: iconSize, color }, i);
              case "instagram":
                return /* @__PURE__ */ jsx11(Instagram, { size: iconSize, color }, i);
              case "linkedin":
                return /* @__PURE__ */ jsx11(Linkedin, { size: iconSize, color }, i);
              default:
                return /* @__PURE__ */ jsx11(Share22, { size: iconSize, color }, i);
            }
          }),
          (!element.content.socialLinks || element.content.socialLinks.length === 0) && /* @__PURE__ */ jsx11("span", { className: "text-slate-400 italic text-sm", children: "No social links" })
        ] });
      case "columns":
      case "columns-3":
        return /* @__PURE__ */ jsx11("div", { className: "flex w-full", style: { gap: "0" }, children: (_b = element.content.columns) == null ? void 0 : _b.map((col, i) => /* @__PURE__ */ jsx11(
          ColumnDropZone,
          {
            parentId: element.id,
            columnId: col.id,
            elements: col.elements
          },
          col.id
        )) });
        return /* @__PURE__ */ jsx11("div", { children: "Unknown Element" });
    }
  };
  return /* @__PURE__ */ jsxs5(
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
      }, element.style),
      children: [
        isSelected && /* @__PURE__ */ jsx11(
          "div",
          {
            className: "absolute -top-3 -right-3 bg-white shadow-md rounded-full p-1 cursor-pointer z-50 group-hover:block",
            onClick: handleDelete,
            children: /* @__PURE__ */ jsx11(Trash2, { size: 14, className: "text-red-500" })
          }
        ),
        renderContent()
      ]
    }
  );
};

// src/components/editor/Canvas.tsx
import { jsx as jsx12, jsxs as jsxs6 } from "react/jsx-runtime";
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
  return /* @__PURE__ */ jsx12(
    "main",
    {
      className: "flex-1 bg-slate-100/50 p-10 overflow-y-auto flex justify-center relative z-0",
      onClick: handleBackgroundClick,
      children: /* @__PURE__ */ jsxs6("div", { className: "flex flex-col items-center w-full max-w-[1200px] py-12", children: [
        /* @__PURE__ */ jsxs6("div", { className: "text-[10px] text-slate-400 mb-3 font-medium uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-slate-200/50 backdrop-blur-sm", children: [
          "Width: ",
          canvasSettings.width,
          "px"
        ] }),
        /* @__PURE__ */ jsx12(
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
            children: elements.length === 0 ? /* @__PURE__ */ jsx12("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: /* @__PURE__ */ jsxs6("div", { className: "border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center text-center max-w-sm mx-auto", children: [
              /* @__PURE__ */ jsx12("div", { className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ jsx12("span", { className: "text-3xl text-slate-300", children: "+" }) }),
              /* @__PURE__ */ jsx12("h3", { className: "text-slate-900 font-medium mb-1", children: "Start Building" }),
              /* @__PURE__ */ jsx12("p", { className: "text-slate-500 text-sm", children: "Drag and drop elements from the left panel to begin designing your newsletter." })
            ] }) }) : /* @__PURE__ */ jsxs6("div", { className: "flex flex-col w-full h-full", children: [
              elements.map((element, index) => /* @__PURE__ */ jsx12(CanvasElement, { element, index }, element.id)),
              /* @__PURE__ */ jsx12("div", { className: "flex-1 min-h-[50px] transition-colors" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx12("div", { className: "h-20" }),
        " "
      ] })
    }
  );
};

// src/components/EmailEditor.tsx
import { jsx as jsx13, jsxs as jsxs7 } from "react/jsx-runtime";
var EmailEditor = () => {
  return /* @__PURE__ */ jsx13(Provider, { store, children: /* @__PURE__ */ jsx13(DndProvider, { backend: HTML5Backend, children: /* @__PURE__ */ jsxs7("div", { className: "flex flex-col h-full w-full overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ jsx13(Header, {}),
    /* @__PURE__ */ jsxs7("div", { className: "flex flex-1 overflow-hidden relative", children: [
      /* @__PURE__ */ jsx13(ToolsPanel, {}),
      /* @__PURE__ */ jsx13(Canvas, {}),
      /* @__PURE__ */ jsx13(PropertiesPanel, {})
    ] })
  ] }) }) });
};
export {
  EmailEditor,
  addElement,
  cn,
  generateHtml,
  moveElement,
  redo,
  removeElement,
  selectElement,
  undo,
  updateCanvasSettings,
  updateElement
};
//# sourceMappingURL=index.mjs.map