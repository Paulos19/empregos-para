import { config } from "@/app/config";
import Stripe from "stripe";
import { prisma } from '../database/index';

export const stripe = new Stripe(config.stripe.secretKey || '', {
    apiVersion: "2024-06-20",
    httpClient: Stripe.createFetchHttpClient(),
  })

  export const getStripeCustomerByEmail = async (email: string) => {
    const customers = await stripe.customers.list({ email });
    return customers.data[0];
  }

  export const createStripeCustomer = async (
    input: {
      name?: string,
      email: string
    }
  ) => {
    let customer = await getStripeCustomerByEmail(input.email)
    if(customer) return customer
    
    const createdCustomer = await stripe.customers.create({
      email: input.email,
      name: input.name
    })

    const createdCustomerSubscription = await stripe.subscriptions.create({
      customer: createdCustomer.id,
      items: [{ price: config.stripe.plans.free.priceId }],
    })

    await prisma.user.update({
      where: {
        email: input.email,
      },
      data: {
        stripeCustomerId: createdCustomer.id,
        stripeSubscriptionId: createdCustomerSubscription.id,
        stripeSubscriptionStatus: createdCustomerSubscription.status,
        stripePriceId: config.stripe.plans.free.priceId
      },
    })

    return createdCustomer
    
  }

  export const createCheckoutSession = async (
    userId: string, 
    userEmail: string,
    chargeId: string, //
  ) => {
    try {
      const customer = await createStripeCustomer({
        email: userEmail
      });
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'], // ou adicione outras formas de pagamento que você suporta
        line_items: [
          {
            price: config.stripe.plans.pro.priceId, // ID do preço para pagamento único
            quantity: 1, // Quantidade de itens a serem comprados
          },
        ],
        mode: 'payment', // Define o modo para pagamento único (não assinatura)
        success_url: `http://localhost:3000/resume-builder?success=true&userId=${userId}`, // Inclua o chargeId na URL
        cancel_url: 'http://localhost:3000/resume-builder?canceled=true',
      });
      
  
     /* const session = await stripe.billingPortal.sessions.create({
        customer: customer.id,
        return_url: 'http://localhost:3000/resume-builder',
        flow_data: {
          type: 'subscription_update_confirm',
          after_completion: {
            type: 'redirect',
            redirect: {
              return_url:
                'http://localhost:3000/resume-builder?success=true',
            },
          },
          subscription_update_confirm: {
            subscription: userStripeSubscriptionId,
            items: [
              {
                id: subscription.data[0].id,
                price: config.stripe.plans.pro.priceId,
                quantity: 1,
              },
            ],
          },
        },
      }) 
  */
      return {
        url: session.url
      }
    } catch (error) {
      console.error(error)
      throw new Error('Error to create checkout session')
    }
  }

  export const handleProcessWebhookUpdatedSubscription = async (event: { object: Stripe.Subscription }) => {
    const stripeCustomerId = event.object.customer as string;
    const stripeSubscriptionId = event.object.id as string;
    const stripeSubscriptionStatus = event.object.status;
    const stripePriceId = event.object.items.data[0].price.id;
  
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { stripeSubscriptionId },
          { stripeCustomerId }
        ]
      }
    });
  
    if (!user) {
      throw new Error('User not found');
    }
  
    // Atualize o usuário com os detalhes da assinatura e resete o status de download
    await prisma.user.update({
      where: { id: user.id },
      data: {
        stripeCustomerId,
        stripeSubscriptionId,
        stripeSubscriptionStatus,
        stripePriceId,
        hasDownloaded: false, // Reseta o status de download
      }
    });
  
    // Atualize o charge no banco de dados se necessário
    if (event.object.latest_invoice) {
      const latestInvoice = await stripe.invoices.retrieve(event.object.latest_invoice as string);
      if (latestInvoice.payment_intent) {
        await prisma.charge.upsert({
          where: { stripeChargeId: latestInvoice.id },
          update: { status: 'updated' }, // Atualize o status conforme necessário
          create: { stripeChargeId: latestInvoice.id, status: 'updated', amount: latestInvoice.amount_paid },
        });
      }
    }
  };

  type Plan = {
    priceId: string
  }

  type Plans = {
    [key: string]: Plan
  }

  export const getPlanByPrice = (priceId: string) => {
    const plans: Plans = config.stripe.plans

    const planKey = Object.keys(plans).find(
      (key) => plans[key].priceId === priceId,
    ) as keyof Plans | undefined

    const plan = planKey ? plans[planKey] : null

  if (!plan) {
    throw new Error(`Plan not found for priceId: ${priceId}`)
  }

    return {
      name: planKey
    }
  }

  
