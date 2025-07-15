import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
})

export const STRIPE_PRICES = {
  professional: 'price_1OjDX6Q1PNzqZ7HGxDrXkqQ', // $297/mo - Replace with actual price ID
  enterprise: 'price_1OjDX7Q1PNzqZ7HGxDrXkqQ', // $697/mo - Replace with actual price ID
}

export const createStripeCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'chivito-ai'
      }
    })
    return customer
  } catch (error) {
    throw new Error(`Failed to create Stripe customer: ${error.message}`)
  }
}

export const createCheckoutSession = async (customerId, priceId, userId) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      metadata: {
        userId,
      },
    })
    return session
  } catch (error) {
    throw new Error(`Failed to create checkout session: ${error.message}`)
  }
}

export const createPortalSession = async (customerId) => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/dashboard`,
    })
    return session
  } catch (error) {
    throw new Error(`Failed to create portal session: ${error.message}`)
  }
}

export const getSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    return subscription
  } catch (error) {
    throw new Error(`Failed to get subscription: ${error.message}`)
  }
}

export const cancelSubscription = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    })
    return subscription
  } catch (error) {
    throw new Error(`Failed to cancel subscription: ${error.message}`)
  }
}

export const getUsageMetrics = async (subscriptionId) => {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ['items.data.price.product'],
    })
    return subscription
  } catch (error) {
    throw new Error(`Failed to get usage metrics: ${error.message}`)
  }
}

export const createUsageRecord = async (subscriptionItemId, quantity) => {
  try {
    const usageRecord = await stripe.subscriptionItems.createUsageRecord(
      subscriptionItemId,
      {
        quantity,
        timestamp: Math.floor(Date.now() / 1000),
      }
    )
    return usageRecord
  } catch (error) {
    throw new Error(`Failed to create usage record: ${error.message}`)
  }
}

export default stripe