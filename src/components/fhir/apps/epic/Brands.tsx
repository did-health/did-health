import React, { useState, useEffect } from 'react';
import type { Bundle, Organization, Endpoint, Reference } from 'fhir/r4b';
import Fuse from 'fuse.js';

type OrganizationSearchResult = {
  item: { resource: Organization };
};

export default function EpicBrands() {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<{ org: Organization; endpoints: Endpoint[] }[]>([]);

  useEffect(() => {
    fetch('/brands/user-access-brands-endpoint-bundle.json')
      .then((res) => res.json())
      .then((data: Bundle) => setBundle(data))
      .catch((err) => console.error('Failed to load bundle:', err));
  }, []);

  useEffect(() => {
    if (!bundle || !searchTerm) {
      setFilteredResults([]);
      return;
    }

    const orgEntries = bundle.entry?.filter((e) => e.resource?.resourceType === 'Organization') as { resource: Organization }[];
    const endpointEntries = bundle.entry?.filter((e) => e.resource?.resourceType === 'Endpoint') as { resource: Endpoint }[];
    const endpointMap = new Map<string, Endpoint>();
    endpointEntries.forEach((e) => endpointMap.set(e.resource.id!, e.resource));

    const provOrgs = orgEntries.filter(({ resource }) =>
      resource.type?.some((t) => t.coding?.some((c) => c.code === 'prov'))
    );

    const fuse = new Fuse(provOrgs, {
      keys: ['resource.name', 'resource.address.0.state', 'resource.address.0.postalCode'],
      threshold: 0.4,
      includeScore: true,
    });

    const results = fuse.search(searchTerm).map(({ item }: OrganizationSearchResult) => {
      const org = item.resource;
      const endpoints = org.endpoint
        ?.map((ref: Reference) => ref.reference?.split(':').pop())
        .map((id) => endpointMap.get(id!))
        .filter((e): e is Endpoint => !!e) || [];
      return { org, endpoints };
    });

    setFilteredResults(results);
  }, [searchTerm, bundle]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Search Epic FHIR Brands</h2>
      <input
        type="text"
        placeholder="Search by name, state, or zip..."
        className="w-full border p-2 rounded mb-6"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredResults.map(({ org, endpoints }) => (
        <div
          key={org.id}
          className="border border-gray-300 rounded-lg p-4 mb-4 shadow-sm bg-white"
        >
          <h3 className="text-xl font-semibold">{org.name}</h3>
          <p className="text-sm text-gray-600">
            <strong>Type:</strong> Provider
          </p>
          {org.address?.[0]?.state && (
            <p className="text-sm text-gray-600">
              <strong>State:</strong> {org.address[0].state}
            </p>
          )}
          {org.address?.[0]?.postalCode && (
            <p className="text-sm text-gray-600">
              <strong>ZIP:</strong> {org.address[0].postalCode}
            </p>
          )}

          {endpoints.map((endpoint, idx) => (
            <div key={idx} className="mt-2 p-2 border border-gray-200 rounded">
              <p className="text-sm">
                <strong>FHIR Endpoint:</strong>{' '}
                <a
                  href={endpoint.address}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {endpoint.address}
                </a>
              </p>
              {endpoint.managingOrganization?.display && (
                <p className="text-sm text-gray-600">
                  <strong>Managed by:</strong> {endpoint.managingOrganization.display}
                </p>
              )}
              {endpoint.contact?.[0]?.value && (
                <p className="text-sm text-gray-600">
                  <strong>Contact:</strong>{' '}
                  <a
                    href={endpoint.contact[0].value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                  >
                    {endpoint.contact[0].value}
                  </a>
                </p>
              )}
              {endpoint.extension?.find((ext) =>
                ext.url.includes('endpoint-fhir-version')
              )?.valueCode && (
                <p className="text-sm text-gray-600">
                  <strong>FHIR Version:</strong>{' '}
                  {
                    endpoint.extension.find((ext) =>
                      ext.url.includes('endpoint-fhir-version')
                    )?.valueCode
                  }
                </p>
              )}
            </div>
          ))}
        </div>
      ))}

      {searchTerm && filteredResults.length === 0 && (
        <p className="text-gray-500">No matching providers found.</p>
      )}
    </div>
  );
}
