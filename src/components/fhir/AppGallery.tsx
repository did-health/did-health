// components/fhir/AppGallery.tsx
import React from 'react'
import { didHealthApps } from './apps/index'
import type { App } from './apps/index'
import { useNavigate } from 'react-router-dom'
import Image from 'next/image' // If using Next.js
import logo from '../assets/did-health-logo.svg' // Adjust the path as needed

export default function AppGallery() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex flex-col items-center space-y-4 mb-8">
        <Image
          src={logo}
          alt="did:health Logo"
          width={120}
          height={120}
          className="rounded-lg"
        />
        <h1 className="text-4xl font-bold text-center text-indigo-600">🧩 Available did:health Apps</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {didHealthApps.map((app: App) => (
          <div 
            key={app.id} 
            className="border rounded-xl p-6 shadow-lg bg-white dark:bg-gray-900 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-indigo-700 mb-2">{app.title}</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 flex-grow">{app.description}</p>
              <div className="mt-4">
                <button
                  onClick={() => navigate(`/apps/${app.id}`)}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                >
                  <span className="mr-2">🚀</span>Launch App
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
