import { NextResponse } from 'next/server';
import { getDb, Template } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
    const db = await getDb(); // Correctly await the promise
    return NextResponse.json(db.data.templates);
}

export async function POST(request: Request) {
    const db = await getDb(); // Correctly await the promise
    const body = await request.json();

    const newTemplate: Template = {
        id: uuidv4(),
        name: body.name || 'Untitled Template',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        data: body.data,
    };

    await db.update(({ templates }) => templates.push(newTemplate));

    return NextResponse.json(newTemplate);
}
