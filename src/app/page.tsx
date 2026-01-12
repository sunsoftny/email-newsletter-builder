import React from 'react';
import { Header } from '@/components/layout/Header';
import { ToolsPanel } from '@/components/layout/ToolsPanel';
import { PropertiesPanel } from '@/components/layout/PropertiesPanel';
import { Canvas } from '@/components/editor/Canvas';

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
      <Header />
      <div className="flex flex-1 overflow-hidden relative">
        <ToolsPanel />
        <Canvas />
        <PropertiesPanel />
      </div>
    </div>
  );
}
