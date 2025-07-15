import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { createCheckoutSession, createStripeCustomer, STRIPE_PRICES } from '../../../../lib/stripe'
import { getUserProfile, updateUserProfile } from '../../../../lib/supabase'

export async function POST(request) {
  try {
    const { planId } = await request.json()
    
    // Get user from session
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile
    const profile = await getUserProfile(user.id)
    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 })
    }

    // Create Stripe customer if not exists
    let customerId = profile.stripe_customer_id
    if (!customerId) {
      const customer = await createStripeCustomer(user.email, profile.company_name || user.email)
      customerId = customer.id
      
      // Update user profile with Stripe customer ID
      await updateUserProfile(user.id, { stripe_customer_id: customerId })
    }

    // Get price ID based on plan
    const priceId = STRIPE_PRICES[planId]
    if (!priceId) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    // Create checkout session
    const session = await createCheckoutSession(customerId, priceId, user.id)

    return NextResponse.json({ url: session.url })
    
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}