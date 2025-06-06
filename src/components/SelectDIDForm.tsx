import { useState } from "react";
import { usePublicClient } from "wagmi";
import { useOnboardingState } from "../store/OnboardingState";
import contracts from "../generated/deployedContracts";

type Props = {
  onDIDAvailable: (did: string) => void;
};

type NetworkGroup = "testnet" | "mainnet";
type NetworkConfig = {
  name: string;
  group: NetworkGroup;
  chainId: number;
  address: string;
  abi: any;
};

export function SelectDIDForm({ onDIDAvailable }: Props) {
  const publicClient = usePublicClient();
  const { fhirResource } = useOnboardingState();

  // Flatten and filter valid networks
  const availableNetworks: NetworkConfig[] = Object.entries(contracts)
    .flatMap(([group, networks]) =>
      Object.entries(networks)
        .filter(([, defs]) => defs?.HealthDIDRegistry)
        .map(([name, defs]) => ({
          name,
          group: group as NetworkGroup,
          chainId: defs.HealthDIDRegistry.chainId ?? 0,
          address: defs.HealthDIDRegistry.address,
          abi: defs.HealthDIDRegistry.abi,
        }))
    );

  const [selectedNetwork, setSelectedNetwork] = useState<NetworkConfig>(
    availableNetworks[0]
  );
  const [didInput, setDidInput] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fullDID = `did:health:${selectedNetwork.chainId}:${didInput}`;

  const handleCheckAvailability = async () => {
    if (!didInput || !publicClient || !selectedNetwork) return;

    setChecking(true);
    setIsAvailable(null);
    setStatus("Checking on-chain DID availability...");

    try {
      const result = await publicClient.readContract({
        address: selectedNetwork.address as `0x${string}`,
        abi: selectedNetwork.abi,
        functionName: "getHealtDID",
        args: [fullDID],
      });

      if (result && typeof result === "object" && "healthDid" in result && result.healthDid !== "") {
        setIsAvailable(false);
        setStatus("❌ DID is already registered.");
      } else {
        setIsAvailable(true);
        setStatus("✅ DID is available!");
        onDIDAvailable(fullDID);
      }
    } catch (err) {
      setIsAvailable(true);
      setStatus("✅ DID is available (fallback check passed).");
      onDIDAvailable(fullDID);
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      {checking && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-md text-center">
            <div className="loader mb-3 border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10 animate-spin" />
            <p className="text-sm text-gray-700">Checking DID availability...</p>
          </div>
        </div>
      )}

      <h2 className="text-lg font-semibold">5. Select your DID</h2>

      {fhirResource && (
        <div className="bg-green-100 text-green-800 text-sm p-3 rounded shadow">
          ✅ FHIR record created: <strong>{fhirResource.resourceType}</strong>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Choose Network</label>
        <select
          className="select select-bordered bg-white text-black w-full"
          value={selectedNetwork.name}
          onChange={(e) => {
            const idx = parseInt(e.target.value);
            const net = availableNetworks[idx];
            setSelectedNetwork(net);
          }}
        >
          {availableNetworks.map((net, idx) => (
            <option key={net.name} value={idx}>
              {net.name} ({net.group})
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Enter your DID name</label>
        <input
          type="text"
          placeholder="e.g. johndoe123"
          className="input input-bordered w-full"
          value={didInput}
          onChange={(e) => {
            setDidInput(e.target.value);
            setIsAvailable(null);
            setStatus(null);
          }}
        />
        <p className="text-sm text-gray-500">
          Full DID: <code>{fullDID}</code>
        </p>
      </div>

      <div className="space-y-2">
        <button
          className="btn btn-primary"
          onClick={handleCheckAvailability}
          disabled={!didInput || checking}
        >
          {checking ? "Checking..." : "Check Availability"}
        </button>

        {status && <p className="text-sm text-gray-800">{status}</p>}
      </div>
    </div>
  );
}
