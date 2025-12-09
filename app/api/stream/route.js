import { NextResponse } from "next/server";

export async function GET() {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ message: 'Connected to stream' })}\n\n`));

      // Send periodic updates (every 30 seconds)
      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
          time: new Date().toISOString(),
          message: 'Heartbeat',
          status: 'active'
        })}\n\n`));
      }, 30000);

      // Cleanup on client disconnect
      return () => {
        clearInterval(interval);
      };
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
