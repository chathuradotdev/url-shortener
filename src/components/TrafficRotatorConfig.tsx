
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";
import { Plus, Trash2, ArrowRight } from "lucide-react";

interface RotationRule {
    url: string;
    weight: number;
}

interface TrafficRotatorConfigProps {
    enabled: boolean;
    setEnabled: (v: boolean) => void;
    mode: 'weighted' | 'sequential';
    setMode: (v: 'weighted' | 'sequential') => void;
    rules: RotationRule[];
    setRules: (v: RotationRule[]) => void;
}

export function TrafficRotatorConfig({
    enabled,
    setEnabled,
    mode,
    setMode,
    rules,
    setRules
}: TrafficRotatorConfigProps) {

    // Ensure we have at least one rule if enabled
    useEffect(() => {
        if (enabled && rules.length === 0) {
            setRules([{ url: "", weight: 100 }]);
        }
    }, [enabled, rules, setRules]);

    const addRule = () => {
        setRules([...rules, { url: "", weight: 50 }]);
    };

    const removeRule = (index: number) => {
        const newRules = [...rules];
        newRules.splice(index, 1);
        setRules(newRules);
    };

    const updateRule = (index: number, field: keyof RotationRule, value: string | number) => {
        const newRules = [...rules];
        newRules[index] = { ...newRules[index], [field]: value };
        setRules(newRules);
    };

    return (
        <div className="space-y-4 border p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50">
            <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                    <Label className="text-base font-medium">Link Rotation & A/B Testing</Label>
                    <p className="text-sm text-muted-foreground">
                        Distribute traffic to multiple destinations.
                    </p>
                </div>
                <Switch
                    checked={enabled}
                    onCheckedChange={setEnabled}
                />
            </div>

            {enabled && (
                <div className="space-y-4 pt-2">
                    <div className="grid w-full items-center gap-1.5">
                        <Label>Rotation Strategy</Label>
                        <Select
                            value={mode}
                            onValueChange={(v: 'weighted' | 'sequential') => setMode(v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select strategy" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="weighted">Weighted Random (A/B Split)</SelectItem>
                                <SelectItem value="sequential">Sequential (Round Robin)</SelectItem>
                            </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                            {mode === 'weighted'
                                ? "Traffic is distributed randomly based on assigned weights (%)."
                                : "Traffic is distributed in order: URL 1, then URL 2, etc."}
                        </p>
                    </div>

                    <div className="space-y-3">
                        <Label>Destinations</Label>
                        {rules.map((rule, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <div className="grid gap-1 flex-1">
                                    <Input
                                        placeholder="https://example.com/variant-a"
                                        value={rule.url}
                                        onChange={(e) => updateRule(index, 'url', e.target.value)}
                                        className="h-9"
                                    />
                                </div>

                                {mode === 'weighted' && (
                                    <div className="w-24 grid gap-1">
                                        <div className="relative">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={rule.weight}
                                                onChange={(e) => updateRule(index, 'weight', parseInt(e.target.value) || 0)}
                                                className="h-9 pr-6"
                                            />
                                            <span className="absolute right-2 top-2.5 text-xs text-muted-foreground">%</span>
                                        </div>
                                    </div>
                                )}

                                {mode === 'sequential' && (
                                    <div className="w-8 flex items-center justify-center h-9 text-xs font-bold text-muted-foreground bg-slate-100 rounded">
                                        {index + 1}
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeRule(index)}
                                    className="h-9 w-9 text-muted-foreground hover:text-red-500"
                                    disabled={rules.length <= 1}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addRule}
                            className="w-full mt-2"
                        >
                            <Plus className="mr-2 h-3 w-3" /> Add Destination
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
