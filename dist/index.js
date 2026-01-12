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
  editorSlice: () => editorSlice,
  generateHtml: () => generateHtml,
  moveElement: () => moveElement,
  removeElement: () => removeElement,
  selectElement: () => selectElement,
  updateCanvasSettings: () => updateCanvasSettings,
  updateElement: () => updateElement
});
module.exports = __toCommonJS(index_exports);

// src/components/EmailEditor.tsx
var import_react_redux5 = require("react-redux");

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
    fontFamily: "Arial, sans-serif"
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
    addElement: (state, action) => {
      const newElement = {
        id: (0, import_uuid.v4)(),
        type: action.payload.type,
        content: getDefaultContent(action.payload.type),
        style: getDefaultStyle(action.payload.type)
      };
      if (action.payload.index !== void 0 && action.payload.index >= 0) {
        state.elements.splice(action.payload.index, 0, newElement);
      } else {
        state.elements.push(newElement);
      }
      state.selectedElementId = newElement.id;
    },
    updateElement: (state, action) => {
      const index = state.elements.findIndex((el) => el.id === action.payload.id);
      if (index !== -1) {
        state.elements[index] = __spreadValues(__spreadValues({}, state.elements[index]), action.payload.changes);
      }
    },
    removeElement: (state, action) => {
      state.elements = state.elements.filter((el) => el.id !== action.payload);
      if (state.selectedElementId === action.payload) {
        state.selectedElementId = null;
      }
    },
    selectElement: (state, action) => {
      state.selectedElementId = action.payload;
    },
    moveElement: (state, action) => {
      const { dragIndex, hoverIndex } = action.payload;
      const dragElement = state.elements[dragIndex];
      state.elements.splice(dragIndex, 1);
      state.elements.splice(hoverIndex, 0, dragElement);
    },
    updateCanvasSettings: (state, action) => {
      state.canvasSettings = __spreadValues(__spreadValues({}, state.canvasSettings), action.payload);
    }
  }
});
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
      return { items: [] };
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
    default:
      return base;
  }
}
var { addElement, updateElement, removeElement, selectElement, moveElement, updateCanvasSettings } = editorSlice.actions;
var editorSlice_default = editorSlice.reducer;

// src/store/index.ts
var store = (0, import_toolkit2.configureStore)({
  reducer: {
    editor: editorSlice_default
  }
});

// src/components/EmailEditor.tsx
var import_react_dnd4 = require("react-dnd");
var import_react_dnd_html5_backend = require("react-dnd-html5-backend");

// src/components/layout/Header.tsx
var import_lucide_react = require("lucide-react");

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
function generateHtml(state) {
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
        content = `<div style="padding: 10px 0;"><hr style="border: 0; border-top: 1px solid #eeeeee;" /></div>`;
        break;
      case "spacer":
        content = `<div style="height: 32px;">&nbsp;</div>`;
        break;
      case "social":
        content = `<div style="text-align: center; padding: 20px;">Social Links Placeholder</div>`;
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
var import_jsx_runtime4 = require("react/jsx-runtime");
var Header = () => {
  const editorState = (0, import_react_redux.useSelector)((state) => state.editor);
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
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("header", { className: "h-16 border-b flex items-center justify-between px-6 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", children: [
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("div", { className: "h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Mail, { size: 18 }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)("span", { className: "font-semibold text-lg tracking-tight", children: "MailBuilder" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
        Input,
        {
          type: "text",
          defaultValue: "Untitled Newsletter",
          className: "border-transparent hover:border-input focus:border-input bg-transparent w-[200px] h-9 px-2 font-medium"
        }
      )
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)("div", { className: "flex items-center mr-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Button, { variant: "ghost", size: "icon", title: "Undo", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Undo, { size: 16, className: "text-muted-foreground" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Button, { variant: "ghost", size: "icon", title: "Redo", children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Redo, { size: 16, className: "text-muted-foreground" }) })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(Separator, { orientation: "vertical", className: "h-6 mx-2" }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Button, { variant: "ghost", size: "sm", className: "hidden sm:flex gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Eye, { size: 16 }),
        "Preview"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Button, { variant: "outline", size: "sm", className: "hidden sm:flex gap-2", onClick: handleSave, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Save, { size: 16 }),
        "Save"
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime4.jsxs)(Button, { size: "sm", className: "gap-2", onClick: handleExport, children: [
        /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(import_lucide_react.Download, { size: 16 }),
        "Export"
      ] })
    ] })
  ] });
};

// src/components/layout/ToolsPanel.tsx
var import_lucide_react2 = require("lucide-react");

// src/components/tools/DraggableTool.tsx
var import_react_dnd = require("react-dnd");

// src/components/ui/card.tsx
var React4 = __toESM(require("react"));
var import_jsx_runtime5 = require("react/jsx-runtime");
var Card = React4.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", __spreadValues({ ref, className: cn("p-6 pt-0", className) }, props));
});
CardContent.displayName = "CardContent";
var CardFooter = React4.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)(
    "div",
    __spreadValues({
      ref,
      className: cn("flex items-center p-6 pt-0", className)
    }, props)
  );
});
CardFooter.displayName = "CardFooter";

// src/components/tools/DraggableTool.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
var DraggableTool = ({ type, label, icon: Icon }) => {
  const [{ isDragging }, drag] = (0, import_react_dnd.useDrag)(() => ({
    type: "ELEMENT",
    item: { type },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }));
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    Card,
    {
      ref: drag,
      className: cn(
        "flex flex-col items-center justify-center p-4 h-24 hover:border-primary/50 hover:shadow-md cursor-grab active:cursor-grabbing transition-all duration-200 select-none",
        isDragging && "opacity-50 ring-2 ring-primary rotate-2 scale-95"
      ),
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("div", { className: "p-2 bg-muted rounded-full mb-2 group-hover:bg-primary/10 transition-colors", children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(Icon, { size: 20, className: "text-muted-foreground group-hover:text-primary" }) }),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("span", { className: "text-xs font-medium text-foreground", children: label })
      ]
    }
  );
};

// src/components/layout/ToolsPanel.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
var ToolsPanel = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("aside", { className: "w-[280px] flex-shrink-0 border-r bg-background/50 flex flex-col h-full overflow-y-auto", children: [
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-6", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Components" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DraggableTool, { type: "text", label: "Text", icon: import_lucide_react2.Type }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DraggableTool, { type: "image", label: "Image", icon: import_lucide_react2.Image }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DraggableTool, { type: "button", label: "Button", icon: import_lucide_react2.MousePointerClick }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DraggableTool, { type: "divider", label: "Divider", icon: import_lucide_react2.Minus }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DraggableTool, { type: "social", label: "Social", icon: import_lucide_react2.Share2 }),
        /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(DraggableTool, { type: "spacer", label: "Spacer", icon: import_lucide_react2.LayoutTemplate })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(Separator, {}),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { className: "p-6 bg-muted/30 flex-1", children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("h3", { className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4", children: "Layouts" }),
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("p", { className: "text-sm text-muted-foreground italic", children: "Advanced layouts coming soon." })
    ] })
  ] });
};

// src/components/layout/PropertiesPanel.tsx
var import_react_redux2 = require("react-redux");
var import_lucide_react3 = require("lucide-react");

// src/components/ui/label.tsx
var React5 = __toESM(require("react"));
var import_class_variance_authority2 = require("class-variance-authority");
var import_jsx_runtime8 = require("react/jsx-runtime");
var labelVariants = (0, import_class_variance_authority2.cva)(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);
var Label = React5.forwardRef((_a, ref) => {
  var _b = _a, { className } = _b, props = __objRest(_b, ["className"]);
  return /* @__PURE__ */ (0, import_jsx_runtime8.jsx)(
    "label",
    __spreadValues({
      ref,
      className: cn(labelVariants(), className)
    }, props)
  );
});
Label.displayName = "Label";

// src/components/layout/PropertiesPanel.tsx
var import_jsx_runtime9 = require("react/jsx-runtime");
var PropertiesPanel = () => {
  const dispatch = (0, import_react_redux2.useDispatch)();
  const { elements, selectedElementId, canvasSettings } = (0, import_react_redux2.useSelector)((state) => state.editor);
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
  const PropertySection = ({ title, icon: Icon, children }) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "border-b last:border-0 border-border", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "px-6 py-4 flex items-center gap-2 bg-muted/20", children: [
      Icon && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Icon, { size: 14, className: "text-muted-foreground" }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs font-medium text-foreground uppercase tracking-widest", children: title })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "p-6 space-y-4", children })
  ] });
  if (!selectedElement) {
    return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("aside", { className: "w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "p-6 border-b flex items-center gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.Sliders, { size: 18 }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { className: "font-semibold text-lg", children: "Settings" })
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PropertySection, { title: "Canvas Dimensions", icon: import_lucide_react3.Layout, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-3", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Width (px)" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Input,
            {
              type: "number",
              value: canvasSettings.width,
              onChange: (e) => handleGlobalChange("width", parseInt(e.target.value))
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("p", { className: "text-[0.8rem] text-muted-foreground", children: "Standard email width is 600px." })
      ] }) }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PropertySection, { title: "Background", icon: import_lucide_react3.Palette, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Color" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "relative w-10 h-10 rounded-md border overflow-hidden shadow-sm shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            "input",
            {
              type: "color",
              value: canvasSettings.backgroundColor,
              onChange: (e) => handleGlobalChange("backgroundColor", e.target.value),
              className: "absolute -top-2 -left-2 w-16 h-16 p-0 border-0 cursor-pointer"
            }
          ) }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(PropertySection, { title: "Typography", icon: import_lucide_react3.Type, children: /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Default Font Family" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "select",
          {
            className: "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
            value: canvasSettings.fontFamily,
            onChange: (e) => handleGlobalChange("fontFamily", e.target.value),
            children: [
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "Arial, sans-serif", children: "Arial" }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "'Helvetica Neue', Helvetica, sans-serif", children: "Helvetica" }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "'Times New Roman', Times, serif", children: "Times New Roman" }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "'Courier New', Courier, monospace", children: "Courier New" }),
              /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("option", { value: "Georgia, serif", children: "Georgia" })
            ]
          }
        )
      ] }) })
    ] });
  }
  return /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("aside", { className: "w-[320px] flex-shrink-0 border-l bg-background flex flex-col h-full overflow-y-auto", children: [
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "p-6 border-b flex items-center justify-between bg-muted/10", children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("h2", { className: "font-semibold text-lg capitalize", children: selectedElement.type }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("span", { className: "text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded", children: selectedElement.id.slice(0, 4) })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(PropertySection, { title: "Content", icon: import_lucide_react3.Type, children: [
      selectedElement.type === "text" && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Text Content" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          "textarea",
          {
            value: selectedElement.content.text || "",
            onChange: (e) => handleContentChange("text", e.target.value),
            className: "flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          }
        )
      ] }),
      selectedElement.type === "button" && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Button Label" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Input,
            {
              type: "text",
              value: selectedElement.content.label || "",
              onChange: (e) => handleContentChange("label", e.target.value)
            }
          )
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Link URL" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "relative", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.Link, { size: 14, className: "absolute left-3 top-2.5 text-muted-foreground" }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      selectedElement.type === "image" && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "space-y-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Image Source URL" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "relative", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.Image, { size: 14, className: "absolute left-3 top-2.5 text-muted-foreground" }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Input,
              {
                type: "text",
                value: selectedElement.content.url || "",
                onChange: (e) => handleContentChange("url", e.target.value),
                className: "pl-9"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "rounded-lg border bg-muted/20 p-4 flex items-center justify-center min-h-[120px]", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Alt Text" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
            Input,
            {
              value: selectedElement.content.alt || "",
              onChange: (e) => handleContentChange("alt", e.target.value),
              placeholder: "Description for accessibility"
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(PropertySection, { title: "Appearance", icon: import_lucide_react3.Palette, children: [
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Background" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "input",
              {
                type: "color",
                value: selectedElement.style.backgroundColor || "#ffffff",
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              Input,
              {
                value: selectedElement.style.backgroundColor || "#ffffff",
                onChange: (e) => handleStyleChange("backgroundColor", e.target.value),
                className: "h-8 font-mono text-xs"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
          /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Text Color" }),
          /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "flex gap-2", children: [
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "relative w-8 h-8 rounded border overflow-hidden shrink-0", children: /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
              "input",
              {
                type: "color",
                value: selectedElement.style.color || "#000000",
                onChange: (e) => handleStyleChange("color", e.target.value),
                className: "absolute -top-4 -left-4 w-16 h-16 cursor-pointer"
              }
            ) }),
            /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
      /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Separator, {}),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Padding" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
          Input,
          {
            type: "text",
            value: selectedElement.style.padding || "0px",
            onChange: (e) => handleStyleChange("padding", e.target.value),
            placeholder: "e.g. 10px 20px"
          }
        )
      ] }),
      /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Alignment" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)("div", { className: "flex bg-muted rounded-md p-1", children: ["left", "center", "right", "justify"].map((align) => /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)(
          "button",
          {
            onClick: () => handleStyleChange("textAlign", align),
            className: cn(
              "flex-1 flex items-center justify-center py-1.5 rounded-sm text-muted-foreground transition-all hover:text-foreground",
              selectedElement.style.textAlign === align && "bg-background shadow-sm text-foreground"
            ),
            title: align.charAt(0).toUpperCase() + align.slice(1),
            children: [
              align === "left" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.AlignLeft, { size: 16 }),
              align === "center" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.AlignCenter, { size: 16 }),
              align === "right" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.AlignRight, { size: 16 }),
              align === "justify" && /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(import_lucide_react3.AlignJustify, { size: 16 })
            ]
          },
          align
        )) })
      ] }),
      selectedElement.type === "button" && /* @__PURE__ */ (0, import_jsx_runtime9.jsxs)("div", { className: "grid gap-2", children: [
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(Label, { children: "Border Radius" }),
        /* @__PURE__ */ (0, import_jsx_runtime9.jsx)(
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
var import_react_dnd3 = require("react-dnd");
var import_react_redux4 = require("react-redux");

// src/components/editor/CanvasElement.tsx
var import_react = __toESM(require("react"));
var import_react_dnd2 = require("react-dnd");
var import_react_redux3 = require("react-redux");
var import_lucide_react4 = require("lucide-react");
var import_jsx_runtime10 = require("react/jsx-runtime");
var CanvasElement = ({ element, index }) => {
  const dispatch = (0, import_react_redux3.useDispatch)();
  const selectedId = (0, import_react_redux3.useSelector)((state) => state.editor.selectedElementId);
  const isSelected = selectedId === element.id;
  const ref = import_react.default.useRef(null);
  const [{ handlerId }, drop] = (0, import_react_dnd2.useDrop)({
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
  const [{ isDragging }, drag] = (0, import_react_dnd2.useDrag)({
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
    switch (element.type) {
      case "text":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("p", { style: { fontSize: "inherit", color: "inherit" }, children: element.content.text });
      case "button":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("a", { href: element.content.url, style: { display: "block", textDecoration: "none", color: "inherit" }, children: element.content.label });
      case "image":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("img", { src: element.content.url, alt: element.content.alt, style: { maxWidth: "100%", display: "block" } });
      case "divider":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("hr", { style: { borderTop: "1px solid #ccc" } });
      case "social":
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { children: "Social Icons" });
      default:
        return /* @__PURE__ */ (0, import_jsx_runtime10.jsx)("div", { children: "Unknown Element" });
    }
  };
  return /* @__PURE__ */ (0, import_jsx_runtime10.jsxs)(
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
        isSelected && /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(
          "div",
          {
            className: "absolute -top-3 -right-3 bg-white shadow-md rounded-full p-1 cursor-pointer z-50 group-hover:block",
            onClick: handleDelete,
            children: /* @__PURE__ */ (0, import_jsx_runtime10.jsx)(import_lucide_react4.Trash2, { size: 14, className: "text-red-500" })
          }
        ),
        renderContent()
      ]
    }
  );
};

// src/components/editor/Canvas.tsx
var import_jsx_runtime11 = require("react/jsx-runtime");
var Canvas = () => {
  const dispatch = (0, import_react_redux4.useDispatch)();
  const { elements, canvasSettings } = (0, import_react_redux4.useSelector)((state) => state.editor);
  const [{ isOver }, drop] = (0, import_react_dnd3.useDrop)(() => ({
    accept: "ELEMENT",
    drop: (item) => {
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
  return /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
    "main",
    {
      className: "flex-1 bg-slate-100/50 p-10 overflow-y-auto flex justify-center relative z-0",
      onClick: handleBackgroundClick,
      children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex flex-col items-center w-full max-w-[1200px] py-12", children: [
        /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "text-[10px] text-slate-400 mb-3 font-medium uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-slate-200/50 backdrop-blur-sm", children: [
          "Width: ",
          canvasSettings.width,
          "px"
        ] }),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(
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
              maxWidth: "100%"
            },
            onClick: (e) => e.stopPropagation(),
            children: elements.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "absolute inset-0 flex flex-col items-center justify-center pointer-events-none", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "border-2 border-dashed border-slate-200 rounded-xl p-12 flex flex-col items-center text-center max-w-sm mx-auto", children: [
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4", children: /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("span", { className: "text-3xl text-slate-300", children: "+" }) }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("h3", { className: "text-slate-900 font-medium mb-1", children: "Start Building" }),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("p", { className: "text-slate-500 text-sm", children: "Drag and drop elements from the left panel to begin designing your newsletter." })
            ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime11.jsxs)("div", { className: "flex flex-col w-full h-full", children: [
              elements.map((element, index) => /* @__PURE__ */ (0, import_jsx_runtime11.jsx)(CanvasElement, { element, index }, element.id)),
              /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "flex-1 min-h-[50px] transition-colors" })
            ] })
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime11.jsx)("div", { className: "h-20" }),
        " "
      ] })
    }
  );
};

// src/components/EmailEditor.tsx
var import_jsx_runtime12 = require("react/jsx-runtime");
var EmailEditor = () => {
  return /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react_redux5.Provider, { store, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(import_react_dnd4.DndProvider, { backend: import_react_dnd_html5_backend.HTML5Backend, children: /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-col h-full w-full overflow-hidden bg-background text-foreground", children: [
    /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Header, {}),
    /* @__PURE__ */ (0, import_jsx_runtime12.jsxs)("div", { className: "flex flex-1 overflow-hidden relative", children: [
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(ToolsPanel, {}),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(Canvas, {}),
      /* @__PURE__ */ (0, import_jsx_runtime12.jsx)(PropertiesPanel, {})
    ] })
  ] }) }) });
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  EmailEditor,
  addElement,
  cn,
  editorSlice,
  generateHtml,
  moveElement,
  removeElement,
  selectElement,
  updateCanvasSettings,
  updateElement
});
//# sourceMappingURL=index.js.map