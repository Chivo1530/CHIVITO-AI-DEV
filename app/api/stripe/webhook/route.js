import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { supabaseAdmin } from '../../../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request) {
  const body = await request.text()
  const sig = headers().get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionCancellation(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSuccess(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailure(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleSubscriptionChange(subscription) {
  const customerId = subscription.customer
  const subscriptionId = subscription.id
  const status = subscription.status
  const currentPeriodEnd = new Date(subscription.current_period_end * 1000)

  // Determine plan based on subscription items
  let planId = 'free_trial'
  let planName = 'Free Trial'
  let monthlyRevenue = 0
  
  if (subscription.items.data.length > 0) {
    const priceId = subscription.items.data[0].price.id
    if (priceId === process.env.STRIPE_PROFESSIONAL_PRICE_ID) {
      planId = 'professional'
      planName = 'Professional'
      monthlyRevenue = 297
    } else if (priceId === process.env.STRIPE_ENTERPRISE_PRICE_ID) {
      planId = 'enterprise'
      planName = 'Enterprise'
      monthlyRevenue = 697
    }
  }

  // Update user profile
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      stripe_subscription_id: subscriptionId,
      subscription_plan: planId,
      subscription_status: status,
      trial_ends_at: null, // Clear trial if they have a paid subscription
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating subscription:', error)
    // Send alert to monitoring system
    await sendMonitoringAlert({
      type: 'subscription_update_failed',
      message: `Failed to update subscription for customer ${customerId}`,
      error: error.message,
      customerId,
      subscriptionId
    })
  } else {
    // Success! Send celebration alert
    await sendMonitoringAlert({
      type: 'subscription_updated',
      message: `💰 Customer upgraded to ${planName} plan! +$${monthlyRevenue}/month`,
      customerId,
      subscriptionId,
      planName,
      monthlyRevenue,
      severity: 'success'
    })
    
    console.log(`🎉 Subscription updated: Customer ${customerId} → ${planName} plan`)
  }
}

async function handleSubscriptionCancellation(subscription) {
  const customerId = subscription.customer
  const canceledAt = new Date(subscription.canceled_at * 1000)

  // Get customer info before cancellation
  const { data: customer } = await supabaseAdmin
    .from('user_profiles')
    .select('email, subscription_plan')
    .eq('stripe_customer_id', customerId)
    .single()

  const lostRevenue = customer?.subscription_plan === 'professional' ? 297 : 
                     customer?.subscription_plan === 'enterprise' ? 697 : 0

  // Update user profile to downgrade to free trial
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_plan: 'free_trial',
      subscription_status: 'canceled',
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days grace period
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error handling subscription cancellation:', error)
  } else {
    // Send churn alert
    await sendMonitoringAlert({
      type: 'subscription_canceled',
      message: `📉 Customer canceled subscription: -$${lostRevenue}/month`,
      customerId,
      customerEmail: customer?.email,
      lostRevenue,
      severity: 'warning'
    })
    
    console.log(`📉 Subscription canceled: Customer ${customerId} (${customer?.email})`)
  }
}

async function handlePaymentSuccess(invoice) {
  const customerId = invoice.customer
  const subscriptionId = invoice.subscription
  const amountPaid = invoice.amount_paid

  // Log successful payment
  console.log(`Payment successful for customer ${customerId}: $${amountPaid / 100}`)

  // Update subscription status to active
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating payment success:', error)
  } else {
    // Send revenue alert
    await sendMonitoringAlert({
      type: 'payment_success',
      message: `💰 Payment received: $${amountPaid / 100} from customer ${customerId}`,
      customerId,
      amount: amountPaid / 100,
      severity: 'success'
    })
  }
}

async function handlePaymentFailure(invoice) {
  const customerId = invoice.customer
  const subscriptionId = invoice.subscription
  const amountFailed = invoice.amount_due

  // Log failed payment
  console.log(`Payment failed for customer ${customerId}`)

  // Update subscription status
  const { error } = await supabaseAdmin
    .from('user_profiles')
    .update({
      subscription_status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_customer_id', customerId)

  if (error) {
    console.error('Error updating payment failure:', error)
  } else {
    // Send payment failure alert
    await sendMonitoringAlert({
      type: 'payment_failed',
      message: `❌ Payment failed: $${amountFailed / 100} from customer ${customerId}`,
      customerId,
      amount: amountFailed / 100,
      severity: 'error'
    })
  }
}

async function sendMonitoringAlert(alertData) {
  try {
    // Send to monitoring system
    await fetch('/api/monitoring', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'send_alert',
        data: alertData
      })
    })
  } catch (error) {
    console.error('Failed to send monitoring alert:', error)
  }
}