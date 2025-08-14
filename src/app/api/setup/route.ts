import { NextResponse } from 'next/server';
import { initializeDatabase } from '../../../../lib/db';
import { seedData } from '../../../../lib/seed';

export async function POST() {
  try {
    await initializeDatabase();
    await seedData();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database initialized and seeded successfully' 
    });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json(
      { error: 'Failed to initialize database' },
      { status: 500 }
    );
  }
}