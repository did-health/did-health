import React from 'react';

interface MemberSearchProps {
  filters: {
    name?: string;
    zip?: string;
    specialty?: string;
  };
  onFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filtered: MemberEntry[];
  onSelectRecipient: (recipient: string) => void;
}

export interface MemberEntry {
  did: string;
  fhir: {
    name?: Array<{ text?: string }>;
    address?: Array<{ postalCode?: string }>;
    specialty?: Array<{ coding?: Array<{ display?: string }> }>;
  };
}

export function MemberSearch({ filters, onFilterChange, filtered, onSelectRecipient }: MemberSearchProps) {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">🩺 DAO Member Directory</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input className="input" name="name" placeholder="Name" onChange={onFilterChange} />
        <input className="input" name="zip" placeholder="ZIP Code" onChange={onFilterChange} />
        <input className="input" name="specialty" placeholder="Specialty" onChange={onFilterChange} />
      </div>
      <ul className="space-y-4">
        {filtered.map((entry: MemberEntry, index: number) => (
          <li key={index} className="p-4 border rounded shadow">
            <p><strong>DID:</strong> {entry.did}</p>
            <p><strong>Name:</strong> {entry.fhir.name?.[0]?.text || 'N/A'}</p>
            <p><strong>ZIP:</strong> {entry.fhir.address?.[0]?.postalCode || 'N/A'}</p>
            <p><strong>Specialty:</strong> {entry.fhir.specialty?.[0]?.coding?.[0]?.display || 'N/A'}</p>
            <button className="text-blue-600 underline mt-2" onClick={() => onSelectRecipient(entry.did)}>Message</button>
          </li>
        ))}
      </ul>
    </>
  );
}
