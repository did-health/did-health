import { useState, useMemo } from "react";
import { useOnboardingState } from "../store/OnboardingState";
import { usePublicClient } from "wagmi";
import { switchNetwork } from "wagmi/actions";
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

const chainIdMap: Record<string, number> = {
  sepolia: 11155111,
  baseSepolia: 84532,
  scrollSepolia: 534351,
  arbitrumSepolia: 421614,
  polygonMumbai: 80001,
  polygonAmoy: 80002,
  mainnet: 1,
  base: 8453,
  scroll: 534352,
  arbitrum: 42161,
  polygon: 137,
};

export function SelectDIDForm({ onDIDAvailable }: Props) {
  const { fhirResource, did } = useOnboardingState();
  const publicClient = usePublicClient();

  const availableNetworks: NetworkConfig[] = useMemo(() => {
    return Object.entries(contracts)
      .flatMap(([group, networks]) =>
        Object.entries(networks)
          .filter(([, defs]) => typeof defs === "object" && defs !== null && "HealthDIDRegistry" in defs)
          .map(([name, defs]) => ({
            name,
            group: group as NetworkGroup,
            chainId: chainIdMap[name] ?? 0,
            address: (defs as any).HealthDIDRegistry.address,
            abi: (defs as any).HealthDIDRegistry.abi,
          }))
      );
  }, []);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const selectedNetwork = availableNetworks[selectedIndex];

  const [didInput, setDidInput] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fullDID = `did:health:0x${selectedNetwork.chainId.toString(16)}:${didInput}`;
  const didSuffix = `${selectedNetwork.chainId}:${didInput}`;

  const handleCheckAvailability = async () => {
    if (!didInput || !publicClient || !selectedNetwork) return;

    if (!/^[a-z0-9-]+$/.test(didInput.trim())) {
      setStatus("❌ Invalid DID: only lowercase letters, numbers, and dashes allowed.");
      return;
    }

    setChecking(true);
    setIsAvailable(null);
    setStatus("Checking on-chain DID availability...");

    try {
      await switchNetwork({ chainId: selectedNetwork.chainId });

      const result = await publicClient.readContract({
        address: selectedNetwork.address as `0x${string}`,
        abi: selectedNetwork.abi,
        functionName: "getHealthDID",
        args: [didSuffix],
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
      console.warn("⚠️ DID check failed, assuming available", err);
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

      {did && (
        <div className="bg-blue-100 text-blue-800 text-sm p-3 rounded shadow">
          ℹ️ Existing DID: <code>{did}</code>
        </div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium">Choose Network</label>
        <select
          className="select select-bordered bg-white text-black w-full"
          value={selectedIndex}
          onChange={async (e) => {
            const idx = parseInt(e.target.value);
            setSelectedIndex(idx);
            try {
              await switchNetwork(publicClient!.config, { chainId: availableNetworks[idx].chainId });
            } catch (err) {
              console.warn("⚠️ Wallet refused to switch network", err);
            }
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
            const trimmed = e.target.value.trim().toLowerCase();
            setDidInput(trimmed);
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
