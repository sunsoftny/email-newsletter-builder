import { JSONFilePreset } from 'lowdb/node'

export interface Template {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    data: any; // Full Redux state snapshot
}

interface Data {
    templates: Template[]
}

const defaultData: Data = { templates: [] }

// Initialize lowdb
export const getDb = async () => await JSONFilePreset<Data>('db.json', defaultData)
