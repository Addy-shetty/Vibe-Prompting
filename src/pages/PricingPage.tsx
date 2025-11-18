import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, Crown, ArrowRight } from 'lucide-react'
import { useState } from 'react'

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

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handlePurchase = (planId: string) => {
    setSelectedPlan(planId)
    // TODO: Integrate payment gateway (Stripe/Razorpay)
    console.log('Purchase plan:', planId)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
              Simple, Transparent Pricing
            </span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            Choose Your Perfect Plan
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Get more credits and unlock premium features. All plans include access to our powerful AI models.
          </p>

          {/* Free Tier Reminder */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
          >
            <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className="text-green-700 dark:text-green-300 font-medium">
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
                  <span className="px-4 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div
                className={`
                  relative h-full p-8 rounded-2xl border-2 
                  ${plan.popular 
                    ? 'border-purple-500 dark:border-purple-400 shadow-xl shadow-purple-500/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                  }
                  ${plan.gradient}
                  backdrop-blur-sm transition-all duration-300
                `}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${plan.color} text-white mb-4`}>
                  {plan.icon}
                </div>

                {/* Plan Name */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {plan.name}
                </h3>

                {/* Credits */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-5xl font-bold text-gray-900 dark:text-white">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    / {plan.credits} credits
                  </span>
                </div>

                {/* Price per credit */}
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                  ${(plan.price / plan.credits).toFixed(3)} per generation
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
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
                    w-full py-4 rounded-xl font-semibold text-lg
                    flex items-center justify-center gap-2
                    transition-all duration-300 transform hover:scale-105
                    ${plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-purple-500/30'
                      : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100'
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

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-24 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
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
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="p-6 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>7-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-green-600" />
              <span>Credits Never Expire</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
