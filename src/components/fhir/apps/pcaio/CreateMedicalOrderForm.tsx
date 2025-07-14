import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { ServiceRequest } from 'fhir/r4'

export default function CreateMedicalOrderForm({ onSubmit }: { onSubmit: (order: ServiceRequest) => void }) {
  const [instruction, setInstruction] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const order: ServiceRequest = {
      resourceType: 'ServiceRequest',
      id: uuidv4(),
      status: 'active',
      intent: 'order',
      subject: {
        reference: 'Patient/123' // This should be replaced with the actual patient reference
      },
      code: {
        coding: [
          { system: 'http://loinc.org', code: '100823-3', display: 'Portable medical order' }
        ],
        text: 'Portable medical order'
      },
      note: [{ text: instruction }],
    }
    onSubmit(order)
    setInstruction('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold">📝 Portable Medical Order</h3>
      <textarea value={instruction} onChange={(e) => setInstruction(e.target.value)} required className="input" rows={4} />
      <button className="btn-primary">Add Medical Order</button>
    </form>
  )
}
