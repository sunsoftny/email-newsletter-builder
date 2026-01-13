"use client";

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { updateBehavior } from '@/store/formEditorSlice';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TargetingPanel = () => {
    const dispatch = useDispatch();
    const { behavior } = useSelector((state: RootState) => state.formEditor);

    const updateTrigger = (key: string, value: any) => {
        dispatch(updateBehavior({
            triggerConfig: { ...behavior.triggerConfig, [key]: value }
        }));
    };

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Display Triggers</h3>

                <div className="flex items-center justify-between">
                    <Label className="flex flex-col">
                        <span>Exit Intent</span>
                        <span className="text-xs text-slate-500 font-normal">Show when user moves mouse to exit</span>
                    </Label>
                    <Switch
                        checked={behavior.triggerConfig.exitIntent}
                        onCheckedChange={(checked) => updateTrigger('exitIntent', checked)}
                    />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Frequency</h3>

                <div className="grid gap-2">
                    <Label>Show Form</Label>
                    <Select
                        value={behavior.displayFrequency}
                        onValueChange={(val: any) => dispatch(updateBehavior({ displayFrequency: val }))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="always">Always</SelectItem>
                            <SelectItem value="once_per_session">Once per session</SelectItem>
                            <SelectItem value="once_per_user">Once per user</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-900 border-b pb-2">Devices</h3>

                <div className="grid gap-2">
                    <Label>Target Devices</Label>
                    <Select
                        value={behavior.deviceTargeting}
                        onValueChange={(val: any) => dispatch(updateBehavior({ deviceTargeting: val }))}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Desktop & Mobile</SelectItem>
                            <SelectItem value="desktop">Desktop Only</SelectItem>
                            <SelectItem value="mobile">Mobile Only</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default TargetingPanel;
