import { sql } from '@vercel/postgres';

export interface ComplianceItem {
  id: string;
  name: string;
  type: 'federal' | 'state' | 'local';
  category: string;
  due_date: string;
  frequency: string;
  status: 'pending' | 'completed' | 'overdue';
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  compliance_item_id?: string;
  uploaded_at: string;
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  type: 'new' | 'update' | 'deadline';
  source: string;
  created_at: string;
}

export async function initializeDatabase() {
  try {
    // Create compliance_items table
    await sql`
      CREATE TABLE IF NOT EXISTS compliance_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(500) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('federal', 'state', 'local')),
        category VARCHAR(100) NOT NULL,
        due_date DATE NOT NULL,
        frequency VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue')),
        description TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create documents table
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(500) NOT NULL,
        file_path VARCHAR(1000) NOT NULL,
        file_size BIGINT,
        mime_type VARCHAR(100),
        compliance_item_id UUID REFERENCES compliance_items(id),
        uploaded_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    // Create alerts table
    await sql`
      CREATE TABLE IF NOT EXISTS alerts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR(500) NOT NULL,
        description TEXT,
        type VARCHAR(20) NOT NULL CHECK (type IN ('new', 'update', 'deadline')),
        source VARCHAR(200),
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

export async function getComplianceItems(): Promise<ComplianceItem[]> {
  const result = await sql`
    SELECT * FROM compliance_items 
    ORDER BY due_date ASC
  `;
  return result.rows as ComplianceItem[];
}

export async function getDocuments(): Promise<Document[]> {
  const result = await sql`
    SELECT * FROM documents 
    ORDER BY uploaded_at DESC
  `;
  return result.rows as Document[];
}

export async function getAlerts(): Promise<Alert[]> {
  const result = await sql`
    SELECT * FROM alerts 
    ORDER BY created_at DESC
    LIMIT 10
  `;
  return result.rows as Alert[];
}

export async function addComplianceItem(item: Omit<ComplianceItem, 'id' | 'created_at' | 'updated_at'>) {
  const result = await sql`
    INSERT INTO compliance_items (name, type, category, due_date, frequency, status, description)
    VALUES (${item.name}, ${item.type}, ${item.category}, ${item.due_date}, ${item.frequency}, ${item.status}, ${item.description})
    RETURNING *
  `;
  return result.rows[0] as ComplianceItem;
}

export async function updateComplianceItemStatus(id: string, status: 'pending' | 'completed' | 'overdue') {
  const result = await sql`
    UPDATE compliance_items 
    SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  return result.rows[0] as ComplianceItem;
}