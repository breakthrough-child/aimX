'use client'

import { useState } from 'react'
import { currencyOptions } from '@/app/api/lib/paymentProvider'

export default function CurrencySelector() {
  const [selectedCurrency, setSelectedCurrency] = useState('')
  const selected = currencyOptions.find(c => c.code === selectedCurrency)

  return (
    <div className="space-y-4">
      <select
        className="w-full border px-4 py-2 rounded"
        onChange={(e) => setSelectedCurrency(e.target.value)}
        value={selectedCurrency}
      >
        <option value="">Select Currency</option>
        {currencyOptions.map(currency => (
          <option key={currency.code} value={currency.code}>
            {currency.name} ({currency.code})
          </option>
        ))}
      </select>

      {selected && (
        <div>
          <p className="font-medium">Available Payment Providers:</p>
          <ul className="list-disc ml-5">
            {selected.providers.map(p => (
              <li key={p}>{p.toUpperCase()}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
