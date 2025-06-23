import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { gql, request } from 'graphql-request';

const GRAPH_ENDPOINT = 'https://api.studio.thegraph.com/query/114229/sepolia/v.0.0.1';

const GET_ALL_URIS = gql`
  {
    didregisteredEntities(first: 1000) {
      id
      ipfsUri
    }
  }
`;

type FhirResource = {
  resourceType: string;
  name?: { text?: string }[];
  address?: { postalCode?: string }[];
  specialty?: { coding?: { display?: string }[] }[];
};

const PractitionerSearch: React.FC = () => {
  const [entries, setEntries] = useState<FhirResource[]>([]);
  const [filtered, setFiltered] = useState<FhirResource[]>([]);
  const [filters, setFilters] = useState({ name: '', zip: '', specialty: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await request(GRAPH_ENDPOINT, GET_ALL_URIS) as { didregisteredEntities: { id: string; ipfsUri: string }[] };
        const uris: string[] = data.didregisteredEntities.map((e: any) => e.ipfsUri);
        const results: FhirResource[] = [];

        for (const uri of uris) {
          try {
            const res = await axios.get(uri);
            if (
              res.data.resourceType === 'Practitioner' ||
              res.data.resourceType === 'Organization'
            ) {
              results.push(res.data);
            }
          } catch (err) {
            console.warn(`Failed to fetch or parse: ${uri}`);
          }
        }

        setEntries(results);
        setFiltered(results);
      } catch (err) {
        console.error('Graph query failed:', err);
      }
    };

    fetchData();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updated = { ...filters, [name]: value.toLowerCase() };
    setFilters(updated);

    const matches = entries.filter((entry) => {
      const nameMatch = entry.name?.[0]?.text?.toLowerCase().includes(updated.name);
      const zipMatch = entry.address?.[0]?.postalCode?.toLowerCase().includes(updated.zip);
      const specialtyMatch =
        entry.specialty?.[0]?.coding?.[0]?.display?.toLowerCase().includes(updated.specialty);

      return (
        (!updated.name || nameMatch) &&
        (!updated.zip || zipMatch) &&
        (!updated.specialty || specialtyMatch)
      );
    });

    setFiltered(matches);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Practitioner & Organization Search</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <input
          className="border p-2 rounded"
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          className="border p-2 rounded"
          type="text"
          name="zip"
          placeholder="Search by ZIP code"
          value={filters.zip}
          onChange={handleFilterChange}
        />
        <input
          className="border p-2 rounded"
          type="text"
          name="specialty"
          placeholder="Search by specialty"
          value={filters.specialty}
          onChange={handleFilterChange}
        />
      </div>

      <ul className="space-y-4">
        {filtered.map((entry, index) => (
          <li key={index} className="p-4 border rounded shadow">
            <p><strong>Type:</strong> {entry.resourceType}</p>
            <p><strong>Name:</strong> {entry.name?.[0]?.text || 'N/A'}</p>
            <p><strong>ZIP Code:</strong> {entry.address?.[0]?.postalCode || 'N/A'}</p>
            <p><strong>Specialty:</strong> {entry.specialty?.[0]?.coding?.[0]?.display || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PractitionerSearch;
