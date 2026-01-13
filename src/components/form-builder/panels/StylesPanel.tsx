"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateFormSettings } from '@/store/formEditorSlice';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const StylesPanel = () => {
    const dispatch = useDispatch();
    const { formSettings } = useSelector((state: RootState) => state.formEditor);

    const handleChange = (key: string, value: any) => {
        dispatch(updateFormSettings({ [key]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Layout</h3>

                <div className="grid gap-2">
                    <Label>Form Width (px)</Label>
                    <Input
                        type="number"
                        value={formSettings.width}
                        onChange={(e) => handleChange('width', parseInt(e.target.value))}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Padding</Label>
                    <Input
                        value={formSettings.padding}
                        onChange={(e) => handleChange('padding', e.target.value)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Appearance</h3>

                <div className="grid gap-2">
                    <Label>Background Color</Label>
                    <div className="flex gap-2">
                        <div
                            className="w-8 h-8 rounded border shadow-sm"
                            style={{ backgroundColor: formSettings.backgroundColor }}
                        />
                        <Input
                            value={formSettings.backgroundColor}
                            onChange={(e) => handleChange('backgroundColor', e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label>Border Radius (px)</Label>
                    <Input
                        type="number"
                        value={formSettings.borderRadius}
                        onChange={(e) => handleChange('borderRadius', parseInt(e.target.value))}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Overlay Opacity</Label>
                    <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={formSettings.overlayOpacity}
                        onChange={(e) => handleChange('overlayOpacity', parseFloat(e.target.value))}
                    />
                </div>
            </div>
        </div>
    );
};

export default StylesPanel;
