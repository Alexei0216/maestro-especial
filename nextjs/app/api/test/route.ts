export async function GET() {
  return Response.json({
    stripe: !!process.env.STRIPE_SECRET_KEY,
  });
}