import { useState, useEffect } from 'react'
import API from '../api/axios'
import useAuthStore from '../store/authStore'

const PLANS = [
 {
 id: 'free',
 name: 'Free',
 icon: '🌱',
 price_monthly: 0,
 price_yearly: 0,
 color: '#111827',
 features: [
 { text: '5 Free Courses', included: true },
 { text: 'Basic Quiz Access', included: true },
 { text: 'Code Playground', included: true },
 { text: 'Community Support', included: true },
 { text: 'AI Doubt Solver', included: false },
 { text: 'Mock Interviews', included: false },
 { text: 'Resume Builder', included: false },
 { text: 'Certificate', included: false },
 ],
 popular: false,
 },
 {
 id: 'premium',
 name: 'Premium',
 icon: '⭐',
 price_monthly: 299,
 price_yearly: 2499,
 color: '#6c47ff',
 features: [
 { text: 'All Courses Unlimited', included: true },
 { text: 'AI Doubt Solver', included: true },
 { text: 'Mock Interviews', included: true },
 { text: 'Resume Builder', included: true },
 { text: 'Certificate Generation', included: true },
 { text: 'Priority Support', included: true },
 { text: '1-on-1 Mentor Sessions', included: false },
 { text: 'Job Placement Assistance', included: false },
 ],
 popular: true,
 },
 {
 id: 'pro',
 name: 'Pro',
 icon: '💎',
 price_monthly: 599,
 price_yearly: 4999,
 color: '#f59e0b',
 features: [
 { text: 'Everything in Premium', included: true },
 { text: '1-on-1 Mentor Sessions', included: true },
 { text: 'Job Placement Assistance', included: true },
 { text: 'Live Classes Access', included: true },
 { text: 'Custom Learning Path', included: true },
 { text: 'Interview Guarantee', included: true },
 { text: 'Dedicated Career Coach', included: true },
 { text: 'Salary Negotiation Help', included: true },
 ],
 popular: false,
 },
]

export default function Pricing() {
 const [billing, setBilling] = useState('monthly')
 const [loading, setLoading] = useState(null)
 const [currentPlan, setCurrentPlan] = useState('free')
 const { user } = useAuthStore()

 useEffect(() => {
 const fetchSub = async () => {
 try {
 const res = await API.get('/subscriptions/my/')
 setCurrentPlan(res.data.plan || 'free')
 } catch {
 setCurrentPlan(user?.subscription_plan || 'free')
 }
 }
 fetchSub()
 }, [])

 const handleSubscribe = async (plan) => {
 if (plan.id === 'free') return
 if (plan.id === currentPlan) return

 setLoading(plan.id)

 try {
 // Step 1: Backend order create 
 const res = await API.post('/subscriptions/create-order/', {
 plan_id: plan.id,
 billing,
 })

 const { order_id, amount, key } = res.data

 // Step 2: Razorpay checkout open 
 const options = {
 key: key || 'rzp_test_YOUR_KEY_HERE', //.env 
 amount,
 currency: 'INR',
 name: 'TJ Tech Academy Pro',
 description: `${plan.name} Plan — ${billing}`,
 image: '🚀',
 order_id,
 handler: async (response) => {
 // Step 3: Payment verify 
 try {
 const verifyRes = await API.post('/subscriptions/verify-payment/', {
 razorpay_payment_id: response.razorpay_payment_id,
 razorpay_order_id: response.razorpay_order_id,
 razorpay_signature: response.razorpay_signature,
 plan_id: plan.id,
 billing,
 })
 if (verifyRes.data.success) {
 setCurrentPlan(plan.id)
 alert(`🎉 ${plan.name} Plan activated successfully!\n\nTJ Tech Academy Pro welcome!`)
 }
 } catch {
 alert('❌ Payment verification failed. Support contact.')
 }
 },
 prefill: {
 name: user?.first_name || '',
 email: user?.email || '',
 contact: user?.phone || '',
 },
 theme: { color: plan.color },
 modal: {
 ondismiss: () => setLoading(null),
 },
 }

 // Razorpay script load 
 if (!window.Razorpay) {
 await new Promise((resolve, reject) => {
 const script = document.createElement('script')
 script.src = 'https://checkout.razorpay.com/v1/checkout.js'
 script.onload = resolve
 script.onerror = () => reject(new Error('Razorpay load failed'))
 document.head.appendChild(script)
 })
 }

 const rzp = new window.Razorpay(options)
 rzp.open()

 } catch (err) {
 // Demo mode — backend 
 alert(`🔧 Demo Mode:\n\nRazorpay keys setup.\n\n.env :\nRAZORPAY_KEY_ID=rzp_test_xxx\nRAZORPAY_KEY_SECRET=xxx\n\nRazorpay dashboard: dashboard.razorpay.com`)
 } finally {
 setLoading(null)
 }
 }

 const getPrice = (plan) => {
 if (plan.price_monthly === 0) return 'Free'
 const price = billing === 'yearly' ? plan.price_yearly : plan.price_monthly
 return `₹${price.toLocaleString()}`
 }

 const getSavings = (plan) => {
 if (plan.price_monthly === 0) return null
 const monthly12 = plan.price_monthly * 12
 const savings = monthly12 - plan.price_yearly
 const pct = Math.round((savings / monthly12) * 100)
 return pct
 }

 return (
 <div style={{ maxWidth: 1000, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
 <style>{`
 @keyframes fadeUp {
 from { opacity: 0; transform: translateY(14px); }
 to { opacity: 1; transform: translateY(0); }
 }
 @keyframes glow {
 0%,100% { box-shadow: 0 0 12px #6366f130; }
 50% { box-shadow: 0 0 28px #f97316; }
 }
 `}</style>

 {/* ── HEADER ── */}
 <div style={{ textAlign: 'center', marginBottom: '2rem', animation: 'fadeUp 0.3s ease both' }}>
 <div style={{
 display: 'inline-block', background: '#f5f3ff',
 color: '#6c47ff', border: '1px solid #6366f140',
 borderRadius: 20, padding: '4px 16px', fontSize: 12,
 fontWeight: 700, marginBottom: 12,
 }}>💎 PRICING PLANS</div>
 <h1 style={{ color: '#000000', fontSize: 28, fontWeight: 800, margin: '0 0 8px' }}>
 Learning Journey Upgrade 
 </h1>
 <p style={{ color: '#111827', fontSize: 15, margin: 0 }}>
 goals best plan choose — cancel anytime!
 </p>
 </div>

 {/* ── CURRENT PLAN BANNER ── */}
 {currentPlan!== 'free' && (
 <div style={{
 background: 'linear-gradient(135deg, #f5f3ff, #ffffff)',
 border: '1px solid #6366f140', borderRadius: 12,
 padding: '12px 20px', marginBottom: '1.5rem',
 display: 'flex', alignItems: 'center', gap: 10,
 animation: 'fadeUp 0.3s ease 0.05s both',
 }}>
 <span style={{ fontSize: 20 }}>✅</span>
 <span style={{ color: '#6c47ff', fontWeight: 700 }}>
 Current Plan: {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
 </span>
 <span style={{ color: '#111827', fontSize: 13 }}>— Active subscription </span>
 </div>
 )}

 {/* ── BILLING TOGGLE ── */}
 <div style={{
 display: 'flex', justifyContent: 'center',
 alignItems: 'center', gap: 12, marginBottom: '2rem',
 animation: 'fadeUp 0.3s ease 0.1s both',
 }}>
 <span style={{
 color: billing === 'monthly' ? '#6c47ff' : '#374151',
 fontSize: 14, fontWeight: 600,
 }}>Monthly</span>

 {/* Toggle switch */}
 <div
 onClick={() => setBilling(b => b === 'monthly' ? 'yearly' : 'monthly')}
 style={{
 width: 52, height: 28, borderRadius: 14,
 background: billing === 'yearly' ? '#6c47ff' : '#e5e7eb',
 cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
 border: '1px solid #ddd6fe',
 }}
 >
 <div style={{
 width: 22, height: 22, borderRadius: '50%', background: '#fff',
 position: 'absolute', top: 2,
 left: billing === 'yearly' ? 26 : 3,
 transition: 'left 0.2s',
 }} />
 </div>

 <span style={{
 color: billing === 'yearly'  ? '#6c47ff' : '#374151',
 fontSize: 14, fontWeight: 600,
 }}>
 Yearly
 <span style={{
 marginLeft: 6, background: '#10b98120', color: '#10b981',
 border: '1px solid #10b98140', borderRadius: 10,
 padding: '2px 8px', fontSize: 11, fontWeight: 700,
 }}>Save up to 30%</span>
 </span>
 </div>

 {/* ── PLANS GRID ── */}
 <div style={{
 display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
 gap: 16, marginBottom: '2rem',
 animation: 'fadeUp 0.3s ease 0.15s both',
 }}>
 {PLANS.map((plan, idx) => {
 const isCurrentPlan = currentPlan === plan.id
 const savings = billing === 'yearly' ? getSavings(plan) : null

 return (
 <div
 key={plan.id}
 style={{
 background: plan.popular ? 'linear-gradient(135deg, #f5f3ff, #ffffff)' : '#ffffff',
 border: `2px solid ${plan.popular ? plan.color : isCurrentPlan ? '#10b981' : '#ede9fe'}`,
 borderRadius: 16, padding: '1.5rem',
 position: 'relative', overflow: 'hidden',
 animation: plan.popular ? 'glow 3s ease infinite' : 'none',
 animationDelay: `${idx * 0.1}s`,
 }}
 >
 {/* Popular badge */}
 {plan.popular && (
 <div style={{
 position: 'absolute', top: 0, right: 0,
 background: plan.color, color: '#fff',
 fontSize: 11, fontWeight: 700, padding: '4px 14px',
 borderBottomLeftRadius: 10,
 }}>⭐ MOST POPULAR</div>
 )}

 {/* Current plan badge */}
 {isCurrentPlan && (
 <div style={{
 position: 'absolute', top: 0, left: 0,
 background: '#10b981', color: '#fff',
 fontSize: 10, fontWeight: 700, padding: '3px 10px',
 borderBottomRightRadius: 8,
 }}>✅ CURRENT</div>
 )}

 {/* Plan header */}
 <div style={{ marginBottom: '1.2rem', marginTop: plan.popular || isCurrentPlan ? 12 : 0 }}>
 <div style={{ fontSize: 28, marginBottom: 6 }}>{plan.icon}</div>
 <div style={{ color: '#000000', fontSize: 18, fontWeight: 800 }}>{plan.name}</div>
 </div>

 {/* Price */}
 <div style={{ marginBottom: '1.2rem' }}>
 <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
 <span style={{ color: plan.color, fontSize: 32, fontWeight: 800 }}>
 {getPrice(plan)}
 </span>
 {plan.price_monthly > 0 && (
 <span style={{ color: '#111827', fontSize: 13 }}>
 /{billing === 'yearly' ? 'year' : 'month'}
 </span>
 )}
 </div>
 {billing === 'yearly' && savings && (
 <div style={{ color: '#10b981', fontSize: 12, marginTop: 2 }}>
 🎉 ₹{(plan.price_monthly * 12 - plan.price_yearly).toLocaleString()} savings ({savings}% off)
 </div>
 )}
 {billing === 'yearly' && plan.price_monthly > 0 && (
 <div style={{ color: '#111827', fontSize: 11, marginTop: 2 }}>
 ≈ ₹{Math.round(plan.price_yearly / 12)}/month
 </div>
 )}
 </div>

 {/* Features */}
 <div style={{ marginBottom: '1.5rem' }}>
 {plan.features.map((f, i) => (
 <div key={i} style={{
 display: 'flex', alignItems: 'center', gap: 8,
 marginBottom: 7, opacity: f.included ? 1 : 0.35,
 }}>
 <span style={{
 width: 18, height: 18, borderRadius: '50%',
 background: f.included ? '#10b98120' : '#f3f4f6',
 border: `1px solid ${f.included ? '#10b98140' : '#d1d5db'}`,
 display: 'flex', alignItems: 'center', justifyContent: 'center',
 fontSize: 10, flexShrink: 0,
 color: f.included ? '#10b981' : '#4b5563',
 }}>
 {f.included ? '✓' : '✕'}
 </span>
 <span style={{ color: f.included ? '#111827' : '#9ca3af', fontSize: 13 }}>
 {f.text}
 </span>
 </div>
 ))}
 </div>

 {/* CTA Button */}
 <button
 onClick={() => handleSubscribe(plan)}
 disabled={loading === plan.id || isCurrentPlan}
 style={{
 width: '100%', padding: '12px',
 background: isCurrentPlan
 ? '#10b98120'
 : plan.id === 'free'
 ? '#f5f3ff'
 : loading === plan.id
 ? '#f5f3ff'
 : `linear-gradient(135deg, ${plan.color}, ${plan.color}cc)`,
 color: isCurrentPlan
 ? '#10b981'
 : plan.id === 'free'
 ? '#4b5563'
 : loading === plan.id
 ? '#4b5563'
 : '#fff',
 border: isCurrentPlan ? '1px solid #10b98140' : 'none',
 borderRadius: 10, cursor: isCurrentPlan || plan.id === 'free' ? 'default' : 'pointer',
 fontSize: 14, fontWeight: 700, fontFamily: 'inherit',
 transition: 'opacity 0.15s',
 }}
 >
 {loading === plan.id
 ? '⏳ Processing...'
 : isCurrentPlan
 ? '✅ Current Plan'
 : plan.id === 'free'
 ? 'Get Started Free'
 : `Upgrade to ${plan.name} →`}
 </button>
 </div>
 )
 })}
 </div>

 {/* ── FAQ ── */}
 <div style={{
 background: '#ffffff', border: '1px solid #ede9fe',
 borderRadius: 16, padding: '1.5rem',
 animation: 'fadeUp 0.3s ease 0.2s both',
 }}>
 <h3 style={{ color: '#000000', fontSize: 16, fontWeight: 800, marginBottom: '1rem' }}>
 ❓ Frequently Asked Questions
 </h3>
 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
 {[
 { q: 'Payment safe ?', a: '! Razorpay — India most trusted payment gateway. SSL encrypted.' },
 { q: 'Cancel ?', a: 'Anytime cancel. Remaining days refund policy apply.' },
 { q: 'EMI option ?', a: 'Yearly plan credit card EMI available (Razorpay ).' },
 { q: 'Free trial ?', a: 'Free plan permanently free. Premium 7-day trial coming soon!' },
 ].map((faq, i) => (
 <div key={i} style={{ borderLeft: '2px solid #6366f140', paddingLeft: 12 }}>
 <div style={{ color: '#000000', fontSize: 13, fontWeight: 700, marginBottom: 4 }}>
 {faq.q}
 </div>
 <div style={{ color: '#111827', fontSize: 12, lineHeight: 1.5 }}>{faq.a}</div>
 </div>
 ))}
 </div>
 </div>

 {/* ── RAZORPAY SETUP NOTE ── */}
 <div style={{
 marginTop: 16, padding: '12px 16px',
 background: '#f59e0b10', border: '1px solid #f59e0b30',
 borderRadius: 10, fontSize: 12, color: '#f59e0b',
 animation: 'fadeUp 0.3s ease 0.25s both',
 }}>
 <strong>⚙️ Setup Reminder:</strong>.env {''}
 <code style={{ background: '#faf9ff', padding: '1px 6px', borderRadius: 4 }}>
 RAZORPAY_KEY_ID
 </code>{''}
 {''}
 <code style={{ background: '#faf9ff', padding: '1px 6px', borderRadius: 4 }}>
 RAZORPAY_KEY_SECRET
 </code>{''}
 add — dashboard.razorpay.com.
 </div>
 </div>
 )
}