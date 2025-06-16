import { useState } from "react";
import { useOnboardingState } from "../store/OnboardingState";
import { useConfig, useChainId } from "wagmi";
import { switchChain } from "wagmi/actions";
import { createPublicClient, http, defineChain } from "viem";
import deployedContracts from "../generated/deployedContracts";

type Props = {
  onDIDAvailable: (did: string) => void;
};

export function SelectDIDForm({ onDIDAvailable }: Props) {
  const config = useConfig();
  const chainId = useChainId();
  const { fhirResource, did } = useOnboardingState();

  const [didInput, setDidInput] = useState("");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const fullDID = `did:health:${chainId}:${didInput}`;

  //const fullDID = `did:health:${getChainIdHex(chainId)}:${didInput}`;

  const handleCheckAvailability = async () => {
    if (!didInput || !chainId) return;

    if (!/^[a-z0-9-]+$/.test(didInput.trim())) {
      setStatus("❌ Invalid DID: only lowercase letters, numbers, and dashes allowed.");
      return;
    }

    setChecking(true);
    setIsAvailable(null);
    setStatus("Checking on-chain DID availability...");

    try {
      await switchChain(config, { chainId });

      // 🔍 Find matching contract + RPC for this chainId
      let contractInfo: any = null;
      let chainName = "Unknown Chain";
      let rpcUrl = "http://localhost:8545";

      for (const env of Object.values(deployedContracts)) {
        for (const [networkKey, contracts] of Object.entries(env)) {
          if (
            contracts &&
            typeof contracts === "object" &&
            "HealthDIDRegistry" in contracts
          ) {
            const contract = (contracts as any).HealthDIDRegistry;
            if (contract?.chainId === chainId) {
              contractInfo = contract;
              chainName = networkKey;
              rpcUrl = contract.rpcUrl || rpcUrl;
              break;
            }
          }
        }
        if (contractInfo) break;
      }

      if (!contractInfo?.address || !contractInfo?.abi) {
        throw new Error(`❌ No HealthDIDRegistry deployed for chainId: ${chainId}`);
      }

      const client = createPublicClient({
        chain: defineChain({
          id: chainId,
          name: chainName,
          rpcUrls: { default: { http: [rpcUrl] } },
          nativeCurrency: {
            name: "ETH",
            symbol: "ETH",
            decimals: 18,
          },
        }),
        transport: http(),
      });

      type HealthDIDResult = { owner: string };
      let result: HealthDIDResult | undefined;
      try {
        result = await client.readContract({
          address: contractInfo.address as `0x${string}`,
          abi: contractInfo.abi,
          functionName: "getHealthDID",
          args: [`${chainId}:${didInput}`],
        }) as HealthDIDResult;
      } catch (err: any) {
        if (err.message?.includes("revert") || err.message?.includes("execution reverted")) {
          setIsAvailable(true);
          setStatus("✅ DID is available!");
          onDIDAvailable(fullDID);
          return;
        }
        throw err;
      }

      if (result?.owner && result.owner !== "0x0000000000000000000000000000000000000000") {
        setIsAvailable(false);
        setStatus("❌ DID is already registered.");
      } else {
        setIsAvailable(true);
        setStatus("✅ DID is available!");
        onDIDAvailable(fullDID);
      }
    } catch (err: any) {
      console.error("❌ Error during DID availability check", err);
      setIsAvailable(null);
      setStatus(`⚠️ Could not verify DID availability: ${err.message}`);
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

      {fhirResource && (
        <div className="bg-green-100 text-green-800 text-sm p-3 rounded shadow">
          ✅ FHIR record created: <strong>{fhirResource.resourceType}</strong>
        </div>
      )}


      <div className="space-y-2">
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
