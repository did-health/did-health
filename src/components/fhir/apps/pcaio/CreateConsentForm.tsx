import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Consent } from 'fhir/r4'

export default function CreateConsentForm({ onSubmit }: { onSubmit: (consent: Consent) => void }) {
  const [refuseDNR, setRefuseDNR] = useState(false)
  const [surrogateName, setSurrogateName] = useState('')
  const [surrogateRelationship, setSurrogateRelationship] = useState('')
  const [shareConsent, setShareConsent] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const consent: Consent = {
      resourceType: 'Consent',
      id: uuidv4(),
      status: 'active',
      scope: {
        coding: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/consentscope',
            code: 'adr', // advance directive
            display: 'Advance directive',
          },
        ],
      },
      category: [
        {
          coding: [
            {
              system: 'http://loinc.org',
              code: '57016-8',
              display: 'Advance directive',
            },
          ],
        },
      ],
      dateTime: new Date().toISOString(),
      provision: {
        type: 'permit',
        provision: [],
      },
    }

    if (refuseDNR) {
      consent.provision!.provision!.push({
        type: 'deny',
        code: [
          {
            coding: [
              {
                system: 'http://snomed.info/sct',
                code: '304253006',
                display: 'Cardiopulmonary resuscitation',
              },
            ],
          },
        ],
      })
    }

    if (shareConsent) {
      consent.provision!.provision!.push({
        type: 'permit',
        securityLabel: [
          {
            system: 'http://terminology.hl7.org/CodeSystem/v3-Confidentiality',
            code: 'N',
            display: 'Normal (shareable)',
          },
        ],
      })
    }

    if (surrogateName) {
      consent.provision!.actor = [
        {
          role: {
            coding: [
              {
                system: 'http://terminology.hl7.org/CodeSystem/consentactorrole',
                code: 'PATRGT',
                display: 'Personal Representative',
              },
            ],
          },
          reference: {
            display: `${surrogateName}${surrogateRelationship ? ` (${surrogateRelationship})` : ''}`,
          },
        },
      ]
    }

    onSubmit(consent)

    // Reset form
    setRefuseDNR(false)
    setSurrogateName('')
    setSurrogateRelationship('')
    setShareConsent(true)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white">🛡️ Consent Preferences</h3>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={refuseDNR}
          onChange={(e) => setRefuseDNR(e.target.checked)}
        />
        I do <strong>not</strong> consent to resuscitation (DNR)
      </label>

      <div>
        <label className="block text-sm font-medium">Surrogate Decision-Maker (Name)</label>
        <input
          type="text"
          className="input"
          placeholder="Jane Doe"
          value={surrogateName}
          onChange={(e) => setSurrogateName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Surrogate Relationship (optional)</label>
        <input
          type="text"
          className="input"
          placeholder="Daughter"
          value={surrogateRelationship}
          onChange={(e) => setSurrogateRelationship(e.target.value)}
        />
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={shareConsent}
          onChange={(e) => setShareConsent(e.target.checked)}
        />
        I consent to share my advance directive with all treating providers
      </label>

      <button type="submit" className="btn-primary w-full">➕ Create Consent</button>
    </form>
  )
}
