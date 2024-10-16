import { prisma } from '@/app/services/database'
import { handleProcessWebhookUpdatedSubscription, stripe } from '@/app/services/stripe'
import { headers } from 'next/headers'
import Stripe from 'stripe'


export async function POST(req: Request) {
    const body = await req.text()
    const signature = headers().get('Stripe-Signature') as string

    let event: Stripe.Event

    try{
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET as string,
        )
    }catch (error: any) {
        console.error(`Webhook Error: ${error.message}`)
        return new Response(`Webhook Error: ${error.message}`, {status: 400})
    }

    switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
            await handleProcessWebhookUpdatedSubscription(event.data)
            break;
            case 'payment_intent.succeeded':
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      if (paymentIntent.id) {
        await prisma.charge.upsert({
          where: { stripeChargeId: paymentIntent.id },
          update: { status: 'succeeded', amount: paymentIntent.amount_received },
          create: { stripeChargeId: paymentIntent.id, status: 'succeeded', amount: paymentIntent.amount_received },
        });
      }
      break;

    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      const paymentIntentId = session.payment_intent as string; // Ensure it's a string
      if (paymentIntentId) {
        await prisma.charge.upsert({
          where: { stripeChargeId: paymentIntentId },
          update: { status: 'completed', amount: session.amount_total || 0 },
          create: { stripeChargeId: paymentIntentId, status: 'completed', amount: session.amount_total || 0 },
        });
      }
      break;

    case 'payment_intent.created':
      // Handle the event
      break;

    case 'charge.succeeded':
      const charge = event.data.object as Stripe.Charge;
      if (charge.id) {
        await prisma.charge.upsert({
          where: { stripeChargeId: charge.id },
          update: { status: 'succeeded', amount: charge.amount },
          create: { stripeChargeId: charge.id, status: 'succeeded', amount: charge.amount },
        });
      }
      break;

    case 'charge.updated':
      const updatedCharge = event.data.object as Stripe.Charge;
      if (updatedCharge.id) {
        await prisma.charge.upsert({
          where: { stripeChargeId: updatedCharge.id },
          update: { status: 'updated', amount: updatedCharge.amount },
          create: { stripeChargeId: updatedCharge.id, status: 'updated', amount: updatedCharge.amount },
        });
      }
      break;

        default:
            console.log(`Unhandled event type ${event.type}`)
    }

    return new Response('{ "received": true}', {status:200})
}