'use client';
import React from 'react';
import { Header } from '@/components/layout/Header';
import { ToolsPanel } from '@/components/layout/ToolsPanel';
import { PropertiesPanel } from '@/components/layout/PropertiesPanel';
import { Canvas } from '@/components/editor/Canvas';

import { mockAiFeatures } from '@/lib/mock-ai';
import { SAMPLE_TEMPLATES } from '@/lib/sample-templates';

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
    const stored = localStorage.getItem('saved_templates');
    let templates = stored ? JSON.parse(stored) : [];

    // 1. Clean up potential duplicates of our samples (keep the latest one)
    // This fixes the issue where previous versions might have spammed LocalStorage
    const sampleNames = new Set(SAMPLE_TEMPLATES.map(s => s.name));
    const uniqueTemplates: any[] = [];
    const seenNames = new Set();

    // Sort by date new to old to keep latest
    templates.sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    for (const t of templates) {
      if (sampleNames.has(t.name)) {
        if (!seenNames.has(t.name)) {
          uniqueTemplates.push(t);
          seenNames.add(t.name);
        }
      } else {
        uniqueTemplates.push(t);
      }
    }
    templates = uniqueTemplates;

    // 2. Check if we have our samples, if not add them
    const hasSample = templates.some((t: any) => sampleNames.has(t.name));

    if (!hasSample) {
      console.log('Seeding sample templates...');
      const samples = SAMPLE_TEMPLATES.map(t => ({
        ...t,
        id: crypto.randomUUID(), // New ID for local copy
        updatedAt: new Date().toISOString()
      }));
      templates = [...samples, ...templates];
    }

    // Update storage with cleaned list
    localStorage.setItem('saved_templates', JSON.stringify(templates));
    return templates;
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
