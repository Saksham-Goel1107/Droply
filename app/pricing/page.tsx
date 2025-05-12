import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing | Droply',
  description: 'Simple and transparent pricing plans for all your file sharing needs',
}

const plans = [
  {
    name: 'Free',
    price: '0',
    features: [
      '2 GB Storage',
      'Basic file sharing',
      'Email support',
      'Basic encryption',
      '5 GB monthly transfer',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '9.99',
    features: [
      '50 GB Storage',
      'Advanced file sharing',
      'Priority support',
      'End-to-end encryption',
      '100 GB monthly transfer',
      'File version history',
      'Custom branding',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '29.99',
    features: [
      'Unlimited Storage',
      'Team collaboration',
      '24/7 support',
      'Advanced security features',
      'Unlimited transfer',
      'Admin controls',
      'API access',
      'Custom integration',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function PricingPage() {
  return (
    <div className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, transparent pricing
          </h1>
          <p className="mt-6 text-xl text-gray-500">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg shadow-lg ${
                plan.popular
                  ? 'ring-2 ring-indigo-600 scale-105'
                  : 'ring-1 ring-gray-200'
              } bg-white px-6 py-8 relative flex flex-col`}
            >
              {plan.popular && (
                <div className="absolute top-0 -translate-y-1/2 rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                  Most Popular
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-4 flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">
                    ${plan.price}
                  </span>
                  <span className="ml-1 text-xl font-semibold text-gray-500">
                    /month
                  </span>
                </p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="h-6 w-6 flex-shrink-0 text-indigo-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span className="ml-3 text-base text-gray-500">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`mt-8 block w-full rounded-md px-4 py-2 text-center text-sm font-semibold ${
                  plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-gray-200 pt-16 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-6 text-base text-gray-500">
            Have a question that's not listed here?{' '}
            <a href="/contact" className="font-semibold text-indigo-600 hover:text-indigo-500">
              Contact our support team
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
