import { useEffect } from "react";
import Link from "next/link";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { Button } from "@mui/material";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon } from "@heroicons/react/24/outline";
import { MetaHeader } from "~~/components/MetaHeader";

const Home: NextPage = () => {
  const { address } = useAccount();
  async function connect() {
    const client = new LitJsSdk.LitNodeClient({ alertWhenUnauthorized: false });
    await client.connect();
    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain: "mumbai" });
    console.log("authSig", authSig);
  }
  useEffect(() => {
    if (!address) return;
    connect();
  }, [address]);
  return (
    <>
      <MetaHeader />
      <div className="flex items-center flex-col flex-grow pt-10">
        <div className="px-5">
          <h1 className="text-center mb-8">
            <span className="block text-2xl mb-2">Welcome to</span>
            <span className="block text-4xl font-bold">DID Health (did:health)😃</span>
          </h1>
          <p className="text-center text-lg">
            did:health is a{" "}
            <code className="italic bg-base-300 text-base font-bold max-w-full break-words break-all inline-block">
              W3C-compliant Decentralized Identifier (DID) solution
            </code>{" "}
            tailored for the healthcare sector.  DID:Health helps you manage your identity in the healthcare system and provides a bridge to your personal medical records.
            Your did:health identifier is interoperable with any health system that support Fast Healthcare Interoperability Resources.
          </p>
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
            <Link href="/create-patient">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg">
                <BugAntIcon className="h-8 w-8 fill-secondary" />
                <p>1. Connect/Create wallet and create Your Patient Profile</p>
              </div>
            </Link>
            <Link href="/did-document">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl shadow-lg">
                <BugAntIcon className="h-8 w-8 fill-secondary" />
                <p>2. Share your HealthCare Idenitty with did:health</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
