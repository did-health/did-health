import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Observation } from 'fhir/r4'

export default function CreateAdvanceDirectiveObservationForm({ onSubmit }: { onSubmit: (obs: Observation) => void }) {
  const [text, setText] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const obs: Observation = {
      resourceType: 'Observation',
      id: uuidv4(),
      meta: {
        profile: ['http://hl7.org/fhir/us/pacio-adi/StructureDefinition/AdvanceDirectiveObservation'],
      },
      status: 'final',
      code: {
        coding: [
          { system: 'http://loinc.org', code: '81334-5', display: 'Advance directive' }
        ],
        text: 'Advance directive'
      },
      valueString: text,
    }
    onSubmit(obs)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-bold">📄 General Advance Directive</h3>
      <textarea value={text} onChange={(e) => setText(e.target.value)} required className="input" rows={4} />
      <button className="btn-primary">Add Advance Directive</button>
    </form>
  )
}
