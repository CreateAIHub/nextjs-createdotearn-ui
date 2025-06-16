export async function GET() {
  return Response.json({
    status: 'available',
    uptime: 86400,
    load: 0.3
  });
}