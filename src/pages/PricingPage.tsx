import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, Zap, Crown, ArrowRight, Shield, CreditCard, BadgeCheck, RefreshCw, ChevronDown, Mail, Lock, Building2 } from 'lucide-react'
import { useState } from 'react'
import { Tiles } from '@/components/ui/tiles'

interface PricingPlan {
  id: string
  name: string
  icon: React.ReactNode
  credits: number
  price: number
  popular?: boolean
  features: string[]
  color: string
  gradient: string
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    icon: <Sparkles className="w-6 h-6" />,
    credits: 50,
    price: 4.99,
    features: [
      '50 AI prompt generations',
      'Access to all 14 categories',
      'Save unlimited prompts',
      'Public gallery access',
      'Email support'
    ],
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10'
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: <Zap className="w-6 h-6" />,
    credits: 150,
    price: 12.99,
    popular: true,
    features: [
      '150 AI prompt generations',
      'Priority AI processing',
      'Advanced prompt templates',
      'Export prompts (JSON/CSV)',
      'Priority email support',
      'Early access to new features'
    ],
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10'
  },
  {
    id: 'ultimate',
    name: 'Ultimate',
    icon: <Crown className="w-6 h-6" />,
    credits: 500,
    price: 34.99,
    features: [
      '500 AI prompt generations',
      'Lightning-fast processing',
      'Custom prompt templates',
      'API access (coming soon)',
      'Advanced analytics dashboard',
      'Dedicated support',
      'All future features included'
    ],
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-br from-amber-500/10 to-orange-500/10'
  }
]

function FaqAccordionItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.7 + index * 0.1 }}
      className="rounded-xl bg-[#1A1A1A] border-2 border-[#333333] shadow-[4px_4px_0px_0px_#000] overflow-hidden hover:border-[#FFD700]/40 transition-colors"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left"
      >
        <h3 className="text-lg font-semibold text-white pr-4">{question}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-[#A1A1AA] flex-shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <p className="px-6 pb-6 text-[#A1A1AA]">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId)
    // TODO: Integrate payment gateway (Stripe/Razorpay)
    console.log('Purchase plan:', planId)
  }

  return (
    <div className="relative min-h-screen bg-[#0A0A0A]">
      <div className="fixed inset-0 z-0">
        <Tiles />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#FFD700]/10 border border-[#FFD700]/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#FFD700]" />
            <span className="text-sm font-medium text-[#FFD700] font-mono uppercase tracking-wider">
              Simple, Transparent Pricing
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white font-mono uppercase tracking-tight">
            Choose Your <span className="text-[#FFD700]">Perfect Plan</span>
          </h1>
          
          <p className="text-xl text-[#A1A1AA] max-w-2xl mx-auto">
            Get more credits and unlock premium features. All plans include access to our powerful AI models.
          </p>

          {/* Free Tier Reminder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30"
          >
            <Check className="w-5 h-5 text-[#FFD700]" />
            <span className="text-[#FFD700] font-medium font-mono">
              Already enjoying 7 free credits as a registered user!
            </span>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="relative"
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-0 right-0 flex justify-center z-10">
                  <span className="px-4 py-1 rounded-full bg-[#FFD700] text-[#0A0A0A] text-sm font-bold font-mono uppercase tracking-wider shadow-[2px_2px_0px_0px_#000]">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`
                  relative h-full p-8 rounded-2xl border-2 
                  ${plan.popular 
                    ? 'border-[#FFD700] bg-[rgba(255,215,0,0.05)] shadow-[8px_8px_0px_0px_rgba(255,215,0,0.3)]' 
                    : 'border-[#333333] shadow-[8px_8px_0px_0px_#000]'
                  }
                  bg-[#1A1A1A]
                  transition-all duration-300 hover:border-[#FFD700]/60
                `}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-white mb-2 font-mono uppercase">
                  {plan.name}
                </h3>

                {/* Credits */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-[#FFD700] font-mono">
                    ${plan.price}
                  </span>
                  <span className="text-[#A1A1AA]">
                    / {plan.credits} credits
                  </span>
                </div>

                {/* Price per credit */}
                <div className="text-sm text-[#A1A1AA] mb-6 font-mono">
                  ${(plan.price / plan.credits).toFixed(3)} per generation
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5" />
                      <span className="text-[#A1A1AA]">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handlePurchase(plan.id)}
                  disabled={selectedPlan === plan.id}
                  className={`
                    w-full py-4 rounded-xl font-bold text-lg border-2
                    flex items-center justify-center gap-2
                    transition-all duration-300 transform font-mono uppercase tracking-wider
                    ${plan.popular
                      ? 'bg-[#FFD700] text-[#0A0A0A] border-[#000] shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-y-1'
                      : 'bg-[#1A1A1A] text-white border-[#333333] shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-y-1 hover:border-[#FFD700]'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {selectedPlan === plan.id ? 'Processing...' : 'Get Started'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section with Accordion */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white font-mono uppercase tracking-tight">
            Frequently Asked <span className="text-[#FFD700]">Questions</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "What happens when I run out of credits?",
                a: "You can purchase more credits anytime. Your unused credits never expire and roll over to the next month."
              },
              {
                q: "Can I change plans later?",
                a: "Absolutely! You can upgrade or purchase additional credits whenever you need them. All credits are cumulative."
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with your purchase."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and digital wallets through our secure payment processor."
              }
            ].map((faq, i) => (
              <FaqAccordionItem key={i} question={faq.q} answer={faq.a} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Enterprise Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <div className="relative p-8 md:p-12 rounded-2xl border-2 border-[#A855F7] bg-[#1A1A1A] shadow-[8px_8px_0px_0px_rgba(168,85,247,0.3)]">
            <div className="absolute top-0 right-0 p-6 opacity-5">
              <Building2 className="w-40 h-40" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <Building2 className="w-8 h-8 text-[#A855F7]" />
                <h2 className="text-3xl font-bold text-white font-mono uppercase">
                  Enterprise <span className="text-[#A855F7]">Solutions</span>
                </h2>
              </div>
              <p className="text-lg text-[#A1A1AA] mb-8 max-w-2xl">
                Need custom solutions for your team? We offer tailored packages for organizations.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                {[
                  'Custom credit packages',
                  'Team management',
                  'API access',
                  'Dedicated support',
                  'SLA guarantees',
                  'White-label options'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-[#A1A1AA]">
                    <Check className="w-4 h-4 text-[#A855F7] flex-shrink-0" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
              <a
                href="mailto:contact@vibeprompting.com"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-lg bg-[#A855F7] text-white border-2 border-[#000] shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-y-1 transition-all font-mono uppercase tracking-wider"
              >
                <Mail className="w-5 h-5" />
                Contact Sales
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </motion.div>

        {/* How Credits Work */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          className="mt-24 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-white font-mono uppercase tracking-tight">
            How Credits <span className="text-[#FFD700]">Work</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { tier: 'Basic', credits: 5, desc: 'Perfect for quick tasks', features: ['Core concept', 'Tech stack', 'Basic requirements'] },
              { tier: 'Advanced', credits: 3, desc: 'Most popular choice', features: ['Detailed specs', 'Error handling', 'Best practices'] },
              { tier: 'Expert', credits: 2, desc: 'Best value per credit', features: ['Full system design', 'Testing & QA', 'Deploy guide'] },
            ].map((t, i) => (
              <motion.div
                key={t.tier}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="p-6 rounded-xl bg-[#1A1A1A] border-2 border-[#333333] shadow-[4px_4px_0px_0px_#000] hover:border-[#FFD700]/40 transition-colors"
              >
                <h3 className="text-xl font-bold text-white mb-1 font-mono uppercase">{t.tier}</h3>
                <div className="text-3xl font-black text-[#FFD700] mb-1 font-mono">{t.credits} Credits</div>
                <p className="text-sm text-[#A1A1AA] mb-4">{t.desc}</p>
                <ul className="space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                      <Check className="w-4 h-4 text-[#FFD700] flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust & Security Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-24 mb-8"
        >
          <h2 className="text-xl font-bold text-center mb-8 text-[#A1A1AA] font-mono uppercase tracking-wider">
            Trust & Security
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Lock, label: 'Secure SSL', sub: '256-bit encryption' },
              { icon: CreditCard, label: 'Encrypted Payments', sub: 'PCI compliant' },
              { icon: BadgeCheck, label: 'Verified Merchant', sub: 'Trusted platform' },
              { icon: RefreshCw, label: 'Guaranteed Refund', sub: '7-day money back' },
            ].map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0 + i * 0.05 }}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1A1A1A] border-2 border-[#333333] shadow-[3px_3px_0px_0px_#000] hover:border-[#FFD700]/40 transition-colors"
              >
                <badge.icon className="w-8 h-8 text-[#FFD700]" />
                <span className="text-sm font-bold text-white text-center">{badge.label}</span>
                <span className="text-xs text-[#A1A1AA] text-center">{badge.sub}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
