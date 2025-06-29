import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Endpoint } from 'fhir/r4'

interface CreateEndpointFormProps {
  onSubmit: (endpoint: Endpoint) => void
}

const CreateEndpointForm: React.FC<CreateEndpointFormProps> = ({ onSubmit }) => {
  const [address, setAddress] = useState('')
  const [directEmail, setDirectEmail] = useState('')
  const [orgReference, setOrgReference] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newEndpoint: Endpoint = {
      resourceType: 'Endpoint',
      id: uuidv4(),
      status: 'active',
      connectionType: {
        system: 'http://terminology.hl7.org/CodeSystem/endpoint-connection-type',
        code: 'hl7-fhir-rest',
        display: 'FHIR REST',
      },
      name: 'FHIR Server Endpoint',
      payloadType: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/endpoint-payload-type',
              code: 'application/fhir+json',
              display: 'FHIR JSON'
            }
          ]
        }
      ],
      address,
      contact: directEmail
        ? [{ system: 'email', value: directEmail, use: 'work' }]
        : undefined,
      managingOrganization: orgReference
        ? { reference: `Organization/${orgReference}` }
        : undefined,
    }

    onSubmit(newEndpoint)

    // Reset form
    setAddress('')
    setDirectEmail('')
    setOrgReference('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">📡 Add Endpoint</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">FHIR Server URL</label>
        <input
          type="url"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          className="input"
          placeholder="https://example.com/fhir"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Direct Email (optional)</label>
        <input
          type="email"
          value={directEmail}
          onChange={(e) => setDirectEmail(e.target.value)}
          className="input"
          placeholder="provider@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Organization Reference (optional)</label>
        <input
          type="text"
          value={orgReference}
          onChange={(e) => setOrgReference(e.target.value)}
          className="input"
          placeholder="Org ID (e.g. abc123)"
        />
      </div>

      <button type="submit" className="btn-primary w-full">➕ Add Endpoint</button>
    </form>
  )
}

export default CreateEndpointForm
