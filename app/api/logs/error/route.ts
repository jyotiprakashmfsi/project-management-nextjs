import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { logs } = await request.json();
    
    if (!Array.isArray(logs)) {
      return NextResponse.json({ error: 'Invalid logs format' }, { status: 400 });
    }
    
    // Log errors to server console
    logs.forEach((log: any) => {
      console.error('[Client Error]', JSON.stringify(log, null, 2));
      
      // Here you would typically:
      // 1. Store logs in a database
      // 2. Send to a logging service like Datadog, LogRocket, or Sentry
      // 3. Trigger alerts for critical errors
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing error logs:', error);
    return NextResponse.json({ error: 'Failed to process logs' }, { status: 500 });
  }
}
