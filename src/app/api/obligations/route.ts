import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../lib/auth';
import { addComplianceItem } from '../../../../lib/db';

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const formData = await request.formData();
    
    const complianceItem = {
      name: formData.get('name') as string,
      type: formData.get('type') as 'federal' | 'state' | 'local',
      category: formData.get('category') as string,
      due_date: formData.get('due_date') as string,
      frequency: formData.get('frequency') as string,
      status: formData.get('status') as 'pending' | 'completed' | 'overdue',
      description: formData.get('description') as string || undefined,
    };

    await addComplianceItem(complianceItem);
    
    return NextResponse.redirect(new URL('/obligations', request.url));
  } catch (error) {
    console.error('Error adding compliance item:', error);
    return NextResponse.json(
      { error: 'Failed to add compliance item' },
      { status: 500 }
    );
  }
}