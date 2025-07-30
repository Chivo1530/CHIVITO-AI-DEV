// CHIVITO AI - Affiliate System API
// "Community-fueled growth engine"

import { NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabase'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    const userId = searchParams.get('userId')
    const affiliateCode = searchParams.get('affiliateCode')
    
    switch (action) {
      case 'get_affiliate_stats':
        return await getAffiliateStats(userId)
      
      case 'get_referrals':
        return await getReferrals(userId)
      
      case 'validate_code':
        return await validateAffiliateCode(affiliateCode)
      
      case 'leaderboard':
        return await getAffiliateLeaderboard()
      
      case 'commission_history':
        return await getCommissionHistory(userId)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Affiliate API error:', error)
    return NextResponse.json(
      { success: false, error: 'Affiliate system failed' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { action, data } = await request.json()
    
    switch (action) {
      case 'create_affiliate':
        return await createAffiliate(data)
      
      case 'process_referral':
        return await processReferral(data)
      
      case 'request_payout':
        return await requestPayout(data)
      
      case 'track_conversion':
        return await trackConversion(data)
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid affiliate action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Affiliate POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Affiliate operation failed' },
      { status: 500 }
    )
  }
}

async function getAffiliateStats(userId) {
  try {
    // Get affiliate data
    let { data: affiliate, error: affiliateError } = await supabase
      .from('affiliates')
      .select('*')
      .eq('user_id', userId)
      .single()
    
    if (affiliateError) {
      // Create affiliate if doesn't exist
      const { data: newAffiliate } = await supabase
        .from('affiliates')
        .insert([{
          user_id: userId,
          affiliate_code: generateAffiliateCode(),
          commission_rate: 20.00,
          status: 'active'
        }])
        .select()
        .single()
      
      affiliate = newAffiliate
    }
    
    // Get referral stats
    const { data: referrals } = await supabase
      .from('referrals')
      .select('*')
      .eq('affiliate_id', affiliate.id)
    
    // Calculate stats
    const stats = {
      affiliateCode: affiliate.affiliate_code,
      totalReferrals: referrals?.length || 0,
      totalEarnings: affiliate.total_earnings || 0,
      pendingEarnings: referrals?.filter(r => !r.commission_paid).reduce((sum, r) => sum + (r.commission_earned || 0), 0) || 0,
      conversionRate: referrals?.length > 0 ? (referrals.filter(r => r.conversion_date).length / referrals.length * 100).toFixed(2) : 0,
      recentReferrals: referrals?.filter(r => {
        const daysSince = (Date.now() - new Date(r.created_at).getTime()) / (1000 * 60 * 60 * 24)
        return daysSince <= 30
      }).length || 0,
      commissionRate: affiliate.commission_rate,
      status: affiliate.status
    }
    
    return NextResponse.json({
      success: true,
      affiliate,
      stats,
      referralLink: `https://chivito.ai/signup?ref=${affiliate.affiliate_code}`,
      ponchInsight: `💰 Affiliate empire: ${stats.totalReferrals} referrals, $${stats.totalEarnings} earned!`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get affiliate stats' },
      { status: 500 }
    )
  }
}

async function getReferrals(userId) {
  try {
    // Get affiliate ID
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id')
      .eq('user_id', userId)
      .single()
    
    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Affiliate not found' },
        { status: 404 }
      )
    }
    
    // Get referrals with user details
    const { data: referrals } = await supabase
      .from('referrals')
      .select(`
        *,
        user_profiles!referrals_referred_user_id_fkey (
          email,
          subscription_plan,
          subscription_status,
          created_at
        )
      `)
      .eq('affiliate_id', affiliate.id)
      .order('created_at', { ascending: false })
    
    return NextResponse.json({
      success: true,
      referrals,
      ponchInsight: `📋 Referral list: ${referrals?.length || 0} referrals tracked`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get referrals' },
      { status: 500 }
    )
  }
}

async function validateAffiliateCode(affiliateCode) {
  try {
    if (!affiliateCode) {
      return NextResponse.json({
        success: false,
        valid: false,
        error: 'No affiliate code provided'
      })
    }
    
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id, affiliate_code, status, user_profiles!affiliates_user_id_fkey (email)')
      .eq('affiliate_code', affiliateCode)
      .eq('status', 'active')
      .single()
    
    if (!affiliate) {
      return NextResponse.json({
        success: true,
        valid: false,
        message: 'Invalid or inactive affiliate code'
      })
    }
    
    return NextResponse.json({
      success: true,
      valid: true,
      affiliate: {
        code: affiliate.affiliate_code,
        email: affiliate.user_profiles?.email,
        status: affiliate.status
      },
      message: 'Valid affiliate code'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to validate affiliate code' },
      { status: 500 }
    )
  }
}

async function processReferral(data) {
  try {
    const { referralCode, newUserId } = data
    
    // Find affiliate
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id, commission_rate')
      .eq('affiliate_code', referralCode)
      .eq('status', 'active')
      .single()
    
    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Invalid affiliate code' },
        { status: 400 }
      )
    }
    
    // Check if referral already exists
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('referred_user_id', newUserId)
      .single()
    
    if (existingReferral) {
      return NextResponse.json(
        { success: false, error: 'User already referred' },
        { status: 409 }
      )
    }
    
    // Create referral record
    const { data: referral, error } = await supabase
      .from('referrals')
      .insert([{
        affiliate_id: affiliate.id,
        referred_user_id: newUserId,
        referral_code: referralCode,
        status: 'pending'
      }])
      .select()
      .single()
    
    if (error) throw error
    
    // Update affiliate stats
    await supabase
      .from('affiliates')
      .update({
        total_referrals: affiliate.total_referrals + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', affiliate.id)
    
    return NextResponse.json({
      success: true,
      referral,
      message: 'Referral processed successfully',
      ponchInsight: `🎉 New referral processed! Affiliate earnings will be calculated on conversion.`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to process referral' },
      { status: 500 }
    )
  }
}

async function trackConversion(data) {
  try {
    const { userId, subscriptionPlan } = data
    
    // Find referral
    const { data: referral } = await supabase
      .from('referrals')
      .select('id, affiliate_id, status')
      .eq('referred_user_id', userId)
      .eq('status', 'pending')
      .single()
    
    if (!referral) {
      return NextResponse.json({
        success: true,
        message: 'No pending referral found'
      })
    }
    
    // Calculate commission
    const commissionRates = {
      professional: 59.40, // 20% of $297
      enterprise: 139.40   // 20% of $697
    }
    
    const commissionEarned = commissionRates[subscriptionPlan] || 0
    
    if (commissionEarned === 0) {
      return NextResponse.json({
        success: true,
        message: 'No commission for this plan'
      })
    }
    
    // Update referral with conversion
    const { error: referralError } = await supabase
      .from('referrals')
      .update({
        conversion_date: new Date().toISOString(),
        commission_earned: commissionEarned,
        status: 'converted',
        updated_at: new Date().toISOString()
      })
      .eq('id', referral.id)
    
    if (referralError) throw referralError
    
    // Update affiliate earnings
    const { error: affiliateError } = await supabase
      .from('affiliates')
      .update({
        total_earnings: supabase.raw('total_earnings + ?', [commissionEarned]),
        updated_at: new Date().toISOString()
      })
      .eq('id', referral.affiliate_id)
    
    if (affiliateError) throw affiliateError
    
    return NextResponse.json({
      success: true,
      commissionEarned,
      message: 'Conversion tracked successfully',
      ponchInsight: `💰 Conversion tracked! $${commissionEarned} commission earned.`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to track conversion' },
      { status: 500 }
    )
  }
}

async function getAffiliateLeaderboard() {
  try {
    const { data: affiliates } = await supabase
      .from('affiliates')
      .select(`
        id,
        affiliate_code,
        total_referrals,
        total_earnings,
        user_profiles!affiliates_user_id_fkey (email)
      `)
      .eq('status', 'active')
      .order('total_earnings', { ascending: false })
      .limit(10)
    
    const leaderboard = affiliates?.map((affiliate, index) => ({
      rank: index + 1,
      affiliateCode: affiliate.affiliate_code,
      email: affiliate.user_profiles?.email?.replace(/(.{3}).*(@.*)/, '$1***$2'), // Mask email
      totalReferrals: affiliate.total_referrals,
      totalEarnings: affiliate.total_earnings
    })) || []
    
    return NextResponse.json({
      success: true,
      leaderboard,
      ponchInsight: `🏆 Top affiliates: ${leaderboard.length} empire builders dominating!`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to get leaderboard' },
      { status: 500 }
    )
  }
}

async function requestPayout(data) {
  try {
    const { userId, amount, paymentMethod } = data
    
    // Get affiliate
    const { data: affiliate } = await supabase
      .from('affiliates')
      .select('id, total_earnings')
      .eq('user_id', userId)
      .single()
    
    if (!affiliate) {
      return NextResponse.json(
        { success: false, error: 'Affiliate not found' },
        { status: 404 }
      )
    }
    
    // Check minimum payout threshold
    const MIN_PAYOUT = 100.00
    if (amount < MIN_PAYOUT) {
      return NextResponse.json(
        { success: false, error: `Minimum payout is $${MIN_PAYOUT}` },
        { status: 400 }
      )
    }
    
    if (amount > affiliate.total_earnings) {
      return NextResponse.json(
        { success: false, error: 'Insufficient earnings' },
        { status: 400 }
      )
    }
    
    // Get unpaid referrals
    const { data: unpaidReferrals } = await supabase
      .from('referrals')
      .select('id, commission_earned')
      .eq('affiliate_id', affiliate.id)
      .eq('commission_paid', false)
    
    // Create payout request
    const { data: payout, error } = await supabase
      .from('commission_payouts')
      .insert([{
        affiliate_id: affiliate.id,
        amount: amount,
        referral_ids: unpaidReferrals?.map(r => r.id) || [],
        payment_method: paymentMethod,
        status: 'pending'
      }])
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({
      success: true,
      payout,
      message: 'Payout request submitted',
      ponchInsight: `💸 Payout requested: $${amount} - empire rewards flowing!`
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to request payout' },
      { status: 500 }
    )
  }
}

function generateAffiliateCode() {
  return 'CHV-' + Math.random().toString(36).substr(2, 8).toUpperCase()
}