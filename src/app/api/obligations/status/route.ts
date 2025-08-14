import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '../../../../../lib/auth';
import { updateComplianceItemStatus } from '../../../../../lib/db';

export async function POST(request: NextRequest) {
  if (!isAuthenticated()) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const formData = await request.formData();
    
    const id = formData.get('id') as string;
    const status = formData.get('status') as 'pending' | 'completed' | 'overdue';

    await updateComplianceItemStatus(id, status);
    
    return NextResponse.redirect(new URL('/obligations', request.url));
  } catch (error) {
    console.error('Error updating compliance item status:', error);
    return NextResponse.json(
      { error: 'Failed to update compliance item status' },
      { status: 500 }
    );
  }
}