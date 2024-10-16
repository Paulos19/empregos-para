// app/api/check-charge-status/route.ts
import { prisma } from '@/app/services/database';
import { NextResponse } from 'next/server';


export async function GET(request: Request) {
  const url = new URL(request.url);
  const chargeId = url.searchParams?.get('chargeId');

  if (!chargeId) {
    return NextResponse.json({ error: 'Charge ID is required' }, { status: 400 });
  }

  try {
    const charge = await prisma.charge.findUnique({
      where: { stripeChargeId: chargeId },
    });

    if (!charge) {
      return NextResponse.json({ error: 'Charge not found' }, { status: 404 });
    }

    return NextResponse.json({ status: charge.status });
  } catch (error) {
    console.error('Error fetching charge status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
