'use client';
import React from 'react';
import { Header } from '@/components/layout/Header';
import { ToolsPanel } from '@/components/layout/ToolsPanel';
import { PropertiesPanel } from '@/components/layout/PropertiesPanel';
import { Canvas } from '@/components/editor/Canvas';

import { mockAiFeatures } from '@/lib/mock-ai';

export default function Home() {
  const handleSave = async (data: any) => {
    // Save to local storage for demo purposes
    const templates = JSON.parse(localStorage.getItem('saved_templates') || '[]');
    const newTemplate = {
      id: crypto.randomUUID(),
      name: 'Local Template ' + new Date().toLocaleTimeString(),
      updatedAt: new Date().toISOString(),
      data
    };
    templates.push(newTemplate);
    localStorage.setItem('saved_templates', JSON.stringify(templates));
    console.log('Saved to local storage:', newTemplate);
    return Promise.resolve();
  };

  const handleLoad = async () => {
    return JSON.parse(localStorage.getItem('saved_templates') || '[]');
  };

  const handleSendTestEmail = async (email: string, html: string) => {
    console.log('Sending test email to:', email);
    console.log('HTML Content length:', html.length);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
  };

  const handleUpload = async (file: File) => {
    console.log('Uploading file:', file.name);
    return new Promise<string>((resolve) => {
      setTimeout(() => {
        // Return a fake URL for demo
        resolve(URL.createObjectURL(file));
      }, 1500);
    });
  };

  const handleFetchImages = async () => {
    return [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400&q=80',
      'https://images.unsplash.com/photo-1557683316-973673baf926?w=400&q=80',
      'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=80',
      'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=400&q=80'
    ];
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50">
      <Header
        aiFeatures={mockAiFeatures}
        onSave={handleSave}
        onLoad={handleLoad}
        onSendTestEmail={handleSendTestEmail}
      />
      <div className="flex flex-1 overflow-hidden relative">
        <ToolsPanel />
        <Canvas />
        <PropertiesPanel
          aiFeatures={mockAiFeatures}
          onUploadImage={handleUpload}
          onFetchImages={handleFetchImages}
        />
      </div>
    </div>
  );
}
