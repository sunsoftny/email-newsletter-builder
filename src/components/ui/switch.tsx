"use client";

import * as React from "react";


import { cn } from "@/lib/utils";

// Assuming Radix UI is installed as it's common with Shadcn. 
// If not, I will make a simple HTML fallback. 
// Given the other components, it's likely Radix or similar.
// For safety in this "package" context where I can't easily install deps, I'll use a pure React/Tailwind implementation without Radix if I'm not sure.
// But `package.json` had no radix deps listed in the first `view_file` of package.json?
// Let me double check package.json dependencies. I saw `lucide-react`, `class-variance-authority`, `clsx`, `tailwind-merge`.
// I did NOT see `@radix-ui/react-switch` in the `package.json` I read earlier (Step 8).
// So I MUST build a custom one or just a simple input checkbox styled as a switch.
// I'll build a simple custom one.

const Switch = React.forwardRef<
    HTMLInputElement,
    React.InputHTMLAttributes<HTMLInputElement> & { onCheckedChange?: (checked: boolean) => void }
>(({ className, checked, onCheckedChange, ...props }, ref) => (
    <label className={cn("inline-flex relative items-center cursor-pointer", className)}>
        <input
            type="checkbox"
            className="sr-only peer"
            ref={ref}
            checked={checked}
            onChange={(e) => onCheckedChange?.(e.target.checked)}
            {...props}
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
));
Switch.displayName = "Switch";

export { Switch };
