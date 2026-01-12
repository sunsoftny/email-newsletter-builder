'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SpacingControlProps {
    label: string;
    value: string; // CSS string like "10px" or "10px 20px 10px 20px"
    onChange: (value: string) => void;
}

export const SpacingControl: React.FC<SpacingControlProps> = ({ label, value = "0px", onChange }) => {
    // Parse CSS string into [top, right, bottom, left]
    const parseSpacing = (val: string) => {
        const parts = val.replace(/px/g, '').split(' ').map(v => parseInt(v) || 0);
        if (parts.length === 1) return [parts[0], parts[0], parts[0], parts[0]];
        if (parts.length === 2) return [parts[0], parts[1], parts[0], parts[1]];
        if (parts.length === 4) return [parts[0], parts[1], parts[2], parts[3]];
        return [0, 0, 0, 0];
    };

    const [values, setValues] = useState<number[]>(parseSpacing(value));

    // Update local state if prop changes remotely (e.g. undo)
    useEffect(() => {
        setValues(parseSpacing(value));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (index: number, newVal: string) => {
        const numVal = parseInt(newVal) || 0;
        const newValues = [...values];
        newValues[index] = numVal;
        setValues(newValues);

        // CSS Shorthand: Top Right Bottom Left
        onChange(`${newValues[0]}px ${newValues[1]}px ${newValues[2]}px ${newValues[3]}px`);
    };

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-4">T</span>
                    <Input
                        className="h-7 text-xs px-2"
                        value={values[0]}
                        onChange={(e) => handleChange(0, e.target.value)}
                        type="number"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-4">R</span>
                    <Input
                        className="h-7 text-xs px-2"
                        value={values[1]}
                        onChange={(e) => handleChange(1, e.target.value)}
                        type="number"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-4">B</span>
                    <Input
                        className="h-7 text-xs px-2"
                        value={values[2]}
                        onChange={(e) => handleChange(2, e.target.value)}
                        type="number"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground w-4">L</span>
                    <Input
                        className="h-7 text-xs px-2"
                        value={values[3]}
                        onChange={(e) => handleChange(3, e.target.value)}
                        type="number"
                    />
                </div>
            </div>
        </div>
    );
};
