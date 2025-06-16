// components/CheckoutPayment.tsx
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ clientSecret, onPaymentSuccess }: { clientSecret: string, onPaymentSuccess: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (!stripe || !elements) return

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
      },
    })

    if (error) {
      setError(error.message || 'Payment failed.')
      setLoading(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onPaymentSuccess()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
      <div className="space-y-2">
        <label className="block font-semibold text-gray-700">Card Details</label>
        <div className="rounded-md border border-gray-300 bg-white p-3 focus-within:border-blue-400">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': {
                    color: '#a0aec0',
                  },
                },
                invalid: {
                  color: '#fa755a',
                },
              },
            }}
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="submit" disabled={loading || !stripe} className="w-36">
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4 mr-1" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Processing...
            </span>
          ) : (
            'Pay'
          )}
        </Button>
      </div>
    </form>
  )
}

export function CheckoutPayment({
  clientSecret,
  onPaymentSuccess,
}: {
  clientSecret: string
  onPaymentSuccess: () => void
}) {
  return (
    <div className="max-w-md mx-auto p-6 bg-white border rounded-2xl shadow space-y-4">
      <h2 className="text-xl font-semibold text-center">Payment</h2>
      <Elements stripe={stripePromise} options={{ clientSecret }}>
        <CheckoutForm clientSecret={clientSecret} onPaymentSuccess={onPaymentSuccess} />
      </Elements>
    </div>
  )
}
